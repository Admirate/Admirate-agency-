# Services Overview Mobile Label Cleanup Design

**Status:** Approved  
**Date:** 2026-07-27

## Context

The `/services` overview repeats small red eyebrow labels above its mobile section content. The supplied screenshots identify the labels as visual noise on a narrow screen while the section headings and red `EXPLORE ...` links already communicate the content.

## Goal

At viewport widths of `768px` and below:

- Show `OUR DESIGN WORK` without the leading `//`.
- Hide the small red top-left labels `EYE-LEVEL DESIGN`, `IDENTITY`, `DIGITAL`, `CLIENT WEBSITES`, `SOCIAL MEDIA`, `VIDEO PRODUCTION`, and `BRAND COLLATERALS`.

## Scope

- Keep every requested label visible on desktop.
- Keep `OUR DESIGN WORK` visible on mobile and desktop; remove only its mobile slashes.
- Keep all headings, descriptions, media, animations, and `EXPLORE ...` links.
- Keep unrelated eyebrow labels such as `SOCIAL CREATIVES` and `WHY IT WORKS` visible.
- Make no changes to individual service pages.

## Approach

Store `OUR DESIGN WORK` as clean HTML text and render its desktop slashes with a pseudo-element. Hide that pseudo-element in the existing mobile media query. In the same media query, use section-ID-scoped selectors to hide exactly the seven requested `.eb` elements.

This preserves desktop output and prevents a broad `.eb` rule from hiding unrelated labels.

## Verification

- Add a source-level regression test for the responsive selector contract.
- Verify the focused test fails before implementation and passes afterward.
- Run the full Node test suite, TypeScript checker, and production build.
- Inspect `/services` at a mobile viewport and confirm the desktop labels remain represented in the markup.
