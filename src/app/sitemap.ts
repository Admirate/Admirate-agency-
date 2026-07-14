import { MetadataRoute } from "next";
import { POSTS } from "@/components/blogs/posts";
import { SITE } from "@/lib/seo";

/**
 * Bump this when the static pages meaningfully change.
 *
 * It used to be `new Date()`, which stamped every page as "modified" on every
 * single build. That tells a crawler the whole site changes constantly; when it
 * re-crawls and finds identical content, the signal stops being worth anything.
 * A date that only moves when the pages do is the honest — and more useful —
 * answer. Posts carry their own publish date.
 */
const PAGES_UPDATED = new Date("2026-07-14");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/start-project`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/blogs`,
      lastModified: POSTS.reduce(
        (latest, p) =>
          new Date(p.date) > latest ? new Date(p.date) : latest,
        new Date(0)
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...POSTS.map((p) => ({
      url: `${SITE.url}/blogs/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
