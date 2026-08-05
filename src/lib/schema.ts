import { SITE, PROFILE_URLS } from "@/lib/seo";
import { SERVICE_LIST } from "@/components/service/registry";
import { readingMinutes, wordCount, type Post } from "@/components/blogs/posts";

/**
 * JSON-LD builders.
 *
 * Every claim here is one the site can actually back up. The studio is based in
 * Banjara Hills, Hyderabad, so the address is now stated to locality level, and
 * `sameAs` now carries the real Instagram and LinkedIn profiles.
 * Still absent, and still deliberately: `streetAddress` and `geo` (no verified
 * building or coordinates — an invented pin is worse than no pin, because
 * Google can and does contradict it) and `openingHours`. See ORG_TODO below.
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

/**
 * The real band, not "$$".
 *
 * The floor is Website Care and the ceiling is the Website Enterprise build —
 * the cheapest and dearest things on the published rate card, in the currency
 * of the primary market. A vague token was the safe answer while /pricing said
 * nothing; now that the page prints real figures, a generic band is a weaker
 * claim than the site already makes out loud.
 *
 * Hand-kept, and the one number here that can drift: the figures live in
 * Supabase (`pricing_amounts`, seeded in migration 0002 and editable from the
 * dashboard). This is a static schema object rendered in the root layout, so it
 * cannot read them without making the whole layout async for one string.
 * Anyone changing the floor or ceiling of the INR card should change this line.
 */
const PRICE_RANGE = "₹18000-₹359000";

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
  priceRange: PRICE_RANGE,
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

/**
 * One line per service, keyed by the slug it is published under.
 *
 * This used to be a standalone array of seven, and the drift showed: it claimed
 * a "Websites" service that has no page and no nav entry, sitting next to a
 * "Digital" entry describing the same work. Structured data that lists a
 * service the site cannot show is exactly the kind of claim Google discounts
 * the rest of the block for.
 *
 * Keying off SERVICE_LIST — the same registry the nav, the sitemap and the
 * routes read — means the schema can only ever describe services that exist,
 * in the order the site presents them. A new service is a page plus a line
 * here; miss the line and TypeScript says so.
 */
const SERVICE_DESC: Record<string, string> = {
  identity: "Logos and brand identity built to be recognised in half a second.",
  design: "Advertising and design work placed where the eye actually goes.",
  "social-media":
    "Reels, creatives and campaigns made to convert, not just post.",
  digital:
    "Websites designed and built end to end, to load fast and turn a visit into an enquiry.",
  "video-production":
    "Films, ads and brand stories, scripted and shot in-house.",
  "brand-collaterals": "The physical proof of a strong identity.",
};

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services",
  itemListElement: SERVICE_LIST.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.label,
      description: SERVICE_DESC[s.slug],
      /* Each service names the page that actually documents it, so the entry
         is a destination Google can follow rather than a bare assertion. */
      url: `${SITE.url}/services/${s.slug}`,
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
    /* Falls back to the publish date, which for an unrevised post is the
       honest answer. Set `updated` on a post when its copy genuinely changes
       and this starts carrying a real freshness signal instead of asserting
       every week that nothing on the site has ever been edited. */
    dateModified: post.updated ?? post.date,
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
 * Telangana, IN), and `sameAs` now publishes the Instagram and LinkedIn
 * profiles. What is still missing, in the order it is worth supplying:
 *
 *   1. `sameAs` for YouTube and X, if those accounts exist. The two that are
 *      published already do the main job — tying this domain to profiles
 *      Google knows — so these are additions, not a gap.
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
