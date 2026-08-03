import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { PRICING_TAG } from "@/lib/pricing";
import type { Database } from "@/types/database";

type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type PricingPayload = {
  currencies: Row<"pricing_currencies">[];
  plans: Row<"pricing_plans">[];
  amounts: Row<"pricing_amounts">[];
  features: Row<"pricing_features">[];
};

/**
 * Reads the rate card behind the `pricing` cache tag.
 *
 * Extracted from the pricing page so /start-project reads the same payload
 * behind the same tag. Two readers with two caches would let the wizard quote
 * a figure the pricing page had already corrected.
 *
 * An anonymous client, not the cookie-bound one from `lib/supabase/server`:
 * this is public data under a public-SELECT policy, and `cookies()` cannot be
 * called inside `unstable_cache` anyway. The database is queried when an
 * administrative write invalidates the tag, not on every page view — so the
 * per-request work is header parsing and string formatting, nothing more.
 */
export const getPricing = unstable_cache(
  async (): Promise<PricingPayload> => {
    const supabase = createClient<Database>(
      process.env.SB_URL!,
      process.env.SB_KEY!,
    );

    const [currencies, plans, amounts, features] = await Promise.all([
      supabase
        .from("pricing_currencies")
        .select("*")
        .eq("active", true)
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

    /* A failure throws rather than returning empty. The framework error
       boundary is a better answer than a pricing page showing blank prices. */
    const failed = [currencies, plans, amounts, features].find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    return {
      currencies: currencies.data ?? [],
      plans: plans.data ?? [],
      amounts: amounts.data ?? [],
      features: features.data ?? [],
    };
  },
  ["pricing-payload"],
  /* 60s, not an hour. A write through the dashboard purges the tag and is
     live immediately, but a price corrected straight in the Supabase table
     editor bypasses that — and an hour of a public page showing the old
     figure is the kind of gap nobody notices until a client quotes it back.
     The query is four small selects, so the floor costs little. */
  { tags: [PRICING_TAG], revalidate: 60 },
);
