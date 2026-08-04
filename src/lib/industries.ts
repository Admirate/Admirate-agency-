/**
 * The industries a recipient can belong to, and a campaign can be aimed at.
 *
 * A code constant rather than a table: the set changes when we decide to sell
 * to someone new, which is a deploy, not a Tuesday. Nothing enforces it in
 * Postgres either — the API coerces anything it does not recognise to null, so
 * retiring an id degrades those rows to Unassigned instead of failing a query
 * or turning a rename into a migration.
 *
 * NOT THE SAME LIST AS `brief.ts`. That one is a customer describing themselves
 * on the public /start-project wizard, where "Real Estate" is the right
 * granularity. This one is us segmenting an outbound campaign, where the
 * brokerage/developer split is the entire point. Sharing one constant would
 * mean either coarsening the targeting or showing internal segmentation
 * vocabulary to prospects.
 */

export type Industry = { id: string; label: string };

export const INDUSTRIES: readonly Industry[] = [
  { id: "real-estate-brokerage", label: "Real Estate — Brokerage" },
  { id: "real-estate-developer", label: "Real Estate — Developer" },
  { id: "interior-fitout", label: "Interior Design & Fit-out" },
  { id: "construction", label: "Construction" },
  { id: "hospitality", label: "Hospitality" },
  { id: "retail-fnb", label: "Retail & F&B" },
  { id: "healthcare-wellness", label: "Healthcare & Wellness" },
  { id: "professional-services", label: "Professional Services" },
  { id: "technology", label: "Technology" },
  { id: "other", label: "Other" },
] as const;

/** What a row with no industry reads as, everywhere one is shown. */
const UNASSIGNED = "Unassigned";

export const industryLabel = (id: string | null | undefined): string =>
  INDUSTRIES.find((i) => i.id === id)?.label ?? UNASSIGNED;

/**
 * Strips everything a person might type differently on a different day: case,
 * spacing, hyphens, ampersands, the em dash in a label. "Real Estate —
 * Brokerage", "real estate - brokerage" and the id itself all collapse to
 * "realestatebrokerage", so a label, an id and a hand-typed cell match by one
 * rule and no separate lookup table is needed for any of them.
 */
const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * The words a spreadsheet actually carries, mapped to the id they mean.
 *
 * This exists because a CRM export says "Realtor" or "Contracting", not
 * "Real Estate — Brokerage", and an import returning null for all of those
 * would make the industry column look broken on the very first upload.
 *
 * Bare "real estate" resolves to brokerage rather than staying ambiguous:
 * brokerages are the larger half of the list, and a wrong-but-plausible segment
 * is visible in the table and one click to fix, where Unassigned is invisible
 * and stays that way.
 */
const ALIASES: Record<string, string> = {
  realestate: "real-estate-brokerage",
  realtor: "real-estate-brokerage",
  realty: "real-estate-brokerage",
  broker: "real-estate-brokerage",
  brokers: "real-estate-brokerage",
  brokerage: "real-estate-brokerage",
  property: "real-estate-brokerage",
  properties: "real-estate-brokerage",
  realestateagency: "real-estate-brokerage",
  realestateagent: "real-estate-brokerage",

  developer: "real-estate-developer",
  developers: "real-estate-developer",
  development: "real-estate-developer",
  propertydeveloper: "real-estate-developer",
  propertydevelopment: "real-estate-developer",
  realestatedevelopment: "real-estate-developer",

  interior: "interior-fitout",
  interiors: "interior-fitout",
  interiordesign: "interior-fitout",
  fitout: "interior-fitout",
  fitouts: "interior-fitout",
  joinery: "interior-fitout",
  furniture: "interior-fitout",

  contracting: "construction",
  contractor: "construction",
  contractors: "construction",
  building: "construction",
  engineering: "construction",

  hotel: "hospitality",
  hotels: "hospitality",
  resort: "hospitality",
  resorts: "hospitality",
  travel: "hospitality",
  tourism: "hospitality",

  restaurant: "retail-fnb",
  restaurants: "retail-fnb",
  cafe: "retail-fnb",
  fnb: "retail-fnb",
  foodandbeverage: "retail-fnb",
  food: "retail-fnb",
  retail: "retail-fnb",
  ecommerce: "retail-fnb",

  health: "healthcare-wellness",
  healthcare: "healthcare-wellness",
  clinic: "healthcare-wellness",
  clinics: "healthcare-wellness",
  medical: "healthcare-wellness",
  dental: "healthcare-wellness",
  wellness: "healthcare-wellness",
  fitness: "healthcare-wellness",

  legal: "professional-services",
  law: "professional-services",
  lawfirm: "professional-services",
  consulting: "professional-services",
  consultancy: "professional-services",
  finance: "professional-services",
  accounting: "professional-services",
  insurance: "professional-services",
  recruitment: "professional-services",

  tech: "technology",
  software: "technology",
  saas: "technology",
  it: "technology",
  ai: "technology",
  fintech: "technology",

  misc: "other",
  general: "other",
  various: "other",
};

/** id and label lookups, built once rather than scanned per cell. */
const CANONICAL: Record<string, string> = {};
for (const entry of INDUSTRIES) {
  CANONICAL[norm(entry.id)] = entry.id;
  CANONICAL[norm(entry.label)] = entry.id;
}

/**
 * Turns arbitrary text into an id, or null.
 *
 * Idempotent on its own output, which is what lets an API route re-run it over
 * a value the browser already resolved without needing a second, stricter code
 * path to validate with.
 */
export function toIndustryId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const key = norm(value);
  if (key === "") return null;
  return CANONICAL[key] ?? ALIASES[key] ?? null;
}
