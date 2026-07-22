import type { Metadata } from "next";

/**
 * One source of truth for the site's metadata.
 *
 * Why a helper rather than per-page `openGraph` objects: Next *replaces* a
 * parent's `openGraph` when a child declares one — it does not deep-merge. The
 * pages each declared their own, which silently dropped the root's `og:image`,
 * `og:site_name` and `og:locale` from every page except the homepage, so
 * sharing /services or a post produced a card with no image at all. The same
 * applied in reverse to `twitter`: pages never declared it, so every page
 * inherited the *homepage's* twitter:title.
 *
 * `pageMeta()` builds the whole object each time, so a page can never end up
 * with half a card again.
 */

export const SITE = {
  name: "ADMIRATE",
  url: "https://admirate.in",
  locale: "en_IN",
  /**
   * The homepage's exact <title>, and the title on its social cards.
   *
   * The city is in it deliberately. "design agency india" is a national fight
   * against agencies with far older domains; "design agency hyderabad" and the
   * near-me searches that resolve to it are winnable, and they are also where
   * the enquiries actually come from. The national framing is kept in the
   * description rather than dropped.
   */
  title: "ADMIRATE: Design & Marketing Agency in Hyderabad",
  /** Descriptive line used on the OG card footer — not the page title. */
  tagline: "Strategic Design & Marketing Agency",
  /**
   * Kept under ~155 characters.
   *
   * Google truncates on rendered width, not character count, and an audit put
   * the previous wording at 1248px against a 1000px budget — the tail was
   * being cut off in results. The city stays (it is the point of the local
   * targeting) and the service list is trimmed to the four that matter most,
   * rather than listing everything and having the sentence clipped mid-word.
   */
  description:
    "Strategic design and marketing agency in Hyderabad. Branding, web design, social media and video production for clients across India.",
  logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/admirate%20logo.webp",
  phone: "+91-8374494954",
  email: "essentials@admirate.in",

  /* ---------- location ----------
     Read by the LocalBusiness schema and by the footer NAP on every public
     page. Name, address and phone have to agree character-for-character with
     the Google Business Profile; a mismatch is read as two businesses and
     costs the listing its authority. That is why they resolve from here rather
     than being typed into ten footers. */

  /** Neighbourhood. Not part of PostalAddress — see the note in schema.ts. */
  area: "Banjara Hills",
  city: "Hyderabad",
  region: "Telangana",
  country: "India",
  /** ISO 3166-1 alpha-2, which is what schema.org expects for addressCountry. */
  countryCode: "IN",
} as const;

/** Phone as a tel: href — digits and a leading +, nothing else. */
export const telHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

export const WHATSAPP = `https://wa.me/${SITE.phone.replace(/[^\d]/g, "")}`;

/**
 * Every external destination the site links to, in one list.
 *
 * `profile: true` marks a page that genuinely represents the business — an
 * Instagram or LinkedIn account. Those, and only those, are published as
 * `sameAs` in the structured data, which is how Google ties this domain to
 * profiles it already knows about. WhatsApp is deliberately not one: wa.me is
 * a chat endpoint, not a profile, and claiming it as identity is the kind of
 * assertion Google can contradict.
 *
 * Adding a profile here lights up the footer row and the `sameAs` block at the
 * same time. Instagram and LinkedIn are in; a YouTube or X account would slot
 * in the same way — see ORG_TODO in lib/schema.ts.
 */
export type SocialLink = { label: string; href: string; profile?: boolean };

/* The share-sheet tracking parameters the URLs arrived with (`?igsh=…`,
   `?feedView=all`) are stripped. `sameAs` is an identity claim, and the
   canonical profile URL is what Google matches against the profile it already
   knows; a tracking-tagged variant is a different string and reads as a
   different page. The trailing `/posts/` is dropped for the same reason — the
   company root is the profile, the posts feed is a view of it. */
export const SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/admirate.in",
    profile: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/admirateindia",
    profile: true,
  },
  { label: "WhatsApp", href: WHATSAPP },
];

/** Profile URLs only — what `sameAs` is allowed to claim. */
export const PROFILE_URLS = SOCIALS.filter((s) => s.profile).map((s) => s.href);

/**
 * The crawlable NAP line, shared by every public footer.
 *
 * Structured data alone is not enough for local ranking: Google cross-checks
 * the address against what is actually rendered on the page, so this has to
 * exist in the HTML and not only in the JSON-LD.
 */
export const NAP_HTML = `${SITE.area}, ${SITE.city} · <a href="${telHref}">${SITE.phone.replace("-", " ")}</a>`;

/**
 * The legal links, for the compact footers.
 *
 * The full footer (shared/footer.ts) has room for its own row; the service,
 * blog and start-project pages end in a one-line rail instead, and this is what
 * goes in it. A privacy policy reachable from only four of twenty-six pages is
 * not really published, so it resolves from here and every one of those rails
 * gets the same pair.
 *
 * No colours or sizing: each host rail already styles its own anchors, and this
 * inherits so it reads as part of the line it sits in rather than a graft.
 */
export const LEGAL_HTML = `<a href="/privacy-policy">Privacy Policy</a> · <a href="/terms">Terms</a>`;

type PageMetaArgs = {
  /** Page title, without the "| ADMIRATE" suffix — the template adds it. */
  title: string;
  description: string;
  /** Root-relative, e.g. "/services". Used for both canonical and og:url. */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Absolute or root-relative. Defaults to the route's generated OG image. */
  image?: string;
};

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  image,
}: PageMetaArgs): Metadata {
  const url = `${SITE.url}${path}`;
  // The og:title carries the brand, because a shared card has no other context.
  const social = `${title} | ${SITE.name}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: social,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      ...(images ? { images } : {}),
    },
  };
}
