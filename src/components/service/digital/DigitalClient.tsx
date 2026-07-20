"use client";

import RawPage from "@/components/RawPage";
import { DIGITAL_CSS, DIGITAL_HTML } from "./content";
import initDigital from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function DigitalClient() {
  return (
    <RawPage
      css={DIGITAL_CSS + NAV_CSS}
      html={navHtml("services", "/start-project?service=Digital") + DIGITAL_HTML}
      init={() => {
        const stopNav = initNav();
        const stopPage = initDigital();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
