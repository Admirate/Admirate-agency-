"use client";

import RawPage from "@/components/RawPage";
import { LEGAL_CSS, legalHtml } from "@/components/legal/content";
import type { LegalDoc } from "@/components/legal/docs";
import { FOOTER_CSS, footerHtml, initFooter } from "@/components/shared/footer";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

/**
 * Both legal pages render through here — they differ only by the document
 * passed in.
 *
 * `navHtml("none")` is deliberate: these pages are reachable from the footer,
 * not the primary nav, so no nav item should light up. Passing "home" would
 * highlight a link that does not lead here.
 */
export default function LegalClient({ doc }: { doc: LegalDoc }) {
  return (
    <RawPage
      css={LEGAL_CSS + NAV_CSS + FOOTER_CSS}
      html={navHtml("none") + legalHtml(doc) + footerHtml()}
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
