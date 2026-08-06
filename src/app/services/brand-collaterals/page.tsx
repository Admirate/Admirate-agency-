import type { Metadata } from "next";
import CollateralsClient from "@/components/service/brand-collaterals/CollateralsClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, ld, AREA_SERVED } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Brand Collaterals in Hyderabad",
  description:
    "Business cards, brand guidelines, packaging, merch and signage — the physical proof of a strong identity, specified and produced to hold up in the hand.",
  path: "/services/brand-collaterals",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/brand-collaterals#service`,
    name: "Brand Collaterals",
    description:
      "Stationery, brand guidelines, packaging, print collateral, merchandise and signage.",
    url: `${SITE.url}/services/brand-collaterals`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: AREA_SERVED,
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Brand Collaterals", path: "/services/brand-collaterals" },
  ]),
  /* The FAQ block is rendered on the page (see shared/service-prose.ts), so
     the FAQPage entry describes something a visitor can actually read — which
     is the condition Google attaches to the markup. */
  faqSchema("brand-collaterals"),
].filter(Boolean);

export default function BrandCollateralsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <CollateralsClient />
    </>
  );
}
