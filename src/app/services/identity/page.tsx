import type { Metadata } from "next";
import IdentityClient from "@/components/service/identity/IdentityClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld, AREA_SERVED } from "@/lib/schema";

/**
 * Identity is authored as its own page rather than through the shared
 * [slug] route, so it can be a genuinely different experience from the other
 * five. A static segment takes precedence over the sibling dynamic segment in
 * Next's router, and `[slug]`'s generateStaticParams filters this slug out, so
 * there is exactly one route serving /services/identity.
 */
export const metadata: Metadata = pageMeta({
  title: "Brand Identity & Logo Design in Hyderabad",
  description:
    "Logos and brand identity built to be recognised in half a second — a full system of mark, type, colour and rules that keeps your brand looking like itself everywhere.",
  path: "/services/identity",
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE.url}/services/identity#service`,
  name: "Identity",
  description:
    "Brand identity and logo design: mark, typography, colour and the guidelines that hold them together.",
  url: `${SITE.url}/services/identity`,
  provider: { "@id": `${SITE.url}/#organization` },
  areaServed: AREA_SERVED,
};

const jsonLd = [
  serviceSchema,
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Identity", path: "/services/identity" },
  ]),
];

export default function IdentityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <IdentityClient />
    </>
  );
}
