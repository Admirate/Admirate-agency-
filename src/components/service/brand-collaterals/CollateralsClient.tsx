"use client";

import RawPage from "@/components/RawPage";
import { COLLAT_CSS, COLLAT_HTML } from "./content";
import initCollaterals from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function CollateralsClient() {
  return (
    <RawPage
      css={COLLAT_CSS + NAV_CSS}
      html={
        navHtml("services", "/start-project?service=Brand%20Collaterals") +
        COLLAT_HTML
      }
      init={() => {
        const stopNav = initNav();
        const stopPage = initCollaterals();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
