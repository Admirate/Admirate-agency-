/**
 * The real client creatives in the "creatives new" bucket, as one list.
 *
 * Two pages draw on these — the #social grid on /services and the #dwork
 * marquee on /services/design — so the object names live here rather than in
 * both. The names are hostile to retype (spaces, `@`, "copy", mixed
 * extensions); duplicating them meant a typo would silently 404 on one page
 * while the other kept working.
 *
 * `ar` is each image's true aspect ratio — 1 for the square posts, .8 for the
 * 4:5 ones. Both consumers set it as `--ar` and let the box take that shape,
 * so nothing is ever cropped to fit a single card. See the note in
 * services/content.ts: a cropped creative is a misrepresented creative.
 *
 * This carries no markup or styling, only what exists and what it is called —
 * the same role registry.ts plays for the service pages themselves.
 */
export type Creative = { file: string; ar: number; alt: string };

/**
 * Client work, keyed so a layout can name what it is placing.
 *
 * Where the repository does not record whose creative it is, the alt stays
 * generic — the names are not guessed.
 */
export const CREATIVES = {
  adivaram: {
    file: "adivaramangadi2.png",
    ar: 0.8,
    alt: "Adivara Mangadi — campaign creative",
  },
  handloom: {
    file: "handloomexpo2.png",
    ar: 0.8,
    alt: "Handloom Expo — campaign creative",
  },
  parkinsons: {
    file: "parkinsons.png",
    ar: 0.8,
    alt: "Parkinson's awareness — campaign creative",
  },
  sastriyaYoga: {
    file: "sastriyayoga2.png",
    ar: 0.8,
    alt: "Sastriya Yoga — campaign creative",
  },
  veganMarket: {
    file: "veganmarket2.png",
    ar: 0.8,
    alt: "Vegan Market — campaign creative",
  },
  artboard1at100: {
    file: "Artboard 1@100x-100.jpg",
    ar: 0.8,
    alt: "Client social creative",
  },
  ms: { file: "ms.jpg", ar: 1, alt: "Client social creative" },
  one: { file: "1.jpg", ar: 1, alt: "Client social creative" },
  one72: { file: "1@72x-100.jpg", ar: 1, alt: "Client social creative" },
  artboard1copy: {
    file: "Artboard 1 copy.jpg",
    ar: 1,
    alt: "Client social creative",
  },
  f172: { file: "f1@72x-100.jpg", ar: 1, alt: "Client social creative" },
  artboard6at100: {
    file: "Artboard 6@100x-100.jpg",
    ar: 1,
    alt: "Client social creative",
  },
  artboard1at72: {
    file: "Artboard 1@72x-100.jpg",
    ar: 1,
    alt: "Client social creative",
  },
  findYourGame: {
    file: "Find Your game_1080x1080.jpg",
    ar: 1,
    alt: "Find Your Game — campaign creative",
  },
} satisfies Record<string, Creative>;

/**
 * Every client creative, in declaration order.
 *
 * The /services/design marquee runs this flat — it is a strip of client work,
 * so the house slides below are deliberately not part of it.
 */
export const CLIENT_CREATIVES: Creative[] = Object.values(CREATIVES);

/* ADMIRATE's own "Design Trends 2026" carousel. It lives in a subfolder of the
   same bucket — the double space in "admirate  creatives" is part of the real
   object name, not a typo. All five are 4:5. */
const TRENDS = "admirate  creatives";

export const TRENDS_SLIDES: Creative[] = [
  {
    file: `${TRENDS}/1.jpg`,
    ar: 0.8,
    alt: "ADMIRATE — Design Trends 2026 carousel cover",
  },
  {
    file: `${TRENDS}/2.jpg`,
    ar: 0.8,
    alt: "Design Trends 2026 — exaggerated, bold text",
  },
  {
    file: `${TRENDS}/3.jpg`,
    ar: 0.8,
    alt: "Design Trends 2026 — collage-style compositions",
  },
  {
    file: `${TRENDS}/4.jpg`,
    ar: 0.8,
    alt: "Design Trends 2026 — imperfect design",
  },
  {
    file: `${TRENDS}/5.jpg`,
    ar: 0.8,
    alt: "Design Trends 2026 — surveillance design",
  },
];
