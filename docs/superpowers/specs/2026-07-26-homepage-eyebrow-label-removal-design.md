# Homepage eyebrow-label removal — design

Date: 2026-07-26
Status: Approved

## Goal

Simplify five homepage sections by removing the specified small red eyebrow
text while preserving the large section headings, layout, and animation.

## Scope

Only `src/components/landing/content.ts` changes.

- Change `// WHAT IS ADMIRATE` to `WHAT IS ADMIRATE`.
- Remove the small red `VIDEO PRODUCTION` label above the video section.
- Remove the small red `DIGITAL` label above the websites section.
- Remove the small red `SOCIAL MEDIA` label above the social-media section.
- Remove the small red `CLIENTS` label above “Brands we've worked with”.

The large “Video Production”, “Websites”, “Social Media”, and “Brands we've
worked with” headings remain unchanged. No CSS, animation engine, shared
navigation, service-detail page, or dashboard behavior changes.

## Implementation

Remove the three now-empty `.shead` wrappers from the video, digital, and
social-media sections. Remove only the `.eb` child from the brands `.shead`,
because that wrapper also contains the retained heading. Keep the intro `.tag`
element and remove only its leading slashes.

Direct markup removal is preferred over CSS hiding because it leaves no hidden
or screen-reader-visible label and introduces no new selector or state.

## Verification

1. Run a source regression check before implementation and confirm it fails
   while the four unwanted labels and slashes still exist.
2. Apply the minimal markup edit and confirm the same check passes while the
   four large headings remain present.
3. Run TypeScript verification.
4. Inspect the homepage at a mobile viewport to confirm the red labels are gone
   and the retained headings and section composition are unchanged.
