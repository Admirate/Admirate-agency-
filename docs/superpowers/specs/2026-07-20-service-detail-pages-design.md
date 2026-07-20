# Service Detail Pages — Design

**Date:** 2026-07-20
**Status:** Approved, exemplar in build

## Goal

Give each of the six services named in the nav's services menu its own page, so a
submenu click lands on a dedicated journey rather than scrolling to a section of
`/services`.

The six: Identity, Design, Social Media, Digital, Video Production, Brand
Collaterals.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Sequencing | One exemplar (Identity) built end-to-end, then five replicas | Six journey-grade pages in one pass drifts in quality; the exemplar fixes the grammar, the CSS layer and the voice before it is multiplied by six |
| Copy source | Supplied by the client | The repo does not contain process, pricing, turnaround or results data, and its existing norm is to omit unverifiable claims rather than invent them |
| `/services` | Stays as the overview; each section gains an "Explore →" link out | Preserves indexed URL, its OG image, its JSON-LD and animation work that already exists and is good |
| Code sharing | Shared engine + shared shell + six data files, one dynamic route | An animation fix lands on all six at once; six small data files beat twelve large near-duplicate ones |
| Scroll feel | Native scroll + the existing cached-geometry rAF engine | Matches the rest of the site, keeps keyboard/find-in-page/trackpad intact, respects reduced motion, adds no KB. `gsap` and `framer-motion` are installed but unused; Lenis is named in the README but not installed |
| Per-service colour | No new accent hues — tonal journeys only | Six accents would dilute the single brand red. Each service instead gets a distinct ink↔paper progression |

## Architecture

The public pages of this site are not JSX. Each is a raw CSS string plus a raw
HTML string plus an imperative `init.ts`, mounted through `RawPage.tsx`. These
pages follow that convention, but factor the parts the six share.

```
src/components/service/
  types.ts       ServiceData contract
  shell.ts       shared CSS + page chrome (fixed layers, CTA, footer)
  sections.ts    the eight movement renderers
  engine.ts      shared rAF scroll engine, returns cleanup()   // @ts-nocheck
  data/
    identity.ts  copy, SVG, section order, tonal journey
    …five more
  ServicePageClient.tsx

src/app/services/[slug]/page.tsx
src/app/services/[slug]/opengraph-image.tsx
```

`page.tsx` mirrors `blogs/[slug]/page.tsx`: `generateStaticParams` over the six
slugs and `dynamicParams = false`, so an unknown slug 404s at build rather than
rendering an empty shell.

### Slugs

`identity`, `design`, `social-media`, `digital`, `video-production`,
`brand-collaterals`.

## The journey — eight movements

A page is an ordered list of movements. Data files choose and order them, so the
six share a spine without being identical.

1. **Overture** — full-bleed hero: service name in Archivo variable-width, an
   animated inline SVG signature unique to the service, scroll hint
2. **Thesis** — the single-sentence argument, set large on ink
3. **Deliverables** — numbered grid, staggered rise on enter
4. **Process** — stepped scrub; the spine of the journey
5. **Showcase** — real client work, reusing the existing roster
6. **Depth** — the text-dense movement; carries the most copy weight
7. **Adjacent** — cross-links to the other five, so the set reads as a system
8. **Close** — CTA into `/start-project`

### Movement 8 detail

The close deep-links as `/start-project?service=<Service>`, and `start/init.ts`
preselects the matching chips, so the user does not re-state what they just
clicked.

The two vocabularies are not the same, which is worth stating because it is easy
to assume otherwise: only *Social Media*, *Video Production* and *Brand
Collaterals* exist verbatim as chips. *Identity* covers both "Branding" and
"Logo design", *Design* covers "Campaigns" and "Print ads", and *Digital* maps to
"Websites". The mapping is therefore written out explicitly in `start/init.ts`
rather than inferred by comparison. An unrecognised value selects nothing.

## Brand and motion

Tokens are fixed and reused exactly: `--red:#E3001B`, `--black:#0B0B0C`,
`--paper:#FAFAF8`, `--white:#FFFFFF`, `--line:#E9E9E6`, `--grey:#8A8A8E`.
Type is Archivo (variable width axis) / Inter / IBM Plex Mono.

All SVG is inline and hand-drawn. The CSP in `netlify.toml` restricts `img-src`
to `self`, `data:` and Supabase, so an external asset host is not an option
anyway.

## Constraints inherited from the codebase

- `engine.ts` opens with `// @ts-nocheck`, matching the other two engines. It is
  imperative ported-style code, not idiomatic TS.
- `init()` must return a `cleanup()` that cancels every rAF, clears every timer,
  disconnects every observer and removes every window listener. `RawPage` calls
  it on unmount; a leak here would cross all six pages.
- `reactStrictMode: false` stays. The imperative code initialises once per mount.
- Mobile breakpoint is `max-width:768px`. `IS_M` in JS uses the same value.
- `@media (max-height:600px)` disables the scrub via `staticScrub`, as on the
  existing pages.
- `prefers-reduced-motion: reduce` disables the scrub and the cursor, and shows
  all `.rise` content in place.
- Any dynamic value interpolated into `innerHTML` goes through `esc()`.

## SEO

Each page emits `pageMeta()`, a `BreadcrumbList` (Home → Services → *Service*)
and a `Service` node whose `provider` resolves to the existing organization
`@id`, joining the connected graph rather than floating. `sitemap.ts` gains the
six URLs at priority 0.8 — below `/services` (0.9), above the posts (0.6).

Each slug ships its own `opengraph-image` through the shared `ogImage()` helper.

## Out of scope

- No test runner. None exists in this repo and the previous plan explicitly
  ruled adding one out of scope. Verification is `npx tsc --noEmit`,
  `npm run lint`, `npm run build`, plus browser checks at named viewports.
- No changes to the dashboard, the API layer or the database.
- No new dependencies.

## Open item

The Identity data file ships with draft copy written only from what the repo
already supports. Every line requiring client verification is marked `REVIEW:`
in that file. Replacing it is a single-file edit — that is the point of the data
file split.
