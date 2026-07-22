/**
 * The client marks in the "client logos" bucket, as one list.
 *
 * Two places render them — the two-row marquee on the landing page and the
 * tile wall on /services/identity — so which clients exist, what their files
 * are called, and how each file has to be handled live here rather than in
 * both. The bucket also holds `valucorlogogogo.png`, a second Valucor file
 * superseded by `VALUCOR-LOGO 1.webp`; it is deliberately not listed.
 *
 * This carries no markup or styling, only what exists and what it is called —
 * the same role registry.ts plays for the service pages and creatives.ts for
 * the creative work.
 */
export type ClientLogo = {
  /** Brand name. Used as the img alt, and it is the only text the wall carries. */
  name: string;
  /** Object name in the "client logos" bucket — see lib/cdn.ts `clientLogo`. */
  file: string;
  /**
   * A white-on-transparent mark. It is invisible on a light surface as drawn,
   * so both consumers invert it; without this flag Zythum renders as an empty
   * tile that looks like a failed image load.
   */
  inv?: boolean;
  /**
   * Scale for a file that carries heavy empty padding of its own, so every mark
   * lands at the same optical size as the rest rather than appearing shrunken.
   */
  scale?: number;
};

/**
 * Order matters: the landing marquee splits this down the middle into its two
 * counter-scrolling rows (see LOGO_ROWS), and the identity wall renders it
 * straight through.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Hitex", file: "hitex logo.webp" },
  { name: "Patil Group", file: "patilgroup logo.webp" },
  { name: "Hope Trust India", file: "hopetrust logo.webp" },
  { name: "South Glass", file: "southglass logo.webp" },
  { name: "Our Sacred Space", file: "osslogo.png" },
  { name: "Samyoga Studio", file: "samyoga_logo.webp" },
  { name: "Avvent Global", file: "avvent global logo.webp" },
  { name: "Valucor", file: "VALUCOR-LOGO 1.webp" },
  { name: "Zythum", file: "zythum logo.webp", inv: true },
  { name: "EUI", file: "EUI LOGO.webp" },
  { name: "Hitex SportExpo", file: "sportex_logo.webp", scale: 1.45 },
  { name: "AA", file: "AA Logo.webp" },
];

/** The landing marquee's two rows, which scroll in opposite directions. */
export const LOGO_ROWS: ClientLogo[][] = [
  CLIENT_LOGOS.slice(0, 6),
  CLIENT_LOGOS.slice(6),
];
