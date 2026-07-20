"use client";

import RawPage from "@/components/RawPage";
import { IDENTITY_CSS, IDENTITY_HTML } from "./content";
import initIdentity from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

/**
 * The pill nav stays — a visitor here is still browsing, and the services menu
 * is how they move between the six. The CTA carries the service through to the
 * brief page, which preselects the matching chips.
 */
export default function IdentityClient() {
  return (
    <RawPage
      css={IDENTITY_CSS + NAV_CSS}
      html={navHtml("services", "/start-project?service=Identity") + IDENTITY_HTML}
      init={() => {
        const stopNav = initNav();
        const stopPage = initIdentity();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
