import { SITE } from "@/lib/seo";

/**
 * The named author behind the journal.
 *
 * ONE constant drives two things: the `author` field in every BlogPosting's
 * JSON-LD, and the visible byline and bio on the article page. They are wired
 * together on purpose, because publishing only the schema half is against
 * Google's structured data guidelines — "don't mark up content that is not
 * visible to readers" — and an author nobody can see is discounted at best and
 * a manual-action risk at worst. It also would not work: the E-E-A-T signal
 * comes largely from a reader being able to see who wrote the thing.
 *
 * While this is null the site behaves exactly as it did before — BlogPosting
 * credits the Organization and no byline renders. Nothing half-claimed ships.
 *
 * TO ENABLE: fill in the object below. That is the entire change.
 *
 *   export const AUTHOR: Author | null = {
 *     name: "Full Name",
 *     role: "Founder & Creative Director",
 *     bio: "One or two sentences of genuine, checkable experience — years in
 *           the field, the work they are known for. Not marketing copy;
 *           this is the paragraph the E-E-A-T signal actually rests on.",
 *   };
 */
export type Author = {
  /** As it should read in the byline and in `Person.name`. */
  name: string;
  /** Job title. Becomes `Person.jobTitle`. */
  role: string;
  /** 1–2 sentences. Rendered under the article and as `Person.description`. */
  bio: string;
  /** Optional LinkedIn or personal site — becomes `Person.sameAs`. */
  profile?: string;
};

/* `as Author | null` rather than a plain annotation: a const initialised to
   null narrows to the `null` type, and every `AUTHOR ? …` branch below and in
   the renderer would then be typed `never` and fail to compile. The assertion
   keeps the union wide so both branches stay valid while this is unset. */
export const AUTHOR = null as Author | null;

/** Stable identifier, so every post credits the same entity rather than a new one. */
export const AUTHOR_ID = `${SITE.url}/#author`;

/**
 * What `BlogPosting.author` should be.
 *
 * Falls back to the Organization, which is what the site published before and
 * is an honest claim — the posts are the studio's. It is simply a weaker one
 * than a named human, which is the whole reason to fill AUTHOR in.
 */
export const authorSchema = (orgId: string) =>
  AUTHOR
    ? {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: AUTHOR.name,
        jobTitle: AUTHOR.role,
        description: AUTHOR.bio,
        worksFor: { "@id": orgId },
        ...(AUTHOR.profile ? { sameAs: [AUTHOR.profile] } : {}),
      }
    : { "@id": orgId };
