# Homepage “Who We Are” Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development to execute this plan task by task.

**Goal:** Change the homepage eyebrow label from “WHAT IS ADMIRATE” to “WHO WE ARE”.

**Architecture:** Keep the current raw homepage markup and styling intact. Update the existing copy value and its focused regression assertion without introducing components, dependencies, or layout changes.

**Tech Stack:** TypeScript, Next.js, Node test runner

## Global Constraints

- Do not change the paragraph, styling, spacing, or animation.
- Exclude unrelated cleanup.
- Work directly on the current `main` branch as requested.

---

### Task 1: Rename the homepage eyebrow

**Files:**
- Modify: `tests/homepage-eyebrow-labels.test.mjs`
- Modify: `src/components/landing/content.ts`

**Step 1: Update the regression expectation**

Change the expected eyebrow string to `WHO WE ARE`.

**Step 2: Confirm the focused test fails**

Run: `node --test tests/homepage-eyebrow-labels.test.mjs`

Expected: FAIL because the homepage still contains `WHAT IS ADMIRATE`.

**Step 3: Make the minimal production change**

Replace only the eyebrow label with `WHO WE ARE`.

**Step 4: Confirm the focused test passes**

Run: `node --test tests/homepage-eyebrow-labels.test.mjs`

Expected: PASS.

**Step 5: Run full verification**

Run:

- `node --test`
- `npx tsc --noEmit --incremental false`
- `npm run build`
- `git diff --check`

Expected: all commands exit successfully.

**Step 6: Commit**

Commit the approved copy-only change and its documentation on `main`.
