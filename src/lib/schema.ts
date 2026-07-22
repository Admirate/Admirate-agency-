import { SITE, PROFILE_URLS } from "@/lib/seo";
import { readingMinutes, wordCount, type Post } from "@/components/blogs/posts";

/**
 * JSON-LD builders.
 *
 * Every claim here is one the site can actually back up. The studio is based in
 * Banjara Hills, Hyderabad, so the address is now stated to locality level.
 * Still absent, and still deliberately: `streetAddress` and `geo` (no verified
 * building or coordinates — an invented pin is worse than no pin, because
 * Google can and does contradict it), `openingHours`, and `sameAs` (no social
 * profile URLs; the only external link is a wa.me number, which is a chat
 * endpoint, not a profile). See ORG_TODO below.
 */

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

/**
 * Locality-level, on purpose.
 *
 * `streetAddress` is omitted rather than filled with "Banjara Hills": that is a
 * neighbourhood, not a street line, and PostalAddress has no neighbourhood
 * field. Putting it in the street slot would disagree with the Google Business
 * Profile the moment a real one is entered, and a NAP that disagrees with
 * itself is the single most common reason a local listing loses authority. The
 * neighbourhood still reaches Google — as crawlable text in the footer NAP.
 */
const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: SITE.city,
  addressRegion: SITE.region,
  addressCountry: SITE.countryCode,
};

/**
 * Narrowest first. The city is what the near-me and map-pack queries resolve
 * against; the country is kept so the national reach the site already had is
 * not thrown away to win the local search.
 */
export const AREA_SERVED = [
  { "@type": "City", name: SITE.city },
  { "@type": "AdministrativeArea", name: SITE.region },
  { "@type": "Country", name: SITE.country },
];

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
  address: ADDRESS,
  areaServed: AREA_SERVED,
  /* Emitted only once a real profile exists in SOCIALS. An empty sameAs array
     is not a neutral statement — it asserts the business has no profiles. */
  ...(PROFILE_URLS.length ? { sameAs: PROFILE_URLS } : {}),
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
      areaServed: AREA_SERVED,
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
 * ORG_TODO — the address is now stated to locality level (Hyderabad,
 * Telangana, IN). What is still missing, in the order it is worth supplying:
 *
 *   1. `sameAs` — Instagram, LinkedIn, YouTube, X profile URLs. Cheapest win
 *      left: it is what ties the site to the profiles Google already has and
 *      is the usual trigger for a knowledge panel.
 *   2. `streetAddress` + `postalCode` — the building and PIN in Banjara Hills,
 *      exactly as they read on the Google Business Profile.
 *   3. `geo` — latitude/longitude, taken from the verified Business Profile
 *      pin rather than looked up, so the two cannot disagree.
 *   4. `openingHoursSpecification` — only if the studio takes visitors.
 *
 * None of these should be guessed. Structured data Google can contradict is
 * worse than structured data that is merely incomplete.
 *
 * Off-site, and outside this repository's reach: a verified Google Business
 * Profile is what actually produces the map pin. The schema here supports it;
 * it cannot substitute for it.
 */
