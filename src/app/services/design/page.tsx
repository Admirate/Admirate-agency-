import type { Metadata } from "next";
import DesignClient from "@/components/service/design/DesignClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, ld, AREA_SERVED } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Advertising & Design in Hyderabad",
  /* 160 characters previously — just past what Google renders. */
  description:
    "Advertising and design placed where the eye actually goes: campaign creative, print, digital and art direction built for how people really look.",
  path: "/services/design",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/design#service`,
    name: "Design",
    description:
      "Advertising and design: campaign creative, print, digital placements and art direction.",
    url: `${SITE.url}/services/design`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: AREA_SERVED,
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Design", path: "/services/design" },
  ]),
  /* The FAQ block is rendered on the page (see shared/service-prose.ts), so
     the FAQPage entry describes something a visitor can actually read — which
     is the condition Google attaches to the markup. */
  faqSchema("design"),
].filter(Boolean);

export default function DesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <DesignClient />
    </>
  );
}
