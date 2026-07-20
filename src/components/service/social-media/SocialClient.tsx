"use client";

import RawPage from "@/components/RawPage";
import { SOCIAL_CSS, SOCIAL_HTML } from "./content";
import initSocial from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function SocialClient() {
  return (
    <RawPage
      css={SOCIAL_CSS + NAV_CSS}
      html={
        navHtml("services", "/start-project?service=Social%20Media") + SOCIAL_HTML
      }
      init={() => {
        const stopNav = initNav();
        const stopPage = initSocial();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
