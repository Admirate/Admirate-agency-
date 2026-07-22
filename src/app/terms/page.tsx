import type { Metadata } from "next";
import LegalClient from "@/components/legal/LegalClient";
import { TERMS } from "@/components/legal/docs";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: TERMS.metaTitle,
  description: TERMS.description,
  path: `/${TERMS.slug}`,
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: TERMS.title, path: `/${TERMS.slug}` },
]);

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <LegalClient doc={TERMS} />
    </>
  );
}
