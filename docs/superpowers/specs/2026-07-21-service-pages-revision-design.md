# Service pages revision — design

Date: 2026-07-21

## Context

The six service pages under `app/services/<slug>/` are authored as self-contained
HTML: each `content.ts` exports a CSS string and an HTML string, which
`RawPage.tsx` injects via `dangerouslySetInnerHTML`, and an `init.ts` drives
imperatively. A static export of these pages was revised by hand, and those
revisions are the new intended state of the pages.

The revised files were exported from an earlier build, so they lack sections
that were added since. The decision taken is that **the revised HTML is the
final state**: sections absent from it are removed.

## What changes

Per page, two files: `content.ts` (the `*_CSS` and `*_HTML` strings and their
backing data arrays) and `init.ts` (the engine). Unchanged: `*Client.tsx`,
`app/services/*/page.tsx`, `registry.ts`, `shared/nav.ts`.

### Sections removed (17)

| Page | Removed |
|---|---|
| identity | `half`, `sys`, `scale`, `proof`, `depth` |
| design | `gaze`, `hier`, `dproof`, `ddepth` |
| social-media | `feed`, `sproof`, `sdepth` |
| digital | `build`, `job`, `ddepth` |
| video-production | `rat`, `vproof`, `vdepth` |
| brand-collaterals | `shelf`, `press`, `hard`, `cdepth` |

Their HTML, CSS and init logic all come out, along with any now-unused exports
(e.g. `OBJECT_COUNT`) and set-piece handlers (e.g. the `press` pointer-drag).

### Sections added

Marquees `dwork`, `swall`, `montage`, `cwall`; `brands` tile wall (identity);
`range` list (brand-collaterals); `craft` and `med` (design); `journey` and
`built` (digital).

No marquee exists in the current source. The marquee is CSS-only: a
`.mqtrack` translating `-50%` over a set duplicated twice, the second copy
`aria-hidden`, paused on hover, and disabled under reduced motion where the
container becomes `overflow-x:auto` instead.

## Corrections applied during the port

The revised files are a *static export*, and carry artifacts that would be live
bugs. These are corrected rather than ported verbatim:

1. **Nav dropped.** Each file inlines a nav with `href="identity.html"` and
   `src="assets/admirate-logo.webp"`. `navHtml()` already emits
   `/services/<slug>` and the CDN logo. Porting the inline nav would break
   every link, so the pasted nav and its CSS are discarded.
2. **Encoding restored.** The files are UTF-8 read as Latin-1 (`â` for `—`,
   `donâ€™t` for `don't`, `â` for `→`). Real characters are restored:
   `— ' → ▼ ✕ · ©`.
3. **Orphaned CSS stripped.** `brand-collaterals` retains `#shelf`, `.stage`,
   `.obj` rules and a `#shelf.in .up` selector for deleted markup; `digital`
   retains `#build.in .up`.
4. **Dead locals removed.** Several `init.ts` files declare `staticScrub` and
   `seg` after the scrub sections using them were removed; `next lint` errors
   on these. Kept only where a scrub survives (`identity`'s `anat`,
   `video-production`'s `tl`).

## Authoring style

The revised export is flat HTML. The existing `content.ts` files are
data-driven — repeated structures come from arrays (`PROOF`, `NEXT`) rendered
by small helpers, with `heroLine()` generating the per-letter hero animation.
The port preserves that: new repeated structures (the 12 `range` rows, the 12
`cwall` cases, the marquee's duplicated set) become arrays and helpers rather
than flat repeated markup.

## Verification

Per page: `npx tsc --noEmit`, `next lint`, then the route in dev —

- section rail dot count matches section count
- background colour transitions across sections on scroll
- marquee animates and pauses on hover
- reduced-motion degrades cleanly (marquee static and horizontally scrollable)
- surviving scrubs still track scroll (`identity` `anat`, `video-production` `tl`)

## Sequencing

`brand-collaterals` first, verified in the browser, then the remaining five
follow the same pattern.
