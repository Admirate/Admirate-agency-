# Mobile parity + Start-a-Project page — Design

**Date:** 2026-07-13
**Status:** Approved (pending spec review)

## Context

Three hand-authored HTML files were supplied as the source of truth:

| File | Maps to |
|---|---|
| `admirate-landing-mobile-v3.html` | `/` (landing) |
| `admirate-design-mobile-v2.html` | `/services` |
| `admirate-start-project.html` | `/start-project` — **new page** |

The public pages are not JSX. Each is a raw HTML string + raw CSS string + an
imperative `init.ts`, mounted through `RawPage.tsx`. Editing a page means editing
those strings, not components. That constraint holds throughout this work.

## Goals

1. Mobile renders exactly as the supplied files do, on both landing and services.
2. Landing adopts the supplied file as its new design (desktop included).
3. The contact form leaves the landing page and becomes a dedicated
   `/start-project` page with a richer brief.

## Decisions

These were settled with the user before design:

- **Landing = adopt file as new design.** Not a mobile-only port. The services
  section becomes a 12-block icon grid; logos becomes a `full` section. The pill
  nav, real client names and CTA routing are re-grafted on top.
- **Services = port the mobile layer only.** Structure already matches 1:1.
- **Keep the pill nav** (`shared/nav.ts`) on landing and services. The files show
  an older plain `<nav>`; the pill nav is newer and shared with `/blogs`.
- **Keep the `max-height:600px` escape hatch** and the `staticScrub` flag. The
  files don't have it; it prevents landscape phones and SE-class screens from
  cropping a slide behind `overflow:hidden`.
- **Brief fields get real columns**, not prose folded into `message`.
- **Brief submit saves and shows the success card.** No WhatsApp popup on submit.

---

## 1. Render engine (both pages)

This is the substance of "the mobile version", more than any media query.

Both `init.ts` files today:

- run `requestAnimationFrame` every frame with no gating;
- call `progressOf()` → `getBoundingClientRect()` per section, per frame;
- `services/init.ts` additionally repaints `bgMorph()` and `orbTick()` every frame.

The supplied files replace this with a cached, event-gated engine. Port it to both:

```
measure()   -> cache GEOMAP {top,h} per section, VH, DOCH; recompute on
               resize / orientationchange / visibilitychange / load
dirty flag  -> set true on scroll; render() runs only when dirty && !hidden
P(id)       -> progress read from cached GEOMAP, zero layout reads per frame
IS_M        -> matchMedia('(max-width:768px)')
AMPF        -> 0.45 on mobile, 1 on desktop — damps the social parallax
```

On mobile (`IS_M`), the services page swaps the per-frame gradient interpolation
for a zone-based background swap (`lastZone` guard + a CSS
`transition:background-color .6s`), and hides `#lightorb` entirely.

The two loops drive different sections, so they stay two files. Same pattern,
applied twice — no shared `engine.ts`. Extracting one now would put both pages at
risk for little gain.

## 2. Landing page

### `landing/content.ts` — CSS

- **Remove** the `#services` scrub styles: `.svcline`, `.svcbox`, `.svcmeta`,
  `.svctrack`, `.svclist`.
- **Add** the grid styles from the file: `.svcgrid` (4-col, 2-col ≤768px),
  `.svcblock`, `.svcin` (red hover fill, icon rotate).
- `#services` and `#logos` drop from `scrub` (240vh / 200vh) to `full`.
- Tiles animate on `.sec.active` (`--i` / `--dx` / `--dr`) instead of being scrubbed.
- **Add** the file's `@media (max-width:768px)` and `(max-width:400px)` blocks:
  scroll-snap per section, frosted-bar rules skipped (pill nav), tighter type,
  shorter scrubs (`#tv` 220vh, `#web` 230vh, `#reels` 240vh).
- **Remove** all `#contact` styles (`.cwrap`, `.cleft`, `.cform`, `.cfield`,
  `.csend`, `.cnote`, `.cerr`).

### `landing/content.ts` — HTML

- `#services` → `<section id="services" class="sec full">` containing
  `<div class="stagewrap"><div class="svcgrid" id="svcgrid"></div></div>`.
- `#logos` → `full`; tiles carry `--i` / `--dx` / `--dr`.
- **Delete the entire `#contact` section.**
- Sections go 10 → 9. Renumber every `.idx` from `NN — 10` to `NN — 09`.
- Kept verbatim: loader, hero, intro, tv, web, reels, brands, cta.

### `landing/init.ts`

- Delete the `.svcline` rolling-index scrub and the tile fly-in scrub from `tick2`
  (both are CSS-driven now).
- Build `#svcgrid` from the existing `SVC` + `SVCICON` constants — the data is
  already there, only the template changes.
- Delete the contact-form block: `validate()`, `setErr()`, `_onSubmit`, `FIELDS`,
  `IDLE_NOTE` and the `cform` listener.
- Apply the render engine from §1.
- Kept: loader/`boot()`, hero letter-split, intro word reveal, anchor scrolling,
  marquee fill with the **real** client names, `staticScrub`, `cleanup()`.

## 3. Services page

No markup rewrite — structure already matches. Changes are confined to the
stylesheet's responsive cascade and the engine.

- Merge the file's 768px rules into the existing 1024 → 900 → 640 cascade:
  scroll-snap per section, `#bgfade{transition:background-color .6s}`,
  `#lightorb{display:none}`, `#logos{height:auto;min-height:100svh}`,
  shorter scrubs (`#eye` 200vh, `#web` 220vh, `#social` 170vh).
- **Restore the dot nav on mobile** at the file's sizes (5px dot / 16px active).
  The repo currently hides it below 900px; the file keeps it.
- Apply the render engine from §1, including the mobile zone-based background.
- Keep the `max-height:600px` block and `staticScrub` untouched.

## 4. Start-a-Project page (new)

### Route and files

`/start-project` — new. Follows the existing RawPage convention:

```
src/app/start-project/page.tsx        server component + metadata
src/components/start/StartClient.tsx  RawPage wrapper
src/components/start/content.ts       START_CSS + START_HTML
src/components/start/init.ts          chips, validation, submit, scroll morph
```

**Nav:** this page keeps the file's own nav (`ADMIRATE.` + `← BACK TO SITE`), not
the pill nav. It is a focused conversion page; the pill nav's Home/Services/Blogs
links invite the user back out of the funnel.

### The page

Two sections, and the background morph between them *is* the animation:

1. `#intro` — full-screen on ink (`#0B0B0C`). Word-split `h1`, the 01/02/03 step
   list, WhatsApp + email chips.
2. `#formsec` — the brief card, centred on paper (`#FAFAF8`).

`#bgfade` interpolates ink → paper as `#formsec` arrives; `#introInner` drifts up
and fades on exit. Same cached/`dirty`-gated engine as §1.

### Form

Required: `name`, `email`, `brief` (≥10 chars). Optional: `company`, `phone`.
Chip groups: `services` (multi-select), `budget` (single), `timeline` (single).

On submit: validate inline (`.err` shake), `POST /api/contact`, then reveal the
`.done` card (SVG circle + tick draw-on). "Send another brief" resets the form and
clears all chips. No WhatsApp popup.

## 5. Data layer

### Migration (user runs once in the Supabase SQL editor)

```sql
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS company  TEXT,
  ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS budget   TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT;
```

Committed to the repo as `supabase/migrations/0001_brief_fields.sql` so the schema
stops living only in the README. All four columns are nullable/defaulted, so the
existing landing→contact path and existing rows keep working unchanged.

### `/api/contact` — extend the zod schema

Add, all optional: `company` (≤120), `services` (`string[]`, default `[]`),
`budget` (≤40), `timeline` (≤40). `brief` maps to the existing `message` field,
so `min(10)` still applies. Existing required fields are untouched.

### `types/database.ts`

Add the four columns to `contact_submissions` Row / Insert / Update.

### Dashboard

`/dashboard` (submissions) renders the new fields when present: company beside the
name, services as chips, budget and timeline as small labelled values. Rows
without them (every existing row) render exactly as they do today.

## 6. Routing cleanup

Removing `#contact` from the landing page orphans every link pointing at it:

- `LandingClient.tsx` — `navHtml("home", "#contact")` → `navHtml("home", "/start-project")`
- `shared/nav.ts` — default `ctaHref` `/#contact` → `/start-project`
- Landing CTA button — `href="#contact"` → `/start-project`
- Any other `navHtml(...)` call site (services, blogs) inherits the new default
- `app/sitemap.ts` — add `/start-project` (priority 0.9, monthly)

## Out of scope

- No shared scroll engine module (see §1).
- No Resend notification on brief submit. The dashboard is the inbox, as today.
- No changes to the blogs page beyond the nav CTA href it inherits.
- The unauthenticated-API and unverified-JWT issues found while reading the
  codebase are real but unrelated; they are not touched here.

## Risks

- **The landing services section is a real design change, not a port.** The
  scrubbing 12-item list is deleted. This is intended, but it is the change most
  likely to draw "that's not what I meant" — verify it on desktop first.
- The `svcgrid` icon set is reused from the existing `SVCICON` map. If any icon
  reads badly at grid size, that surfaces only on screen.
- `services` as `TEXT[]` requires the Supabase client to send a real array. A
  string would be coerced and silently stored wrong.

## Verification

Per phase, in the browser at 390×844 (portrait phone), 844×390 (landscape), and
desktop:

1. Landing: services grid renders 12 blocks, 2-col on mobile; logos tiles fly in;
   no contact section; every CTA lands on `/start-project`; scroll-snap settles
   per section.
2. Services: dots visible on mobile; background steps per section rather than
   interpolating; parallax damped; nothing cropped at 600px tall.
3. Start-project: ink→paper morph tracks scroll; chips toggle (multi vs single);
   validation shakes the right fields; a real submit lands in Supabase **with the
   services array intact**; success card draws; "send another" resets.
