# Public HTML Sitemap Design

**Status:** Approved
**Date:** 2026-07-27

## Context

ADMIRATE already publishes a valid machine-readable sitemap at
`https://admirate.in/sitemap.xml`, and `robots.txt` already advertises that URL.
Google Search Console should continue receiving this XML sitemap. The requested
addition is a human-readable page that exposes every public content page in one
place and a consistent footer link that makes that page discoverable across the
site.

The application also contains dashboard, login, emailer, portfolio-management,
and API routes. These are private or operational routes rather than public site
content, so neither sitemap will expose them.

## Goals

- Add an indexable `/sitemap` page that links to every public content page.
- Group links into clear sections for main pages, services, journal articles,
  and legal/site information.
- Reuse the existing service, post, and legal registries so the page does not
  duplicate dynamic content URLs.
- Add a visible `Sitemap` link to every public footer variant.
- Add `/sitemap` to the existing XML sitemap used by Google Search Console.
- Preserve the existing `robots.txt` reference to `/sitemap.xml`.
- Exclude `/dashboard`, every dashboard descendant, `/api`, and every API
  descendant.

## Non-goals

- Replacing `/sitemap.xml` with the HTML page.
- Submitting the sitemap in the user's Google Search Console account.
- Exposing administrative, authentication, API, or other operational routes.
- Adding search, filters, pagination, or a new content-management system.
- Redesigning unrelated pages, navigation, or footer structure.

## Considered Approaches

### 1. Registry-backed page and XML sitemap — selected

Create a small public-page registry for the human-facing grouping while
continuing to derive services, blog posts, and legal pages from their existing
registries. Render `/sitemap` from that data and verify that its path set agrees
with `/sitemap.xml`.

This provides one reliable content model, keeps private routes explicit, and
automatically includes future services and posts added through existing
registries.

### 2. Manually maintained HTML link list

Hard-code every anchor into the new page. This is initially simple but creates
a second URL list that can silently become stale when a service or article is
added.

### 3. Filesystem route discovery

Scan `src/app` for route files and build the sitemap automatically. This adds
build complexity, must infer dynamic slugs, and risks exposing dashboard or API
routes when the route tree changes. Explicit public registries are safer.

## Architecture and Components

### Public page data

A focused module will describe the human-facing groups and links. It will use:

- fixed entries for Home, Services, Journal, Start a Project, and Sitemap;
- `SERVICE_LIST` for all six service detail pages;
- `POSTS` for all journal article pages;
- `LEGAL_DOCS` for Privacy Policy and Terms.

The module will only contain public links. Dashboard and API paths will never be
added and therefore cannot leak through filtering mistakes.

### HTML sitemap page

`/sitemap` will be a normal indexable Next.js page with its own title,
description, canonical URL, and breadcrumb structured data. Its visible content
will use the site's existing Archivo, Inter, IBM Plex Mono, black, paper, and red
design language.

The page will have:

- the shared primary navigation;
- a concise heading explaining that it is the complete public site index;
- four responsive link groups: Main Pages, Services, Journal, and Legal & Site;
- descriptive anchor labels rather than raw URLs;
- the shared full footer.

On wide screens the groups will form a readable grid. On narrow screens they
will stack without horizontal scrolling. Links will remain ordinary anchors so
they are crawlable without client-side JavaScript. Focus states, semantic
headings, and reduced-motion behavior will follow existing shared components.

### Footer links

The shared full footer will add `Sitemap` to its legal/site rail. The compact
footer link fragment used by the service pages, blog pages, and Start a Project
will also add the same link. Because the public pages already consume one of
these shared fragments, the change reaches every public footer without editing
each page independently.

### XML sitemap

The existing `src/app/sitemap.ts` metadata route remains the Search Console
source. It will gain the canonical `https://admirate.in/sitemap` entry. Existing
priorities, change frequencies, and honest last-modified dates remain intact.
`robots.ts` will continue advertising `https://admirate.in/sitemap.xml`.

## Data Flow

1. Existing service, post, and legal registries define the public dynamic
   content.
2. The public-page module maps those registries into labeled HTML sitemap
   groups.
3. The `/sitemap` page renders those groups as server-visible anchors.
4. The XML metadata route continues mapping the same source registries to
   canonical absolute URLs and adds the new sitemap page.
5. Tests compare the intended public path set with both outputs so drift is
   detected during development.

No request-time database call, network request, client state, or new dependency
is introduced.

## Failure and Fallback Behavior

- If JavaScript is disabled, every sitemap anchor remains visible and usable.
- If the footer clock or navigation enhancement fails, the static links remain
  normal anchors.
- If a future service or post is registered, the HTML and XML generators obtain
  it from the existing source registry; a coverage test catches any mismatch.
- Private paths are rejected by tests if they appear in either sitemap.
- An unavailable destination returns that route's normal Next.js response; the
  sitemap page itself does not hide or retry navigation errors.

## Testing and Verification

Implementation will follow a red-green test cycle. Automated coverage will
verify that:

- the public-page groups include Home, Services, Journal, Start a Project,
  Sitemap, all registered services, all registered posts, and both legal pages;
- neither the HTML nor XML sitemap includes `/dashboard`, `/api`, or their
  descendants;
- the HTML output contains an anchor for every intended public path;
- the XML sitemap includes `/sitemap` and remains aligned with the public path
  set;
- the full and compact footer fragments both link to `/sitemap`;
- the new page exports canonical metadata and breadcrumb data.

After focused tests pass, the complete Node test suite, TypeScript compiler, and
production build will run. The rendered page will also be checked at desktop
and mobile widths for link completeness, legibility, focus treatment, and
overflow.

## Search Console Handoff

After deployment, the sitemap to submit in Google Search Console remains:

`https://admirate.in/sitemap.xml`

The new `https://admirate.in/sitemap` page is for visitors, internal linking,
and crawl discovery; it is not a replacement for the XML submission URL.
