import type { Metadata } from "next";
import SitemapClient from "@/components/sitemap/SitemapClient";
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

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <SitemapClient />
    </>
  );
}
