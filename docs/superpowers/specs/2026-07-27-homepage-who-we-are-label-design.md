# Homepage “Who We Are” Label Design

**Status:** Approved  
**Date:** 2026-07-27

## Goal

Rename the small red homepage eyebrow from “WHAT IS ADMIRATE” to “WHO WE ARE”.

## Scope

- Change only the eyebrow text in the existing homepage markup.
- Preserve its typography, color, spacing, position, and animation.
- Preserve the supporting paragraph and all other homepage content.

## Implementation

Update the existing static label in `src/components/landing/content.ts` and adjust its focused regression assertion in `tests/homepage-eyebrow-labels.test.mjs`.

## Verification

Run the focused regression test, the full Node test suite, TypeScript checking, and the production build.
