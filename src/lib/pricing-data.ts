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
  /* 300s, not 60. A write through the dashboard purges the tag and is live
     immediately, but a price corrected straight in the Supabase table editor
     bypasses that — so this window is the worst-case staleness for that one
     path, and five minutes is still far inside "nobody quotes it back".
     60s was chosen as a safe floor, but it was measured against traffic this
     page does not have: /pricing takes roughly six impressions a day, so
     nearly every real visitor arrived after the entry had already expired and
     paid for four fresh Supabase selects. Timed against production, a cold
     hit costs ~1.20s to first byte and a warm one ~0.55s. Widening the window
     is what moves the median visitor onto the warm path. */
  { tags: [PRICING_TAG], revalidate: 300 },
);
