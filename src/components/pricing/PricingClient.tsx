"use client";

import RawPage from "@/components/RawPage";
import { PRICING_CSS, pricingHtml, type PricingView } from "./content";
import initPricing from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

/**
 * Takes the resolved view as a prop rather than fetching.
 *
 * The prices are already in the markup this returns, so they are in the HTML
 * the server delivers — which is the whole point of resolving the currency at
 * the edge. A fetch here would reintroduce the price flash the design exists
 * to avoid.
 */
export default function PricingClient({ view }: { view: PricingView }) {
  return (
    <RawPage
      css={PRICING_CSS + NAV_CSS}
      html={navHtml("pricing", "/start-project") + pricingHtml(view)}
      init={() => {
        const stopNav = initNav();
        const stopPage = initPricing();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
