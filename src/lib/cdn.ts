
const CDN_HOST = [
  "https:/",
  "/mshehtxywddtdxxkbnuu",
  ".supabase.co",
].join("");

const STORAGE_PATH = "/storage/v1/object/public";

export const asset = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/website%20assets/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

export const video = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/videos/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

export const clientLogo = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/client%20logos/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

/* The bucket is literally named "creatives new" — the space is part of the name. */
export const creative = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/creatives%20new/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

/**
 * The four construction stages of ADMIRATE's own mark, numbered 1-4.
 *
 * The objects are named "1@100x.png" through "4@100x.png" — the "@100x" is the
 * export suffix the artwork came out of the design tool with, not a size to
 * reason about; the files are 1500px square. The `@` is percent-encoded so the
 * URL is well-formed regardless of what is reading it.
 */
export const logoPhase = (n: number) =>
  `${CDN_HOST}${STORAGE_PATH}/logo-phases/${encodeURIComponent(`${n}@100x.png`)}`;

/**
 * Post artwork, keyed by the object name in the "blogs images" bucket.
 *
 * The names are the post titles verbatim — spaces, commas, apostrophes,
 * brackets, and in several cases a trailing full stop before the extension.
 * encodeURIComponent leaves `'` and `()` alone and escapes `,` to %2C; the
 * bucket serves either form, so the raw title can be passed straight through.
 */
export const blogImage = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/blogs%20images/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

/**
 * Sends a remote image through Next's image optimizer.
 *
 * The raw creatives are print-scale (one is 4500x5625 / 5MB) and are displayed
 * about 240px wide — served as-is, that one section is a ~13MB download. This is
 * the same endpoint <Image> emits; it is used directly because the public pages
 * are raw HTML strings, not JSX, so the component is not available to them. The
 * host must be listed in next.config.ts `images.remotePatterns` (it is), `w` must
 * be one of Next's configured deviceSizes/imageSizes, and `q` must be one of
 * `images.qualities` — which defaults to [75] in Next 16, so any other value
 * 400s with "q parameter (quality) of N is not allowed".
 */
export const optimized = (url: string, w = 640, q = 75) =>
  `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`;
