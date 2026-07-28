import type { MetadataRoute } from "next";
import { POSTS } from "@/components/blogs/posts";
import { SERVICE_LIST } from "@/components/service/registry";
import { LEGAL_DOCS } from "@/components/legal/docs";
import { SITE } from "@/lib/seo";

/** Move this date only when the static public pages meaningfully change. */
const PAGES_UPDATED = new Date("2026-07-27");

const sitemapEntries = (): MetadataRoute.Sitemap => [
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
    url: `${SITE.url}/pricing`,
    lastModified: PAGES_UPDATED,
    /* Weekly, not monthly: the figures are administrator-editable without a
       deployment, so this page can change on a day nothing else does. */
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE.url}/start-project`,
    lastModified: PAGES_UPDATED,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${SITE.url}/sitemap`,
    lastModified: PAGES_UPDATED,
    changeFrequency: "monthly",
    priority: 0.4,
  },
  ...SERVICE_LIST.map((service) => ({
    url: `${SITE.url}/services/${service.slug}`,
    lastModified: PAGES_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  {
    url: `${SITE.url}/blogs`,
    lastModified: POSTS.reduce(
      (latest, post) =>
        new Date(post.date) > latest ? new Date(post.date) : latest,
      new Date(0),
    ),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  ...POSTS.map((post) => ({
    url: `${SITE.url}/blogs/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  })),
  ...LEGAL_DOCS.map((doc) => ({
    url: `${SITE.url}/${doc.slug}`,
    lastModified: new Date(doc.updated),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  })),
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const renderEntry = (entry: MetadataRoute.Sitemap[number]) => {
  const lastModified = entry.lastModified
    ? entry.lastModified instanceof Date
      ? entry.lastModified.toISOString()
      : new Date(entry.lastModified).toISOString()
    : undefined;

  return [
    "<url>",
    `<loc>${escapeXml(entry.url)}</loc>`,
    lastModified ? `<lastmod>${lastModified}</lastmod>` : "",
    entry.changeFrequency
      ? `<changefreq>${entry.changeFrequency}</changefreq>`
      : "",
    entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : "",
    "</url>",
  ]
    .filter(Boolean)
    .join("\n");
};

const renderSitemap = (entries: MetadataRoute.Sitemap) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(renderEntry)
    .join("\n")}\n</urlset>\n`;

export const dynamic = "force-static";

export function GET() {
  return new Response(renderSitemap(sitemapEntries()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
