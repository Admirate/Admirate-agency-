const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Maps the site's existing content registries into the four groups visitors
 * need. Operational routes never enter this function, so they cannot leak into
 * the public index through an overly broad route scan.
 */
export function buildSitemapGroups({ services, posts, legalDocs }) {
  return [
    {
      id: "main-pages",
      title: "Main Pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Pricing", href: "/pricing" },
        { label: "Journal", href: "/blogs" },
        { label: "Start a Project", href: "/start-project" },
      ],
    },
    {
      id: "services",
      title: "Services",
      links: services.map(({ slug, label }) => ({
        label,
        href: `/services/${slug}`,
      })),
    },
    {
      id: "journal",
      title: "Journal",
      links: posts.map(({ slug, title }) => ({
        label: title,
        href: `/blogs/${slug}`,
      })),
    },
    {
      id: "legal-site",
      title: "Legal & Site",
      links: [
        ...legalDocs.map(({ slug, title }) => ({
          label: title,
          href: `/${slug}`,
        })),
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];
}

export const flattenSitemapPaths = (groups) =>
  groups.flatMap((group) => group.links.map((link) => link.href));

/** Ordinary anchors keep the complete directory crawlable without JavaScript. */
export const renderSitemapContent = (groups) => {
  const pageCount = flattenSitemapPaths(groups).length;

  return `
<div class="map-page">
  <header class="map-hero">
    <div class="map-grid" aria-hidden="true"></div>
    <div class="map-wrap map-hero-inner">
      <p class="map-kicker">ADMIRATE / SITE DIRECTORY</p>
      <div class="map-title-row">
        <h1>Nothing<br><em>buried.</em></h1>
        <p class="map-count"><strong>${pageCount}</strong><span>public pages</span></p>
      </div>
      <p class="map-intro">Every public ADMIRATE page — our work, our thinking, our policies, and the place to start.</p>
    </div>
  </header>
  <div class="map-wrap map-groups">
    ${groups
      .map(
        (group) => `<section class="map-group" aria-labelledby="${group.id}">
      <h2 id="${group.id}">${escapeHtml(group.title)}</h2>
      <ul>${group.links
        .map(
          (link) => `<li><a href="${escapeHtml(link.href)}" data-h><span>${escapeHtml(link.label)}</span><b aria-hidden="true">↗</b></a></li>`,
        )
        .join("")}</ul>
    </section>`,
      )
      .join("")}
  </div>
</div>`;
};
