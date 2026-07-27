"use client";

import RawPage from "@/components/RawPage";
import { SITEMAP_CSS, SITEMAP_HTML } from "@/components/sitemap/content";
import { FOOTER_CSS, footerHtml, initFooter } from "@/components/shared/footer";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

/** Composes the directory with the same navigation and footer as public pages. */
export default function SitemapClient() {
  return (
    <RawPage
      css={SITEMAP_CSS + NAV_CSS + FOOTER_CSS}
      html={navHtml("none") + SITEMAP_HTML + footerHtml()}
      init={() => {
        const stopNav = initNav();
        const stopFooter = initFooter();
        return () => {
          stopNav();
          stopFooter();
        };
      }}
    />
  );
}
