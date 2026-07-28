const compact = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const markdownLabel = (value) =>
  compact(value).replace(/([\\\[\]])/g, "\\$1");

const originUrl = (origin, path = "") =>
  `${String(origin).replace(/\/$/, "")}${path}`;

const resource = (label, href, description) => ({
  label: compact(label),
  href: compact(href),
  description: compact(description),
});

export function buildLlmsSections({
  origin,
  homeDescription,
  services,
  serviceDescriptions,
  posts,
  legalDocs,
  contacts,
}) {
  return [
    {
      title: "Primary pages",
      links: [
        resource("Home", originUrl(origin), homeDescription),
        resource(
          "Services",
          originUrl(origin, "/services"),
          "ADMIRATE's design, marketing, digital, video, and brand services.",
        ),
        resource(
          "Journal",
          originUrl(origin, "/blogs"),
          "Practical writing about branding, design, websites, and marketing.",
        ),
        resource(
          "Start a Project",
          originUrl(origin, "/start-project"),
          "Share a project brief with ADMIRATE.",
        ),
      ],
    },
    {
      title: "Services",
      links: services.map(({ slug, label }) =>
        resource(
          label,
          originUrl(origin, `/services/${slug}`),
          serviceDescriptions[slug] ?? `${label} services from ADMIRATE.`,
        ),
      ),
    },
    {
      title: "Journal",
      links: posts.map(({ slug, title, excerpt }) =>
        resource(title, originUrl(origin, `/blogs/${slug}`), excerpt),
      ),
    },
    {
      title: "Contact and profiles",
      links: contacts.map(({ label, href, description }) =>
        resource(label, href, description),
      ),
    },
    {
      title: "Legal and site",
      links: [
        ...legalDocs.map(({ slug, title, description }) =>
          resource(title, originUrl(origin, `/${slug}`), description),
        ),
        resource(
          "Sitemap",
          originUrl(origin, "/sitemap"),
          "Directory of ADMIRATE's public pages.",
        ),
      ],
    },
  ];
}

export function renderLlmsTxt({ name, summary, overview, sections }) {
  const lines = [
    `# ${compact(name)}`,
    "",
    `> ${compact(summary)}`,
    "",
    compact(overview),
  ];

  for (const section of sections) {
    lines.push("", `## ${compact(section.title)}`, "");
    for (const link of section.links) {
      lines.push(
        `- [${markdownLabel(link.label)}](${link.href}): ${compact(link.description)}`,
      );
    }
  }

  return `${lines.join("\n")}\n`;
}
