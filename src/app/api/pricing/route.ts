import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/api-auth";
import { PRICING_TAG } from "@/lib/pricing";

/* GET is intentionally public — /pricing renders from it, and so would any
   future consumer. The writes below are admin-only for the same reason the
   portfolio writes are: an open PATCH here would let an attacker publish a
   price of their choosing on a public marketing page. */

/** Only these tables are reachable through this route. */
const TABLES = {
  currencies: "pricing_currencies",
  plans: "pricing_plans",
  amounts: "pricing_amounts",
  features: "pricing_features",
} as const;

type TableKey = keyof typeof TABLES;

const isTableKey = (value: unknown): value is TableKey =>
  typeof value === "string" && value in TABLES;

const badTable = () =>
  NextResponse.json(
    { error: `table must be one of: ${Object.keys(TABLES).join(", ")}` },
    { status: 400 },
  );

/**
 * Purges the public page's cached payload.
 *
 * Next 16 requires a cache-life profile alongside the tag; "max" covers every
 * profile, which is what an administrative price change needs — the point of
 * storing prices in the database is that a correction is live without a
 * deployment, so a partial purge would defeat the feature.
 */
const purge = () => revalidateTag(PRICING_TAG, "max");

/**
 * The write handlers dispatch across four tables from one JSON body, so the
 * table name is a union at the type level and Supabase resolves every column
 * name against it to `never`. Widening the client keeps the dispatch in one
 * place instead of fanning it into four near-identical handlers.
 *
 * Nothing is lost that was protecting anything: what guards these calls is
 * `isTableKey` plus the explicit key checks in each handler, and both run at
 * runtime. The typed client is still used for the public GET, where the row
 * shapes are what callers actually consume.
 *
 * It is the *admin* client. It used to widen the anon one, which meant the name
 * promised a privilege it never carried: the four `pricing_*` tables have
 * public read policies and no write policy, so every save came back as "new row
 * violates row-level security policy" and editing a price had never once
 * worked. Each caller below runs `requireAdmin()` first.
 */
const writeClient = async () =>
  createAdminClient() as unknown as SupabaseClient;

export async function GET() {
  try {
    const supabase = await createClient();

    /* One round trip per table rather than one nested select: the four are
       independent, the payload is small, and a join would have to be unpicked
       on the client anyway to drive the currency and cycle switches. */
    const [currencies, plans, amounts, features] = await Promise.all([
      supabase
        .from("pricing_currencies")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_plans")
        .select("*")
        .order("tier_order", { ascending: true }),
      supabase.from("pricing_amounts").select("*"),
      supabase
        .from("pricing_features")
        .select("*")
        .order("row_order", { ascending: true }),
    ]);

    const failed = [currencies, plans, amounts, features].find((r) => r.error);
    if (failed?.error) {
      console.error("Fetch pricing error:", failed.error);
      return NextResponse.json(
        { error: "Failed to fetch pricing" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      currencies: currencies.data ?? [],
      plans: plans.data ?? [],
      amounts: amounts.data ?? [],
      features: features.data ?? [],
    });
  } catch (error) {
    console.error("Pricing API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { table, ...row } = await request.json();
    if (!isTableKey(table)) return badTable();

    const supabase = await writeClient();

    /* Amounts are upserted rather than inserted: the composite key means an
       administrator setting a price for a currency that has no row yet and one
       correcting an existing row are the same gesture. */
    const query =
      table === "amounts"
        ? supabase
            .from(TABLES.amounts)
            .upsert(row, { onConflict: "plan_id,currency_code" })
        : supabase.from(TABLES[table]).insert(row);

    const { data, error } = await query.select().single();

    if (error) {
      console.error(`Create ${table} error:`, error);
      return NextResponse.json(
        { error: `Failed to create ${table}` },
        { status: 500 },
      );
    }

    purge();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Pricing POST error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { table, id, plan_id, currency_code, code, ...updates } =
      await request.json();
    if (!isTableKey(table)) return badTable();

    const supabase = await writeClient();
    let query = supabase.from(TABLES[table]).update(updates);

    /* Each table is keyed differently — uuid, currency code, or the composite
       (plan_id, currency_code). Matching on the wrong column would silently
       update every row, so an unmatched key is a 400 rather than a fallthrough. */
    if (table === "currencies") {
      if (!code) {
        return NextResponse.json({ error: "code is required" }, { status: 400 });
      }
      query = query.eq("code", code);
    } else if (table === "amounts") {
      if (!plan_id || !currency_code) {
        return NextResponse.json(
          { error: "plan_id and currency_code are required" },
          { status: 400 },
        );
      }
      query = query.eq("plan_id", plan_id).eq("currency_code", currency_code);
    } else {
      if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
      }
      query = query.eq("id", id);
    }

    const { error } = await query;

    if (error) {
      console.error(`Update ${table} error:`, error);
      return NextResponse.json(
        { error: `Failed to update ${table}` },
        { status: 500 },
      );
    }

    purge();
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Pricing PATCH error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { table, id, plan_id, currency_code } = await request.json();
    if (!isTableKey(table)) return badTable();

    /* Currencies are not deletable through the API. Removing one would orphan
       its amount rows and silently drop a market; `active: false` is the
       reversible way to take a currency off the switcher, and that is a PATCH. */
    if (table === "currencies") {
      return NextResponse.json(
        { error: "Set active: false instead of deleting a currency" },
        { status: 400 },
      );
    }

    const supabase = await writeClient();
    let query = supabase.from(TABLES[table]).delete();

    if (table === "amounts") {
      if (!plan_id || !currency_code) {
        return NextResponse.json(
          { error: "plan_id and currency_code are required" },
          { status: 400 },
        );
      }
      query = query.eq("plan_id", plan_id).eq("currency_code", currency_code);
    } else {
      if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
      }
      query = query.eq("id", id);
    }

    const { error } = await query;

    if (error) {
      console.error(`Delete ${table} error:`, error);
      return NextResponse.json(
        { error: `Failed to delete ${table}` },
        { status: 500 },
      );
    }

    purge();
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Pricing DELETE error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
