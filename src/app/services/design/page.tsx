import type { Metadata } from "next";
import DesignClient from "@/components/service/design/DesignClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Advertising & Design",
  description:
    "Advertising and design work placed where the eye actually goes — campaign creative, print, digital and art direction built for how people really look at things.",
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
    areaServed: { "@type": "Country", name: SITE.country },
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Design", path: "/services/design" },
  ]),
];

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
