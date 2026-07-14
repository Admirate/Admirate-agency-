import type { Metadata } from "next";
import StartClient from "@/components/start/StartClient";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Start a Project",
  description:
    "Tell us about your project — branding, websites, social, video or packaging. We reply within one working day.",
  path: "/start-project",
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Start a Project", path: "/start-project" },
]);

export default function StartProjectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <StartClient />
    </>
  );
}
