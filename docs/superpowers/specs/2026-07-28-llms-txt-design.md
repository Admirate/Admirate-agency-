# ADMIRATE `llms.txt` Design

**Date:** 2026-07-28

## Goal

Publish a concise, factual, machine-readable guide at
`https://admirate.in/llms.txt` so compatible AI agents can understand
ADMIRATE and find its important public pages without parsing the complete
visual site.

`llms.txt` is an emerging AI-agent convention, not a replacement for the
site's existing metadata, structured data, sitemap, internal links, or other
search-engine optimization. The implementation must not promise or imply a
ranking improvement.

## Chosen Approach

Generate the document through a static Next.js route rather than maintaining
a hand-written file in `public/`. The route will compose content from the
site's existing sources of truth, including `SITE`, `SERVICE_LIST`, `POSTS`,
and `LEGAL_DOCS`. Rebuilding the site after a service, article, or policy
change will therefore update `llms.txt` without a second manual edit.

A small pure renderer will remain separate from the route. This follows the
existing sitemap pattern and lets Node tests verify the Markdown without
starting a Next.js server.

The implementation will not add `llms-full.txt`. Reproducing every page in
one large file would duplicate the website, increase maintenance risk, and is
not needed for this relatively small public site.

## Document Structure

The response will follow the proposed `llms.txt` Markdown structure:

1. One H1 naming ADMIRATE.
2. One blockquote summarizing the business as a strategic design and
   marketing agency in Hyderabad, India.
3. A short factual paragraph explaining the work and geographic scope.
4. H2 link sections for:
   - primary pages;
   - the six service pages;
   - journal articles;
   - contact and social profiles;
   - legal and site information.

Every page entry will use an absolute canonical `https://admirate.in/...`
URL and a concise description. Journal descriptions will come from existing
post excerpts. Operational routes such as `/dashboard`, `/dashboard/login`,
and `/api/*` will never be included.

The document will avoid keyword repetition, unverifiable superlatives,
analytics claims, hidden instructions to language models, and content that is
not supported by the public website.

## Components

### Pure catalog and renderer

A focused module under `src/components/llms/` will:

- convert the supplied site metadata and content registries into ordered
  sections;
- format each resource as a specification-compatible Markdown link with a
  short description;
- normalize or escape text so authored punctuation cannot break the output;
- expose small functions that can be imported directly by Node tests.

The renderer will accept data rather than reading the filesystem or making
network requests.

### Next.js route

`src/app/llms.txt/route.ts` will import the current site registries, call the
renderer, and return the result with:

- HTTP status `200`;
- `Content-Type: text/markdown; charset=utf-8`;
- static generation, so no database or network call is required per request.

The route will use `SITE.url` rather than duplicating the production origin.

## Data Flow

At build time, the route reads the in-repository content registries, constructs
the public resource catalog, and passes it to the Markdown renderer. Next.js
publishes the rendered response at `/llms.txt`. A future content change takes
effect on the next deployment.

No visitor data, cookies, forms, Supabase data, or authentication state enters
this flow.

## Error Handling

The renderer will use deterministic fallbacks for optional descriptions and
will emit only entries with valid labels and public URLs. Because every source
is local and build-time, malformed data should fail automated verification or
the production build rather than degrade into a runtime network error.

## Verification

Automated tests will verify that:

- the renderer produces the required H1, summary, and section structure;
- URLs are absolute and use the canonical ADMIRATE origin;
- every registered service, journal article, and legal page appears;
- the start-project and sitemap pages appear;
- dashboard, login, and API routes do not appear;
- the route declares static generation and the Markdown content type.

The existing test suite and production build will be run after implementation.
A direct request to `/llms.txt` will be checked when a local server is
available.

## Out of Scope

- `llms-full.txt` or page-by-page Markdown mirrors;
- changes to `robots.txt` or the XML sitemap;
- new visible navigation or footer links;
- changes to existing metadata, schema, page copy, or crawler permissions;
- claims that `llms.txt` guarantees SEO or AI-search ranking gains.
