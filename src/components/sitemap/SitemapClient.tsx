"use client";

import RawPage from "@/components/RawPage";
import { initFooter } from "@/components/shared/footer";
import { initNav } from "@/components/shared/nav";

/** Hydrates the server-composed page and owns only its small DOM enhancements. */
export default function SitemapClient({
  css,
  html,
}: {
  css: string;
  html: string;
}) {
  return (
    <RawPage
      css={css}
      html={html}
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
