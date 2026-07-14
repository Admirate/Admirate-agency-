import type { Metadata } from "next";
import BlogsClient from "@/components/blogs/BlogsClient";
import { POSTS } from "@/components/blogs/posts";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Journal",
  description:
    "Notes from the work — what we've learned building brands, sites and campaigns that have to earn their keep.",
  path: "/blogs",
});

/* The Blog itself, listing its posts, so the index is understood as a
   collection rather than a page that happens to have links on it. */
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE.url}/blogs#blog`,
  url: `${SITE.url}/blogs`,
  name: `${SITE.name} Journal`,
  description:
    "Notes from the work: branding, websites, creative and social.",
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE.url}/#organization` },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    "@id": `${SITE.url}/blogs/${p.slug}#article`,
    url: `${SITE.url}/blogs/${p.slug}`,
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    author: { "@id": `${SITE.url}/#organization` },
  })),
};

const jsonLd = [
  blogSchema,
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blogs" },
  ]),
];

export default function BlogsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <BlogsClient />
    </>
  );
}
