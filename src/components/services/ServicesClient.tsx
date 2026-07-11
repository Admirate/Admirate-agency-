"use client";

import RawPage from "@/components/RawPage";
import { SERVICES_CSS, SERVICES_HTML } from "@/components/services/content";
import initServices from "@/components/services/init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function ServicesClient() {
  return (
    <RawPage
      css={SERVICES_CSS + NAV_CSS}
      html={navHtml("services") + SERVICES_HTML}
      init={() => {
        const stopNav = initNav();
        const stopPage = initServices();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
