import type { Metadata } from "next";
import LegalClient from "@/components/legal/LegalClient";
import { PRIVACY } from "@/components/legal/docs";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: PRIVACY.metaTitle,
  description: PRIVACY.description,
  path: `/${PRIVACY.slug}`,
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: PRIVACY.title, path: `/${PRIVACY.slug}` },
]);

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <LegalClient doc={PRIVACY} />
    </>
  );
}
