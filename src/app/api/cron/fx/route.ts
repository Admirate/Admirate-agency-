import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PRICING_TAG } from "@/lib/pricing";

/**
 * Daily exchange-rate refresh for the derived currencies.
 *
 * Frankfurter is free, needs no API key, and republishes European Central Bank
 * reference rates. The call is made here, on the server, once a day — not from
 * the pricing page — so the public page never depends on a third party being
 * up, no Content-Security-Policy entry is needed, and no visitor waits on it.
 *
 * Guarded by CRON_SECRET, matching /api/cron/send-email.
 */

const RATES_URL = "https://api.frankfurter.dev/v1/latest?base=AED";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: derived, error: readError } = await supabase
      .from("pricing_currencies")
      .select("code")
      .eq("authored", false);

    if (readError) {
      console.error("FX currency read error:", readError);
      return NextResponse.json(
        { error: "Failed to read currencies" },
        { status: 500 },
      );
    }

    if (!derived || derived.length === 0) {
      return NextResponse.json({ message: "No derived currencies" });
    }

    /* A provider failure is logged and returns 200 without writing. The
       existing rates stay in place and the page keeps serving the last known
       good figures — a stale rate is always preferable to a missing price, and
       a 500 here would make the scheduled function look broken when the only
       thing wrong is someone else's uptime. */
    let rates: Record<string, number>;
    try {
      const response = await fetch(RATES_URL, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("FX provider responded", response.status);
        return NextResponse.json({
          message: `Rates unchanged — provider returned ${response.status}`,
        });
      }

      const body = await response.json();
      rates = body?.rates ?? {};
    } catch (error) {
      console.error("FX fetch failed:", error);
      return NextResponse.json({ message: "Rates unchanged — fetch failed" });
    }

    const now = new Date().toISOString();
    const updated: string[] = [];
    const missing: string[] = [];

    for (const { code } of derived) {
      const rate = rates[code];

      /* A rate the provider did not return is skipped, not written as zero. A
         zero rate would price every plan in that currency at nothing. */
      if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
        missing.push(code);
        continue;
      }

      const { error } = await supabase
        .from("pricing_currencies")
        .update({ rate, rate_updated_at: now })
        .eq("code", code);

      if (error) {
        console.error(`FX write error for ${code}:`, error);
        missing.push(code);
        continue;
      }

      updated.push(code);
    }

    if (updated.length) revalidateTag(PRICING_TAG, "max");

    return NextResponse.json({
      message: `Updated ${updated.length} of ${derived.length} rates`,
      updated,
      ...(missing.length ? { skipped: missing } : {}),
    });
  } catch (error) {
    console.error("FX cron error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
