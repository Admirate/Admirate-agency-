import { SITE } from "@/lib/seo";
import { readingMinutes, wordCount, type Post } from "@/components/blogs/posts";

/**
 * JSON-LD builders.
 *
 * Every claim here is one the site can actually back up. Notably absent:
 * `address`/`geo` (no verified street address in the codebase) and `sameAs`
 * (no social profile URLs — the only external link is a wa.me number, which is
 * a chat endpoint, not a profile). Structured data asserting things Google can
 * contradict is worse than omitting them, so they are left out until someone
 * supplies the real values. See ORG_TODO below.
 */

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

/**
 * Serialises JSON-LD for injection into a <script> tag.
 *
 * `<` is escaped because a "</script>" appearing anywhere in the data — a post
 * title, an excerpt — would otherwise close the tag early and spill the rest of
 * the payload into the document as markup. The data is ours today; this keeps
 * that from becoming a trap the day it isn't.
 */
export const ld = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: SITE.name,
  url: SITE.url,
  logo: SITE.logo,
  image: SITE.logo,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  priceRange: "$$",
  areaServed: { "@type": "Country", name: SITE.country },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.phone,
    email: SITE.email,
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  knowsAbout: [
    "Brand Identity",
    "Logo Design",
    "Web Design",
    "Social Media Management",
    "Video Production",
    "Packaging Design",
    "Digital Advertising",
    "Brand Collaterals",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en-IN",
  publisher: { "@id": ORG_ID },
};

/** The six services, matching the nav menu and the sections on /services. */
const SERVICES = [
  ["Design", "Advertising and design work placed where the eye actually goes."],
  ["Identity", "Logos and brand identity built to be recognised in half a second."],
  ["Digital", "Websites that load fast and convert."],
  ["Websites", "Client websites designed, built and shipped end to end."],
  ["Social Media", "Reels, creatives and campaigns made to convert, not just post."],
  ["Video Production", "Films, ads and brand stories, scripted and shot in-house."],
  ["Brand Collaterals", "The physical proof of a strong identity."],
] as const;

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services",
  itemListElement: SERVICES.map(([name, description], i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name,
      description,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: SITE.country },
    },
  })),
};

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.path}`,
    })),
  };
}

export function blogPostingSchema(post: Post) {
  const url = `${SITE.url}/blogs/${post.slug}`;

  // The article body is structured blocks, not prose — count the words the
  // reader actually sees so wordCount isn't a guess.
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.excerpt,
    articleSection: post.tag,
    datePublished: post.date,
    // No edit history is tracked, so the publish date is the honest answer.
    dateModified: post.date,
    wordCount: wordCount(post),
    timeRequired: `PT${readingMinutes(post)}M`,
    inLanguage: "en-IN",
    image: `${url}/opengraph-image`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * ORG_TODO — supply these and the Organization block gets materially stronger
 * in local/knowledge-panel results:
 *   - a verified postal address (streetAddress, addressLocality, postalCode)
 *   - social profile URLs for `sameAs` (Instagram, LinkedIn, X, YouTube)
 *   - opening hours, if the studio has walk-in hours
 */
