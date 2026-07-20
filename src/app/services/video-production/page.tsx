import type { Metadata } from "next";
import VideoClient from "@/components/service/video-production/VideoClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Video Production",
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
    areaServed: { "@type": "Country", name: SITE.country },
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Video Production", path: "/services/video-production" },
  ]),
];

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
