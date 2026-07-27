import type { Metadata } from "next";
import SitemapClient from "@/components/sitemap/SitemapClient";
import { SITEMAP_CSS, SITEMAP_HTML } from "@/components/sitemap/content";
import { FOOTER_CSS, footerHtml } from "@/components/shared/footer";
import { NAV_CSS, navHtml } from "@/components/shared/nav";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Sitemap",
  description:
    "Browse every public page on ADMIRATE, including services, journal articles, project enquiries, and legal information.",
  path: "/sitemap",
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Sitemap", path: "/sitemap" },
]);

/* Content registries stay on the server side. The client receives only the
   finished HTML/CSS strings it needs to hydrate and enhance. */
const pageCss = SITEMAP_CSS + NAV_CSS + FOOTER_CSS;
const pageHtml = navHtml("none") + SITEMAP_HTML + footerHtml();

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <SitemapClient css={pageCss} html={pageHtml} />
    </>
  );
}
