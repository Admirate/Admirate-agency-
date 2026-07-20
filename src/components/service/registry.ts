/**
 * The six services, as names only.
 *
 * Each service is a hand-authored page of its own under `app/services/<slug>/`
 * — they deliberately share no section grammar, stylesheet or engine, because
 * a shared one made them look alike. This file is the one thing they do share:
 * the canonical list of which services exist and what they are called.
 *
 * Read by the nav menu and the sitemap. It carries no page copy, so importing
 * it costs nothing to a bundle that only needs the names.
 *
 * Adding a service: an entry here, plus `app/services/<slug>/page.tsx` and a
 * component folder under `components/service/<slug>/`.
 */
export type ServiceRef = { slug: string; label: string };

export const SERVICE_LIST: ServiceRef[] = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
  { slug: "video-production", label: "Video Production" },
  { slug: "brand-collaterals", label: "Brand Collaterals" },
];

export const SERVICE_ORDER = SERVICE_LIST.map((s) => s.slug);
