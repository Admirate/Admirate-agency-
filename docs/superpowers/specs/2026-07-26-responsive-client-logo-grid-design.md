# Responsive Client Logo Grid Design

**Status:** Approved
**Date:** 2026-07-26

## Context

The homepage currently presents 12 verified client logos in two continuously moving marquee rows. The available row height and shared image caps make the logos look small, particularly on phones, while the duplicated tracks make each client appear more than once. The section should instead give every client a large, stable, equally legible place in the layout.

The redesign uses the existing `CLIENT_LOGOS` registry and the existing files in the Supabase `client logos` bucket. It does not add, remove, rename, or reorder clients.

## Goals

- Make every client logo large and visually prominent on desktop, tablet, and mobile.
- Show all 12 clients in one static grid without duplicated marquee content.
- Present the logos in a consistent monochrome treatment on hover-capable devices.
- Reveal each logo's original colors when its cell is hovered.
- Preserve legibility for unusually wide, square, padded, and white-on-transparent marks.
- Preserve descriptive alternative text and reduced-motion behavior.

## Non-goals

- Adding links or click actions to client logos.
- Changing the client registry or the identity page's logo wall.
- Downloading or replacing the existing logo artwork.
- Adding a carousel, autoplay, or new JavaScript animation dependency.

## Chosen Direction

Use a full-width, editorial logo wall with subtle dividing rules. The grid is deliberately quiet so the client marks remain the only visual subject. Its signature interaction is a monochrome-to-original-color reveal.

The existing Admirate palette remains unchanged:

- **White:** `#FFFFFF` for the cells and section surface.
- **Paper:** `#FAFAF8` for subtle surrounding contrast when needed.
- **Ink:** `#0B0B0C` for the section heading and monochrome emphasis.
- **Line:** `#E9E9E6` for grid divisions.
- **Admirate red:** `#E3001B`, retained as the site accent but not added decoratively inside the client wall.

The section keeps the existing Archivo heading and Inter body system. No new typeface is introduced because the logos, not supporting copy, carry the section's personality.

## Layout

The existing section heading, “Brands we've worked with,” remains above the wall. The duplicated marquee markup is replaced by one semantic list with one item per client.

```text
Desktop, 4 columns

| Client | Client | Client | Client |
| Client | Client | Client | Client |
| Client | Client | Client | Client |

Tablet, 3 columns

| Client | Client | Client |
| Client | Client | Client |
| Client | Client | Client |
| Client | Client | Client |

Mobile, 2 columns

| Client | Client |
| Client | Client |
| Client | Client |
| Client | Client |
| Client | Client |
| Client | Client |
```

Breakpoints follow the landing page's existing responsive structure:

- Above `1024px`: four columns.
- From `641px` through `1024px`: three columns.
- At `640px` and below: two columns.

The brands section becomes content-height with a viewport-height minimum rather than forcing the complete grid into exactly one viewport. This prevents large logos from being compressed or clipped on short screens. Each cell uses a generous responsive minimum height and internal padding. Logo images are constrained by both width and height so wide wordmarks and compact emblems reach comparable optical prominence. The existing per-logo `scale` correction remains available for artwork with excessive transparent padding.

## Interaction

On devices that support true hover:

1. Every logo rests in a saturated-down monochrome treatment using CSS filters.
2. Hovering a cell removes the filter and reveals the source artwork's original colors.
3. The logo receives a restrained scale increase to make the state change unmistakable without disturbing the grid.
4. The transition uses a short, smooth easing curve.

On devices without hover, logos render in their original colors by default. This avoids hiding the requested color state behind an unreliable touch gesture.

The color shift is decorative rather than actionable, so cells are not represented as fake links or buttons. Logo names remain available through image `alt` text.

When `prefers-reduced-motion: reduce` is active, the scale and transition are removed while the accessible, readable image state remains.

## White-on-transparent Logo Handling

Zythum's registered source artwork is white on transparency. At rest, its existing `inv` flag converts the artwork to a dark monochrome mark on white. During the original-color reveal, its cell changes to the dark Admirate ink surface and the filter is removed, allowing the actual white artwork to remain visible. Other clients keep the white cell surface in both states.

## Components and Data Flow

- `src/components/shared/clients.ts` remains the single registry of client names, filenames, inversion flags, and optical scale corrections.
- `src/components/landing/content.ts` owns the single grid container and all responsive/interaction styles.
- `src/components/landing/init.ts` imports `CLIENT_LOGOS`, renders exactly one item for each client into the grid, and retains lazy loading and asynchronous decoding.
- The two `LOGO_ROWS` marquee split and the duplicated `m1`, `m1b`, `m2`, and `m2b` containers are no longer used by the homepage.

No network request, state management, or new dependency is introduced beyond the image requests already made by the existing section.

## Failure and Fallback Behavior

- If an individual remote logo fails to load, the failure is isolated to that cell and does not affect grid layout or other brands.
- If CSS hover is unavailable, the no-hover rule presents original colors without JavaScript.
- If motion is reduced, the grid remains fully usable with static images.
- Short viewports are allowed to scroll through the content-height section rather than receiving smaller logos.

## Testing and Verification

Implementation will follow a red-green test cycle.

Automated regression coverage will verify that:

- the homepage contains one client grid rather than two marquee rows;
- the renderer uses all 12 entries from `CLIENT_LOGOS` exactly once;
- the layout declares four desktop, three tablet, and two mobile columns;
- hover-capable devices reveal original colors;
- no-hover devices render original colors by default;
- the Zythum inversion and dark-hover treatment remain present;
- the old marquee animation and duplicate track IDs are removed from the homepage.

After the focused test passes, the full Node test suite, TypeScript compiler, and production build will be run. The rendered homepage will also be inspected at representative desktop and mobile widths to verify optical size, clipping, grid flow, and color-reveal behavior.
