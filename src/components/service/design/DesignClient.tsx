"use client";

import RawPage from "@/components/RawPage";
import { DESIGN_CSS, DESIGN_HTML } from "./content";
import initDesign from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function DesignClient() {
  return (
    <RawPage
      css={DESIGN_CSS + NAV_CSS}
      html={navHtml("services", "/start-project?service=Design") + DESIGN_HTML}
      init={() => {
        const stopNav = initNav();
        const stopPage = initDesign();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
