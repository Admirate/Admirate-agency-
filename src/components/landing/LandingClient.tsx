"use client";

import RawPage from "@/components/RawPage";
import { LANDING_CSS, LANDING_HTML } from "@/components/landing/content";
import initLanding from "@/components/landing/init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function LandingClient() {
  return (
    <RawPage
      css={LANDING_CSS + NAV_CSS}
      html={navHtml("home", "#contact") + LANDING_HTML}
      init={() => {
        const stopNav = initNav();
        const stopPage = initLanding();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
