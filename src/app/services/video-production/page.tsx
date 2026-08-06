import type { Metadata } from "next";
import VideoClient from "@/components/service/video-production/VideoClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, ld, AREA_SERVED } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Video Production in Hyderabad",
  description:
    "Films, ads and brand stories, scripted and shot in-house — built around what the film has to achieve, and cut for every place it has to play.",
  path: "/services/video-production",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/video-production#service`,
    name: "Video Production",
    description:
      "Brand films, advertising, scripting, production, post and cutdowns for every placement.",
    url: `${SITE.url}/services/video-production`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: AREA_SERVED,
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Video Production", path: "/services/video-production" },
  ]),
  /* The FAQ block is rendered on the page (see shared/service-prose.ts), so
     the FAQPage entry describes something a visitor can actually read — which
     is the condition Google attaches to the markup. */
  faqSchema("video-production"),
].filter(Boolean);

export default function VideoProductionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <VideoClient />
    </>
  );
}
