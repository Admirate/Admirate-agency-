# Services Overview Mobile Label Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the specified decorative prefixes and eyebrow labels from the mobile `/services` overview without changing desktop or removing the red service links.

**Architecture:** Keep the existing HTML and CSS string in `src/components/services/content.ts`. Move the hero slashes into a desktop pseudo-element, then use the existing `max-width:768px` media query with section-ID-scoped selectors for the seven requested labels.

**Tech Stack:** Next.js 16, TypeScript, raw HTML/CSS strings, Node test runner

## Global Constraints

- Mobile means viewport widths of `768px` and below.
- Keep every requested label visible on desktop.
- Keep `OUR DESIGN WORK` visible on all viewports.
- Keep all red `EXPLORE ...` links visible.
- Do not hide `SOCIAL CREATIVES`, `WHY IT WORKS`, or labels on individual service pages.
- Do not add dependencies or refactor unrelated overview-page code.

---

### Task 1: Add the mobile label regression contract

**Files:**
- Create: `tests/services-overview-mobile-labels.test.mjs`
- Modify: `src/components/services/content.ts:76-77,418-443,603`

**Interfaces:**
- Consumes: `SERVICES_CSS` and `SERVICES_HTML` source text from `src/components/services/content.ts`
- Produces: A regression contract for the hero prefix and the seven section-scoped mobile selectors

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  resolve(here, "../src/components/services/content.ts"),
  "utf8",
);
const mobileStart = source.indexOf("/* ---------- MOBILE");
const mobileEnd = source.indexOf("/* ---------- SHORT VIEWPORTS", mobileStart);
const mobileCss = source.slice(mobileStart, mobileEnd);

test("mobile services overview hides only the requested decorative labels", () => {
  assert.match(source, /<div class="tag">OUR DESIGN WORK<\/div>/);
  assert.match(source, /#hero \.tag::before\{content:"\/\/ "\}/);
  assert.ok(mobileCss.includes("#hero .tag::before{display:none}"));
  assert.ok(
    mobileCss.includes(
      "#eye .eb,#logos .eb,#web .eb,#clients .eb,#reels .eb,#tv .eb,#collat .eb{display:none}",
    ),
  );

  for (const label of [
    "EYE-LEVEL DESIGN",
    "IDENTITY",
    "DIGITAL",
    "CLIENT WEBSITES",
    "SOCIAL MEDIA",
    "VIDEO PRODUCTION",
    "BRAND COLLATERALS",
  ]) {
    assert.ok(source.includes(`>${label}</div>`), `desktop label removed: ${label}`);
  }

  for (const retained of ["EXPLORE DESIGN", "EXPLORE IDENTITY", "SOCIAL CREATIVES", "WHY IT WORKS"]) {
    assert.ok(source.includes(retained), `retained content removed: ${retained}`);
  }
});
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run: `node --test tests/services-overview-mobile-labels.test.mjs`

Expected: FAIL because the hero still contains `// OUR DESIGN WORK` and the mobile scoped rules do not exist.

- [ ] **Step 3: Implement the minimal responsive CSS and markup change**

Add the desktop prefix rule beside the hero tag styles:

```css
#hero .tag::before{content:"// "}
```

Inside `@media (max-width:768px)`, add:

```css
#hero .tag::before{display:none}
#eye .eb,#logos .eb,#web .eb,#clients .eb,#reels .eb,#tv .eb,#collat .eb{display:none}
```

Change the hero markup to:

```html
<div class="tag">OUR DESIGN WORK</div>
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `node --test tests/services-overview-mobile-labels.test.mjs`

Expected: PASS with one test and zero failures.

- [ ] **Step 5: Run repository verification**

Run:

```powershell
node --test
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

Expected: all commands exit with code `0`.

- [ ] **Step 6: Verify the mobile page visually**

Open `/services` at approximately `393x852`. Confirm `OUR DESIGN WORK` has no slashes, the seven requested labels are absent, and the red `EXPLORE ...` links remain. Confirm at a desktop viewport that the slashes and section labels remain.

- [ ] **Step 7: Commit the implementation**

```powershell
git add src/components/services/content.ts tests/services-overview-mobile-labels.test.mjs
git commit -m "fix: simplify mobile services labels"
```
