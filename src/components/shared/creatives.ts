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

  /* Samyoga Studio, in a subfolder of the same bucket. All four are 4:5 and
     4500x5625 — print scale, so they go through the optimizer like the rest.
     `samWeekend` is named "Weekend1-2.png" in the bucket but the artwork is
     the full Pilates class timetable, morning and evening; the alt describes
     the creative rather than repeating a filename that disagrees with it. */
  samOneHour: {
    file: "samyoga new creatives/1hour.png",
    ar: 0.8,
    alt: "Samyoga Studio — “1 Hour. A Better You.” daily practice creative",
  },
  samDidYouKnow: {
    file: "samyoga new creatives/DidYouKnow.png",
    ar: 0.8,
    alt: "Samyoga Studio — “Did You Know?” yoga and Pilates benefits creative",
  },
  samStartAnytime: {
    file: "samyoga new creatives/StartAnytime.png",
    ar: 0.8,
    alt: "Samyoga Studio — “The Best Time to Begin Is Now” Pilates studio creative",
  },
  samTimings: {
    file: "samyoga new creatives/Weekend1-2.png",
    ar: 0.8,
    alt: "Samyoga Studio — Pilates class timings, morning and evening batches",
  },
} satisfies Record<string, Creative>;

/**
 * Every client creative, in wall order.
 *
 * The /services/design marquee runs this flat — it is a strip of client work,
 * so the house slides below are deliberately not part of it.
 *
 * The order is authored rather than taken from the record above, because
 * declaration order groups the work by shape: all six 4:5 posters are declared
 * first and all eight squares after them, which ran the wall as a block of
 * tall cards followed by a block of short ones. That reads as two batches
 * rather than one body of work.
 *
 * So the shapes alternate, and the order is also spread by *subject*, which
 * matters more than shape once you look at what the work actually is. Left
 * alone, the wall opened with three health pieces back to back — the two Hope
 * Trust creatives on either side of the Parkinson's session — which read as a
 * healthcare portfolio rather than a general one. The four Samyoga Studio
 * pieces are the same trap: one brand, one palette, four slots. They are
 * placed every fourth card, the two Hope Trust pieces are pushed apart, and
 * Parkinson's now sits late in the run rather than near the front.
 *
 * Ten portraits against eight squares cannot alternate perfectly — two
 * portraits have to sit together somewhere — so the pair is parked at the
 * tail, where the marquee's seam already breaks the rhythm.
 *
 * It is a fixed order, not a shuffle. These pages are prerendered, so a
 * random sort would either bake one arbitrary order in at build time or
 * disagree between server and client and blow up hydration. Jumbled is a
 * layout decision here, so it is made once, on purpose, and stays put.
 *
 * Typed against the record's keys: a typo will not compile. Adding a creative
 * above means adding its key here too, or it will not appear on the wall.
 */
const WALL_ORDER = [
  "ms",
  "handloom",
  "one",
  "one72",
  "sastriyaYoga",
  "f172",
  "veganMarket",
  "artboard6at100",
  "adivaram",
  "findYourGame",
  "parkinsons",
  "artboard1at100",
  "artboard1copy",
  "artboard1at72",
] as const satisfies readonly (keyof typeof CREATIVES)[];

export const CLIENT_CREATIVES: Creative[] = WALL_ORDER.map((k) => CREATIVES[k]);

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
