import type { Metadata } from "next";
import SocialClient from "@/components/service/social-media/SocialClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, ld, AREA_SERVED } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Social Media & Reels in Hyderabad",
  description:
    "Reels, creatives and campaigns made to convert, not just post — scripted, shot and cut in-house, with every piece routed somewhere useful.",
  path: "/services/social-media",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/social-media#service`,
    name: "Social Media",
    description:
      "Reels, feed creative, campaigns and content systems, produced to route attention somewhere useful.",
    url: `${SITE.url}/services/social-media`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: AREA_SERVED,
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Social Media", path: "/services/social-media" },
  ]),
  /* The FAQ block is rendered on the page (see shared/service-prose.ts), so
     the FAQPage entry describes something a visitor can actually read — which
     is the condition Google attaches to the markup. */
  faqSchema("social-media"),
].filter(Boolean);

export default function SocialMediaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <SocialClient />
    </>
  );
}
