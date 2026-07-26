# Homepage Eyebrow-Label Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove four small red homepage eyebrow labels and the leading slashes from “WHAT IS ADMIRATE” while retaining every large section heading.

**Architecture:** Keep the change inside the homepage's existing raw HTML string. Add one Node built-in regression test that reads the real production source, asserts that the unwanted markup is absent, and asserts that the retained headings are still present.

**Tech Stack:** Next.js 16, TypeScript, raw HTML strings, Node.js `node:test`.

## Global Constraints

- Modify only homepage content and its focused regression test.
- Preserve the large “Video Production”, “Websites”, “Social Media”, and “Brands we've worked with” headings.
- Do not change CSS, animation engines, navigation, service-detail pages, APIs, or dashboard behavior.
- Do not add dependencies.

---

### Task 1: Remove the homepage eyebrow labels

**Files:**
- Create: `tests/homepage-eyebrow-labels.test.mjs`
- Modify: `src/components/landing/content.ts:559-739`

**Interfaces:**
- Consumes: `src/components/landing/content.ts` as the homepage markup source.
- Produces: homepage markup without the four unwanted `.eb` labels, plus `WHAT IS ADMIRATE` without leading slashes.

- [ ] **Step 1: Write the failing regression test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  resolve(here, "../src/components/landing/content.ts"),
  "utf8",
);

test("homepage removes the requested red eyebrow labels and keeps its main captions", () => {
  assert.match(source, /<div class="tag">WHAT IS ADMIRATE<\/div>/);

  for (const label of ["VIDEO PRODUCTION", "DIGITAL", "SOCIAL MEDIA", "CLIENTS"]) {
    assert.doesNotMatch(
      source,
      new RegExp(`<div class="eb rise"[^>]*>${label}<\\/div>`),
    );
  }

  for (const heading of [
    "Video Production",
    "Websites",
    "Social Media",
    "Brands we've worked with",
  ]) {
    assert.ok(source.includes(heading), `missing retained heading: ${heading}`);
  }
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/homepage-eyebrow-labels.test.mjs`

Expected: FAIL because the intro still contains `//` and the four `.eb` labels still exist.

- [ ] **Step 3: Apply the minimal homepage markup change**

In `LANDING_HTML`:

```html
<div class="tag">WHAT IS ADMIRATE</div>
```

Delete the complete `.shead` wrappers from `#tv`, `#web`, and `#reels`, because each contains only the unwanted eyebrow. In `#brands`, retain `.shead` and its `h2`, but delete only:

```html
<div class="eb rise" style="--rd:0s">CLIENTS</div>
```

- [ ] **Step 4: Run focused and project verification**

Run: `node --test tests/homepage-eyebrow-labels.test.mjs`

Expected: PASS with one passing test.

Run: `npx tsc --noEmit --incremental false`

Expected: exit 0 with no diagnostics.

Run: `git diff --check`

Expected: exit 0 with no whitespace errors.

- [ ] **Step 5: Inspect the homepage at a mobile viewport**

Start the existing development server with `npm run dev`, open `/`, and verify the five screenshot locations: no leading slashes in “WHAT IS ADMIRATE”; no red `VIDEO PRODUCTION`, `DIGITAL`, `SOCIAL MEDIA`, or `CLIENTS` eyebrow; all four large captions remain.

- [ ] **Step 6: Commit the implementation**

```bash
git add tests/homepage-eyebrow-labels.test.mjs src/components/landing/content.ts
git commit -m "fix: remove homepage eyebrow labels"
```
