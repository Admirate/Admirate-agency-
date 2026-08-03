"use client";

import RawPage from "@/components/RawPage";
import { START_CSS, startHtml } from "@/components/start/content";
import type { PricingView } from "@/components/pricing/content";
import initStart from "@/components/start/init";

/**
 * Takes the resolved view as a prop rather than fetching, for the same reason
 * PricingClient does: the plan figures are already in the markup this returns,
 * so they are in the HTML the server delivers. A fetch here would reintroduce
 * the price flash the pricing design exists to avoid.
 *
 * No pill nav — this page ships its own "← BACK TO SITE" bar. The pill nav's
 * Home / Services / Blogs links would invite the user straight back out of the
 * funnel they just entered.
 */
export default function StartClient({ view }: { view: PricingView }) {
  return (
    <RawPage
      css={START_CSS}
      html={startHtml(view)}
      init={() => initStart()}
    />
  );
}
