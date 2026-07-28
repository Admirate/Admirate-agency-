import { POSTS } from "@/components/blogs/posts";
import { buildLlmsSections, renderLlmsTxt } from "@/components/llms/catalog.mjs";
import { LEGAL_DOCS } from "@/components/legal/docs";
import { SERVICE_LIST } from "@/components/service/registry";
import { SITE, SOCIALS } from "@/lib/seo";

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  identity:
    "Brand identity and logo design: mark, typography, colour, and the guidelines that hold them together.",
  design:
    "Advertising and design: campaign creative, print, digital placements, and art direction.",
  "social-media":
    "Reels, feed creative, campaigns, and content systems produced to route attention somewhere useful.",
  digital:
    "Website design and development: performance, structure, enquiry paths, and search foundations.",
  "video-production":
    "Brand films, advertising, scripting, production, post-production, and cutdowns for each placement.",
  "brand-collaterals":
    "Stationery, brand guidelines, packaging, print collateral, merchandise, and signage.",
};

const contacts = [
  {
    label: `Email ${SITE.name}`,
    href: `mailto:${SITE.email}`,
    description: "Send a direct project enquiry to ADMIRATE.",
  },
  ...SOCIALS.map(({ label, href }) => ({
    label,
    href,
    description:
      label === "WhatsApp"
        ? "Contact ADMIRATE on WhatsApp."
        : `ADMIRATE's official ${label} profile.`,
  })),
];

const sections = buildLlmsSections({
  origin: SITE.url,
  homeDescription: SITE.description,
  services: SERVICE_LIST,
  serviceDescriptions: SERVICE_DESCRIPTIONS,
  posts: POSTS,
  legalDocs: LEGAL_DOCS,
  contacts,
});

const document = renderLlmsTxt({
  name: SITE.name,
  summary: SITE.description,
  overview: `${SITE.name} is based in ${SITE.area}, ${SITE.city}, ${SITE.region}, ${SITE.country}, and works with clients across India. Use the resources below to learn about its services, practical thinking, policies, and project enquiry process.`,
  sections,
});

export const dynamic = "force-static";

export function GET() {
  return new Response(document, {
    status: 200,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
