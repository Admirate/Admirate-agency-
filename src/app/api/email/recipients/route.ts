import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/api-auth";
import { toIndustryId } from "@/lib/industries";

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch recipients error:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Recipients API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { email, name, industry } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_recipients")
      // Run through toIndustryId rather than stored as sent: the field is
      // optional, so an unrecognised value becomes Unassigned instead of a
      // 400 that loses an otherwise good address.
      .insert({ email, name, active: true, industry: toIndustryId(industry) })
      .select()
      .single();

    if (error) {
      console.error("Add recipient error:", error);
      return NextResponse.json(
        { error: "Failed to add recipient" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Recipients POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Updates a recipient's status or their industry, one row or many.
 *
 * The two live in one handler because they share all of their targeting. The
 * shape is a discriminator, not a pair of optional fields: a request naming
 * both would be ambiguous about which the caller meant to change, so exactly
 * one has to be present.
 */
export async function PATCH(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, ids, active, industry } = await request.json();

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id or a list of ids is required" },
        { status: 400 }
      );
    }

    const settingActive = typeof active === "boolean";
    const settingIndustry = industry !== undefined;

    if (settingActive === settingIndustry) {
      return NextResponse.json(
        { error: "Send exactly one of active or industry" },
        { status: 400 }
      );
    }

    const patch = settingActive
      ? { active }
      : // Null is a legitimate value here — it is how a row is set back to
        // Unassigned — so an unrecognised id and a deliberate clear land in
        // the same place, which is the right place.
        { industry: toIndustryId(industry) };

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .update(patch)
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Update recipients error:", error);
      return NextResponse.json(
        { error: "Failed to update recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Updated successfully",
      updated: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Deletes one recipient, a named set, or the entire list.
 *
 * `all` is an explicit flag rather than a client-supplied array of every id.
 * Emptying the table should say so: it lets the server recognise the intent,
 * and it means a truncated or half-built id list cannot silently delete a
 * subset nobody chose. The single-`id` shape is unchanged because the row
 * actions still use it.
 */
export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, ids, all } = await request.json();
    const supabase = createAdminClient();

    if (all === true) {
      // Supabase requires a filter on delete. `not id is null` matches every
      // row without naming one.
      const { data, error } = await supabase
        .from("email_recipients")
        .delete()
        .not("id", "is", null)
        .select("id");

      if (error) {
        console.error("Delete all recipients error:", error);
        return NextResponse.json(
          { error: "Failed to delete recipients" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Deleted ${data?.length ?? 0} recipients`,
        deleted: data?.length ?? 0,
      });
    }

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id, a list of ids, or all:true is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("email_recipients")
      .delete()
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Delete recipients error:", error);
      return NextResponse.json(
        { error: "Failed to delete recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        data?.length === 1
          ? "Deleted successfully"
          : `Deleted ${data?.length ?? 0}`,
      deleted: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
