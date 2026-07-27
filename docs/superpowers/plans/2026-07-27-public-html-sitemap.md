# Public HTML Sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded `/sitemap` page containing every public ADMIRATE page, link it from every public footer, and retain `/sitemap.xml` as the Google Search Console submission URL.

**Architecture:** A pure ESM catalog/renderer maps the existing service, blog, and legal registries into four public link groups and testable crawlable HTML. A small RawPage-based client composes that content with the existing shared navigation and full footer, while the Next.js page supplies metadata and breadcrumbs. The existing XML sitemap remains authoritative for Search Console and gains the new HTML sitemap URL; shared footer fragments distribute the visible link without per-page edits.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, raw HTML/CSS page strings, Node's built-in test runner, existing ADMIRATE navigation/footer helpers.

## Global Constraints

- The human-facing page lives at `/sitemap`; the Search Console feed remains `/sitemap.xml`.
- Include Home, Services, Journal, Start a Project, Sitemap, all registered services, all registered posts, Privacy Policy, and Terms.
- Exclude `/dashboard`, every dashboard descendant, `/api`, and every API descendant.
- Reuse `SERVICE_LIST`, `POSTS`, and `LEGAL_DOCS`; do not duplicate their dynamic URLs in page markup.
- Add a visible `Sitemap` link to both the shared full footer and the compact footer fragment.
- Do not add a dependency, request-time database call, network request, search, filter, or pagination.
- Preserve the existing XML priorities, change frequencies, and last-modified behavior for current pages.
- Keep links as ordinary crawlable anchors and preserve keyboard focus and reduced-motion behavior.

## Execution Amendments

- The catalog groups use descriptive headings without `01`–`04` prefixes. The
  groups are categories, not a sequence, so numbering would communicate a
  false order.
- Source-text assertions shown in Tasks 2 and 3 are superseded by real catalog
  renderer tests plus production build and local HTTP checks. Framework glue,
  metadata objects, and CSS receive TypeScript/build/browser verification
  rather than brittle tests that only grep implementation text.
- Footer and XML integration are verified against the rendered `/sitemap` and
  `/sitemap.xml` responses after the production build.

---

### Task 1: Create the public sitemap catalog and renderer

**Files:**
- Create: `src/components/sitemap/catalog.mjs`
- Create: `tests/sitemap-catalog.test.mjs`

**Interfaces:**
- Consumes: `services: readonly { slug: string; label: string }[]`, `posts: readonly { slug: string; title: string }[]`, and `legalDocs: readonly { slug: string; title: string }[]`.
- Produces: `buildSitemapGroups({ services, posts, legalDocs }): SitemapGroup[]`, `flattenSitemapPaths(groups): string[]`, and `renderSitemapContent(groups): string`.
- `SitemapGroup` has `{ id: string, number: string, title: string, links: { label: string, href: string }[] }`.

- [ ] **Step 1: Write the failing catalog test**

Create `tests/sitemap-catalog.test.mjs` with a guarded import so the RED run fails on the missing production API rather than aborting module loading:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/sitemap/catalog.mjs"),
).href;

let buildSitemapGroups;
let flattenSitemapPaths;
let renderSitemapContent;

try {
  ({ buildSitemapGroups, flattenSitemapPaths, renderSitemapContent } =
    await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

const input = {
  services: [
    { slug: "identity", label: "Identity" },
    { slug: "digital", label: "Digital" },
  ],
  posts: [
    { slug: "first-post", title: "First post" },
    { slug: "second-post", title: "Second & final" },
  ],
  legalDocs: [
    { slug: "privacy-policy", title: "Privacy Policy" },
    { slug: "terms", title: "Terms & Conditions" },
  ],
};

test("catalog contains every public page and no private route", () => {
  assert.equal(typeof buildSitemapGroups, "function", "buildSitemapGroups is missing");
  assert.equal(typeof flattenSitemapPaths, "function", "flattenSitemapPaths is missing");

  const groups = buildSitemapGroups(input);
  const paths = flattenSitemapPaths(groups);

  assert.deepEqual(groups.map((group) => group.title), [
    "Main Pages",
    "Services",
    "Journal",
    "Legal & Site",
  ]);
  assert.deepEqual(paths, [
    "/",
    "/services",
    "/blogs",
    "/start-project",
    "/services/identity",
    "/services/digital",
    "/blogs/first-post",
    "/blogs/second-post",
    "/privacy-policy",
    "/terms",
    "/sitemap",
  ]);
  assert.equal(paths.some((path) => path.startsWith("/dashboard")), false);
  assert.equal(paths.some((path) => path.startsWith("/api")), false);
});

test("renderer emits one crawlable escaped anchor per catalog path", () => {
  assert.equal(typeof renderSitemapContent, "function", "renderSitemapContent is missing");

  const groups = buildSitemapGroups(input);
  const html = renderSitemapContent(groups);
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(hrefs, flattenSitemapPaths(groups));
  assert.match(html, /Second &amp; final/);
  assert.doesNotMatch(html, /<script/i);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/sitemap-catalog.test.mjs
```

Expected: failing assertions report `buildSitemapGroups is missing` and `renderSitemapContent is missing` because `catalog.mjs` does not exist.

- [ ] **Step 3: Implement the minimal catalog and renderer**

Create `src/components/sitemap/catalog.mjs`:

```js
const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function buildSitemapGroups({ services, posts, legalDocs }) {
  return [
    {
      id: "main-pages",
      number: "01",
      title: "Main Pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Journal", href: "/blogs" },
        { label: "Start a Project", href: "/start-project" },
      ],
    },
    {
      id: "services",
      number: "02",
      title: "Services",
      links: services.map(({ slug, label }) => ({
        label,
        href: `/services/${slug}`,
      })),
    },
    {
      id: "journal",
      number: "03",
      title: "Journal",
      links: posts.map(({ slug, title }) => ({
        label: title,
        href: `/blogs/${slug}`,
      })),
    },
    {
      id: "legal-site",
      number: "04",
      title: "Legal & Site",
      links: [
        ...legalDocs.map(({ slug, title }) => ({ label: title, href: `/${slug}` })),
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];
}

export const flattenSitemapPaths = (groups) =>
  groups.flatMap((group) => group.links.map((link) => link.href));

export const renderSitemapContent = (groups) => `
<div class="map-page">
  <header class="map-hero">
    <div class="map-grid" aria-hidden="true"></div>
    <div class="map-wrap">
      <p class="map-kicker">SITE INDEX</p>
      <h1>Every page.<br><em>One place.</em></h1>
      <p class="map-intro">Browse every public page on ADMIRATE, from services and project notes to policies and contact.</p>
    </div>
  </header>
  <div class="map-wrap map-groups">
    ${groups
      .map(
        (group) => `<section class="map-group" aria-labelledby="${group.id}">
      <header><span>${group.number}</span><h2 id="${group.id}">${escapeHtml(group.title)}</h2></header>
      <ul>${group.links
        .map(
          (link) => `<li><a href="${link.href}" data-h><span>${escapeHtml(link.label)}</span><b aria-hidden="true">↗</b></a></li>`,
        )
        .join("")}</ul>
    </section>`,
      )
      .join("")}
  </div>
</div>`;
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
node --test tests/sitemap-catalog.test.mjs
```

Expected: two passing tests and zero failures.

- [ ] **Step 5: Commit the tested catalog boundary**

```powershell
git add -- src/components/sitemap/catalog.mjs tests/sitemap-catalog.test.mjs docs/superpowers/plans/2026-07-27-public-html-sitemap.md
git commit -m "feat: define public sitemap catalog"
```

---

### Task 2: Build the branded `/sitemap` page

**Files:**
- Create: `src/components/sitemap/content.ts`
- Create: `src/components/sitemap/SitemapClient.tsx`
- Create: `src/app/sitemap/page.tsx`
- Create: `tests/sitemap-page.test.mjs`

**Interfaces:**
- Consumes: `buildSitemapGroups`, `renderSitemapContent`, `SERVICE_LIST`, `POSTS`, `LEGAL_DOCS`, `RawPage`, `navHtml("none")`, and `footerHtml()`.
- Produces: `SITEMAP_GROUPS`, `SITEMAP_HTML`, `SITEMAP_CSS`, a client composition component, and the indexable `/sitemap` route.

- [ ] **Step 1: Write the failing page-composition test**

Create `tests/sitemap-page.test.mjs`. Read source files because the page is a TypeScript/React boundary, and exercise the real ESM catalog for exact route coverage:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(resolve(here, path), "utf8");

test("sitemap page composes registered content with shared navigation and footer", () => {
  const content = read("../src/components/sitemap/content.ts");
  const client = read("../src/components/sitemap/SitemapClient.tsx");

  assert.match(content, /SERVICE_LIST/);
  assert.match(content, /POSTS/);
  assert.match(content, /LEGAL_DOCS/);
  assert.match(content, /buildSitemapGroups/);
  assert.match(content, /renderSitemapContent/);
  assert.match(client, /navHtml\("none"\)/);
  assert.match(client, /footerHtml\(\)/);
  assert.match(client, /initNav\(\)/);
  assert.match(client, /initFooter\(\)/);
});

test("sitemap route has canonical metadata and breadcrumb structured data", () => {
  const page = read("../src/app/sitemap/page.tsx");

  assert.match(page, /path:\s*"\/sitemap"/);
  assert.match(page, /title:\s*"Sitemap"/);
  assert.match(page, /breadcrumbSchema/);
  assert.match(page, /SitemapClient/);
});

test("sitemap stylesheet supplies responsive layout and accessible focus", () => {
  const content = read("../src/components/sitemap/content.ts");

  assert.match(content, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(content, /@media \(max-width:760px\)/);
  assert.match(content, /grid-template-columns:1fr/);
  assert.match(content, /:focus-visible/);
  assert.match(content, /prefers-reduced-motion:reduce/);
});
```

- [ ] **Step 2: Run the page test and verify RED**

Run:

```powershell
node --test tests/sitemap-page.test.mjs
```

Expected: the test file errors with `ENOENT` for `src/components/sitemap/content.ts`, proving the page composition is absent.

- [ ] **Step 3: Create the registered content and page stylesheet**

Create `src/components/sitemap/content.ts` with:

```ts
import { POSTS } from "@/components/blogs/posts";
import { LEGAL_DOCS } from "@/components/legal/docs";
import { SERVICE_LIST } from "@/components/service/registry";
import {
  buildSitemapGroups,
  renderSitemapContent,
} from "@/components/sitemap/catalog.mjs";

export const SITEMAP_GROUPS = buildSitemapGroups({
  services: SERVICE_LIST,
  posts: POSTS,
  legalDocs: LEGAL_DOCS,
});

export const SITEMAP_HTML = renderSitemapContent(SITEMAP_GROUPS);

export const SITEMAP_CSS = String.raw`
:root{--white:#fff;--paper:#fafaf8;--black:#0b0b0c;--red:#e3001b;--grey:#8a8a8e;--line:#e9e9e6;--pad:clamp(24px,6vw,96px);--display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}
.map-wrap{width:min(1440px,100%);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}
.map-hero{position:relative;overflow:hidden;padding:clamp(132px,20vh,210px) 0 clamp(64px,10vh,110px);border-bottom:1px solid var(--line)}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:clamp(72px,9vw,136px) clamp(72px,9vw,136px);opacity:.55;mask-image:linear-gradient(to bottom,#000,transparent)}
.map-hero .map-wrap{position:relative;z-index:1}
.map-kicker{display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:20px}
.map-kicker::before{content:"";width:24px;height:1px;background:var(--red)}
.map-hero h1{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(54px,9.5vw,142px);line-height:.84;letter-spacing:-.045em;text-transform:uppercase}
.map-hero h1 em{font-style:normal;color:var(--red)}
.map-intro{margin-top:clamp(24px,4vw,44px);max-width:58ch;font-size:clamp(16px,1.5vw,20px);font-weight:300;line-height:1.65;color:#454549}
.map-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;padding-top:clamp(50px,8vh,90px);padding-bottom:clamp(76px,11vh,130px)}
.map-group{padding:clamp(28px,4vw,48px);border-top:1px solid var(--line)}
.map-group:nth-child(odd){border-right:1px solid var(--line)}
.map-group header{display:flex;align-items:baseline;gap:14px;margin-bottom:22px}
.map-group header>span{font-family:var(--mono);font-size:10px;color:var(--red);letter-spacing:.12em}
.map-group h2{font-family:var(--display);font-size:clamp(24px,3vw,38px);font-weight:800;letter-spacing:-.025em;text-transform:uppercase}
.map-group ul{list-style:none}
.map-group li{border-top:1px solid var(--line)}
.map-group li:last-child{border-bottom:1px solid var(--line)}
.map-group a{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:15px 2px;color:var(--black);text-decoration:none;font-size:clamp(14px,1.2vw,17px);line-height:1.4;transition:color .2s,padding .2s}
.map-group a b{font-family:var(--mono);font-size:14px;font-weight:400;color:var(--grey);transition:color .2s,transform .2s}
.map-group a:hover{color:var(--red);padding-left:8px}
.map-group a:hover b{color:var(--red);transform:translate(2px,-2px)}
.map-group a:focus-visible{outline:2px solid var(--red);outline-offset:4px;border-radius:2px}
@media (max-width:760px){.map-hero{padding-top:120px}.map-groups{grid-template-columns:1fr}.map-group{padding:30px 0}.map-group:nth-child(odd){border-right:0}.map-group:first-child{border-top:0}.map-group a{padding-top:14px;padding-bottom:14px}}
@media (prefers-reduced-motion:reduce){.map-group a,.map-group a b{transition:none}.map-group a:hover b{transform:none}}
`;
```

- [ ] **Step 4: Compose shared navigation, sitemap content, and footer**

Create `src/components/sitemap/SitemapClient.tsx`:

```tsx
"use client";

import RawPage from "@/components/RawPage";
import { SITEMAP_CSS, SITEMAP_HTML } from "@/components/sitemap/content";
import { FOOTER_CSS, footerHtml, initFooter } from "@/components/shared/footer";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function SitemapClient() {
  return (
    <RawPage
      css={SITEMAP_CSS + NAV_CSS + FOOTER_CSS}
      html={navHtml("none") + SITEMAP_HTML + footerHtml()}
      init={() => {
        const stopNav = initNav();
        const stopFooter = initFooter();
        return () => {
          stopNav();
          stopFooter();
        };
      }}
    />
  );
}
```

- [ ] **Step 5: Add the Next.js sitemap page with metadata and breadcrumbs**

Create `src/app/sitemap/page.tsx`:

```tsx
import type { Metadata } from "next";
import SitemapClient from "@/components/sitemap/SitemapClient";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Sitemap",
  description: "Browse every public page on ADMIRATE, including services, journal articles, project enquiries, and legal information.",
  path: "/sitemap",
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Sitemap", path: "/sitemap" },
]);

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <SitemapClient />
    </>
  );
}
```

- [ ] **Step 6: Run focused page tests and TypeScript verification**

Run:

```powershell
node --test tests/sitemap-catalog.test.mjs tests/sitemap-page.test.mjs
npx tsc --noEmit --incremental false
```

Expected: five tests pass, zero fail, and TypeScript exits `0`.

- [ ] **Step 7: Commit the sitemap page**

```powershell
git add -- src/components/sitemap/content.ts src/components/sitemap/SitemapClient.tsx src/app/sitemap/page.tsx tests/sitemap-page.test.mjs
git commit -m "feat: add public html sitemap page"
```

---

### Task 3: Connect every footer and the XML sitemap

**Files:**
- Modify: `src/components/shared/footer.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/app/sitemap.ts`
- Create: `tests/sitemap-integration.test.mjs`

**Interfaces:**
- Consumes: the full footer's `.aflegal` navigation, compact `LEGAL_HTML`, and the existing `MetadataRoute.Sitemap` array.
- Produces: a crawlable `/sitemap` link from every footer variant and an absolute `https://admirate.in/sitemap` entry in `/sitemap.xml`.

- [ ] **Step 1: Write the failing integration test**

Create `tests/sitemap-integration.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(resolve(here, path), "utf8");

test("full and compact public footers link to the HTML sitemap", () => {
  const fullFooter = read("../src/components/shared/footer.ts");
  const compactFooter = read("../src/lib/seo.ts");

  assert.match(fullFooter, /<a href="\/sitemap" data-h>Sitemap<\/a>/);
  assert.match(compactFooter, /href="\/sitemap">Sitemap<\/a>/);
});

test("XML sitemap includes the HTML sitemap and excludes operational routes", () => {
  const source = read("../src/app/sitemap.ts");

  assert.match(source, /url:\s*`\$\{SITE\.url\}\/sitemap`/);
  assert.doesNotMatch(source, /\/dashboard/);
  assert.doesNotMatch(source, /\/api\//);
});

test("robots continues to advertise the XML sitemap", () => {
  const source = read("../src/app/robots.ts");
  assert.match(source, /sitemap:\s*`\$\{SITE\.url\}\/sitemap\.xml`/);
});
```

- [ ] **Step 2: Run the integration test and verify RED**

Run:

```powershell
node --test tests/sitemap-integration.test.mjs
```

Expected: the footer assertions and XML `/sitemap` assertion fail because those links do not exist yet; the robots assertion already passes and protects the existing Search Console URL.

- [ ] **Step 3: Add the footer links**

In the `.aflegal` navigation inside `src/components/shared/footer.ts`, add:

```html
<a href="/sitemap" data-h>Sitemap</a>
```

Update `LEGAL_HTML` in `src/lib/seo.ts` to:

```ts
export const LEGAL_HTML = `<a href="/privacy-policy">Privacy Policy</a> · <a href="/terms">Terms</a> · <a href="/sitemap">Sitemap</a>`;
```

Update the nearby comment from a “pair” to shared legal/site links.

- [ ] **Step 4: Add `/sitemap` to the XML metadata route**

In `src/app/sitemap.ts`, add a static entry after Start a Project:

```ts
{
  url: `${SITE.url}/sitemap`,
  lastModified: PAGES_UPDATED,
  changeFrequency: "monthly",
  priority: 0.4,
},
```

Do not change any existing entry's metadata or the `robots.ts` XML reference.

- [ ] **Step 5: Run the focused integration and catalog tests**

Run:

```powershell
node --test tests/sitemap-catalog.test.mjs tests/sitemap-page.test.mjs tests/sitemap-integration.test.mjs
```

Expected: eight tests pass and zero fail.

- [ ] **Step 6: Commit the connected sitemap surfaces**

```powershell
git add -- src/components/shared/footer.ts src/lib/seo.ts src/app/sitemap.ts tests/sitemap-integration.test.mjs
git commit -m "feat: connect sitemap to footers and search feed"
```

---

### Task 4: Verify content coverage, production output, and responsive presentation

**Files:**
- Verify: `src/components/sitemap/catalog.mjs`
- Verify: `src/components/sitemap/content.ts`
- Verify: `src/components/sitemap/SitemapClient.tsx`
- Verify: `src/app/sitemap/page.tsx`
- Verify: `src/app/sitemap.ts`
- Verify: `src/components/shared/footer.ts`
- Verify: `src/lib/seo.ts`

**Interfaces:**
- Consumes: the completed HTML page, XML route, and footer links.
- Produces: fresh automated, build, and browser evidence that the approved sitemap is complete and responsive.

- [ ] **Step 1: Run all automated tests**

Run:

```powershell
node --test
```

Expected: every repository test passes with zero failures.

- [ ] **Step 2: Run static checks**

Run:

```powershell
npx tsc --noEmit --incremental false
npx eslint src/components/sitemap src/app/sitemap src/components/shared/footer.ts src/lib/seo.ts tests/sitemap-*.test.mjs
git diff --check
```

Expected: TypeScript and ESLint exit `0`, and `git diff --check` reports no whitespace errors.

- [ ] **Step 3: Build the production application**

Run:

```powershell
npm run build
```

Expected: Next.js exits `0` and lists both `/sitemap` and `/sitemap.xml` among generated routes.

- [ ] **Step 4: Verify rendered HTML and XML content locally**

Start the app, then fetch `/sitemap` and `/sitemap.xml`. Confirm that:

- `/sitemap` returns `200` and contains 25 unique intended public paths when its self-link is included;
- `/sitemap.xml` returns `200` and includes the absolute `https://admirate.in/sitemap` URL;
- neither response contains `/dashboard` or `/api`;
- the page source contains ordinary anchors without depending on client-side interaction.

- [ ] **Step 5: Inspect desktop and mobile presentation**

Use the in-app browser at approximately `1440 × 900` and `390 × 844` to inspect `/sitemap`.

Verify:

- the desktop layout uses two balanced content columns;
- the mobile layout uses one column with no horizontal overflow;
- all four groups and every article link are legible;
- hover, keyboard focus, shared navigation, footer link, and footer clock work;
- reduced-motion emulation removes decorative transitions without hiding links.

- [ ] **Step 6: Run fresh final verification**

Run:

```powershell
node --test
npx tsc --noEmit --incremental false
npm run build
git diff --check
git status --short
```

Expected: all tests pass, TypeScript and production build exit `0`, no whitespace errors appear, and the status contains only intended implementation changes if any remain uncommitted.
