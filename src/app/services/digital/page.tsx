import type { Metadata } from "next";
import DigitalClient from "@/components/service/digital/DigitalClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld, AREA_SERVED } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Websites & Digital in Hyderabad",
  description:
    "Websites that load fast and convert — designed, built and shipped end to end, with performance, structure and search foundations handled properly.",
  path: "/services/digital",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/digital#service`,
    name: "Digital",
    description:
      "Website design and development: performance, structure, enquiry paths and search foundations.",
    url: `${SITE.url}/services/digital`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: AREA_SERVED,
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Digital", path: "/services/digital" },
  ]),
];

export default function DigitalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <DigitalClient />
    </>
  );
}
