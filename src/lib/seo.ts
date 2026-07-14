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
  /** The homepage's exact <title>, and the title on its social cards. */
  title: "ADMIRATE: Design & Marketing Agency",
  /** Descriptive line used on the OG card footer — not the page title. */
  tagline: "Strategic Design & Marketing Agency",
  description:
    "ADMIRATE is a strategic design and marketing agency. Branding, web design, social media, video production, and digital advertising — done the right way.",
  logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/admirate%20logo.webp",
  phone: "+91-8374494954",
  email: "essentials@admirate.in",
  country: "India",
} as const;

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
