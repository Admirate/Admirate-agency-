# Responsive Client Logo Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's duplicated logo marquees with a large responsive client grid whose monochrome logos reveal their original colors on hover-capable devices.

**Architecture:** Keep `CLIENT_LOGOS` as the single data source. Render it once from the existing landing-page initializer into a semantic list owned by `content.ts`, then use CSS media queries for the four/three/two-column layout and hover/no-hover behavior. No new component framework, image asset, runtime state, or dependency is needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, raw HTML/CSS landing-page strings, browser DOM initialization, Node's built-in test runner.

## Global Constraints

- Use all 12 existing entries from `CLIENT_LOGOS` exactly once and preserve their current order.
- Do not add, remove, rename, download, or replace client artwork.
- Do not change the identity page's client wall or the shared registry shape.
- Use four columns above `1024px`, three columns from `641px` through `1024px`, and two columns at `640px` and below.
- On true-hover devices, show monochrome logos at rest and original colors on hover.
- On no-hover devices, show original logo colors by default.
- Keep Zythum readable as a dark mark on white at rest and as its original white artwork on an ink background in the color state.
- Preserve lazy loading, asynchronous decoding, descriptive `alt` text, optical scale corrections, and reduced-motion support.
- Work directly on `main` and push verified implementation commits to `origin/main`, as requested by the user.

---

### Task 1: Render one semantic client grid

**Files:**
- Create: `tests/homepage-client-logo-grid.test.mjs`
- Modify: `src/components/landing/content.ts:725-734`
- Modify: `src/components/landing/init.ts:3-44`

**Interfaces:**
- Consumes: `CLIENT_LOGOS: ClientLogo[]` and `clientLogo(path: string): string`.
- Produces: one `<ul class="client-grid" id="clientGrid" aria-label="Client brands">` populated with one `<li class="client-cell">` per registry entry.

- [ ] **Step 1: Write the failing structural regression test**

Create `tests/homepage-client-logo-grid.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const content = readFileSync(
  resolve(here, "../src/components/landing/content.ts"),
  "utf8",
);
const init = readFileSync(
  resolve(here, "../src/components/landing/init.ts"),
  "utf8",
);

test("homepage renders every registered client once in one static grid", () => {
  assert.match(
    content,
    /<ul class="client-grid" id="clientGrid" aria-label="Client brands"><\/ul>/,
  );

  for (const removedId of ["m1", "m1b", "m2", "m2b"]) {
    assert.doesNotMatch(content, new RegExp(`id="${removedId}"`));
  }
  assert.doesNotMatch(content, /class="marquee/);

  assert.match(
    init,
    /import \{ CLIENT_LOGOS \} from "@\/components\/shared\/clients";/,
  );
  assert.match(init, /CLIENT_LOGOS\.map\(b=>/);
  assert.match(init, /class="client-cell\$\{b\.inv\?' is-inverted':''\}"/);
  assert.doesNotMatch(init, /LOGO_ROWS/);
  assert.doesNotMatch(init, /fill\('m1'/);
});
```

- [ ] **Step 2: Run the structural test and verify RED**

Run:

```powershell
node --test tests/homepage-client-logo-grid.test.mjs
```

Expected: one failing test because `clientGrid` is absent and the marquee IDs still exist.

- [ ] **Step 3: Replace the duplicated marquee container**

In `src/components/landing/content.ts`, retain the heading and replace the two marquee rows with:

```html
<ul class="client-grid" id="clientGrid" aria-label="Client brands"></ul>
```

- [ ] **Step 4: Render `CLIENT_LOGOS` exactly once**

In `src/components/landing/init.ts`, replace the `LOGO_ROWS` import with:

```ts
import { CLIENT_LOGOS } from "@/components/shared/clients";
```

Replace the two-row fill logic with:

```ts
const clientGrid = document.getElementById('clientGrid');
clientGrid.innerHTML = CLIENT_LOGOS.map(b=>
  `<li class="client-cell${b.inv?' is-inverted':''}"><img src="${clientLogo(b.file)}" alt="${b.name}"${b.inv?' class="inv"':''}${b.scale?` style="--s:${b.scale}"`:''} loading="lazy" decoding="async"></li>`
).join('');
```

Update the adjacent comment so it describes one grid, the `inv` flag, and the optical `scale` correction rather than two marquee rows.

- [ ] **Step 5: Run the structural test and verify GREEN**

Run:

```powershell
node --test tests/homepage-client-logo-grid.test.mjs
```

Expected: one passing test, zero failures.

- [ ] **Step 6: Commit the semantic grid**

```powershell
git add -- tests/homepage-client-logo-grid.test.mjs src/components/landing/content.ts src/components/landing/init.ts
git commit -m "refactor: render clients in one homepage grid"
```

---

### Task 2: Add bold responsive sizing and color reveal

**Files:**
- Modify: `tests/homepage-client-logo-grid.test.mjs`
- Modify: `src/components/landing/content.ts:307-333`
- Modify: `src/components/landing/content.ts` responsive blocks near `@media (max-width:1024px)`, `@media (max-width:640px)`, and `@media (prefers-reduced-motion:reduce)`

**Interfaces:**
- Consumes: `.client-grid`, `.client-cell`, `.client-cell.is-inverted`, `img.inv`, and optional image custom property `--s` produced by Task 1.
- Produces: a 4/3/2-column responsive grid, hover color reveal, original-color touch state, and reduced-motion-safe transitions.

- [ ] **Step 1: Add the failing responsive and interaction test**

Append this test to `tests/homepage-client-logo-grid.test.mjs`:

```js
test("client grid is bold, responsive, and reveals original logo colors", () => {
  const css = content.replace(/\s+/g, "");

  assert.ok(
    css.includes(".client-grid{list-style:none;margin:0;padding:0var(--pad);display:grid;grid-template-columns:repeat(4,minmax(0,1fr))"),
    "missing four-column desktop grid",
  );
  assert.ok(
    css.includes("@media(max-width:1024px){") &&
      css.includes(".client-grid{grid-template-columns:repeat(3,minmax(0,1fr))}"),
    "missing three-column tablet grid",
  );
  assert.ok(
    css.includes("@media(max-width:640px){") &&
      css.includes(".client-grid{grid-template-columns:repeat(2,minmax(0,1fr))}"),
    "missing two-column mobile grid",
  );
  assert.match(content, /@media \(hover:hover\) and \(pointer:fine\)/);
  assert.match(
    content,
    /\.client-cell:hover img\{filter:none;transform:scale\(1\.05\)\}/,
  );
  assert.match(
    content,
    /\.client-cell\.is-inverted:hover\{background:var\(--black\)\}/,
  );
  assert.match(content, /@media \(hover:none\)/);
  assert.match(
    content,
    /\.client-cell img,.client-cell img\.inv\{filter:none\}/,
  );
  assert.doesNotMatch(content, /@keyframes mq/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/homepage-client-logo-grid.test.mjs
```

Expected: the structural test passes and the new style test fails because the marquee CSS and old image caps still exist.

- [ ] **Step 3: Replace marquee CSS with the desktop grid and interaction states**

Replace the complete `S8 BRANDS` style block in `src/components/landing/content.ts` with:

```css
/* ============ S8 BRANDS ============ */
#brands{background:var(--white);display:flex;flex-direction:column;justify-content:flex-start;padding:clamp(104px,14vh,150px) 0 clamp(72px,9vh,112px);overflow:visible}
#brands .shead{position:static;padding:0 var(--pad);margin-bottom:clamp(36px,5vw,64px)}
.client-grid{list-style:none;margin:0;padding:0 var(--pad);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line)}
.client-cell{min-width:0;min-height:clamp(160px,14vw,220px);padding:clamp(24px,3vw,44px);display:flex;align-items:center;justify-content:center;background:var(--white);border-right:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;transition:background-color .28s ease}
.client-cell img{display:block;width:min(74%,220px);height:auto;max-height:88px;object-fit:contain;scale:var(--s,1);filter:grayscale(1) saturate(0) contrast(1.18);transform:scale(1);transition:filter .28s ease,transform .28s cubic-bezier(.2,.8,.2,1)}
.client-cell img.inv{filter:invert(1) grayscale(1) saturate(0) contrast(1.18)}
@media (hover:hover) and (pointer:fine){
  .client-cell:hover img{filter:none;transform:scale(1.05)}
  .client-cell.is-inverted:hover{background:var(--black)}
}
@media (hover:none){
  .client-cell img,.client-cell img.inv{filter:none}
  .client-cell.is-inverted{background:var(--black)}
}
```

- [ ] **Step 4: Add tablet and mobile sizing**

Inside the existing `@media (max-width:1024px)` block add:

```css
.client-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.client-cell{min-height:clamp(148px,19vw,190px)}
```

Inside the existing `@media (max-width:640px)` block, remove the old `.mk` rules and add:

```css
#brands{padding-top:96px;padding-bottom:72px}
#brands .shead{margin-bottom:28px}
.client-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.client-cell{min-height:clamp(124px,40vw,164px);padding:20px 14px}
.client-cell img{width:min(82%,170px);max-height:68px}
```

Inside the existing `@media (prefers-reduced-motion:reduce)` block add:

```css
.client-cell,.client-cell img{transition:none!important}
.client-cell:hover img{transform:none!important}
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```powershell
node --test tests/homepage-client-logo-grid.test.mjs
```

Expected: two passing tests, zero failures.

- [ ] **Step 6: Run the full automated checks**

Run:

```powershell
node --test
npx tsc --noEmit --incremental false
git diff --check
```

Expected: all Node tests pass, TypeScript exits `0`, and `git diff --check` reports no whitespace errors.

- [ ] **Step 7: Commit the responsive visual treatment**

```powershell
git add -- tests/homepage-client-logo-grid.test.mjs src/components/landing/content.ts
git commit -m "feat: showcase clients in a responsive logo grid"
```

---

### Task 3: Verify the rendered experience and publish `main`

**Files:**
- Verify only: `src/components/landing/content.ts`
- Verify only: `src/components/landing/init.ts`
- Verify only: `tests/homepage-client-logo-grid.test.mjs`

**Interfaces:**
- Consumes: the complete static client grid from Tasks 1 and 2.
- Produces: verified desktop/mobile behavior and an updated `origin/main`.

- [ ] **Step 1: Build the production application**

Run:

```powershell
npm run build
```

Expected: Next.js production build exits `0` without TypeScript or route-generation errors.

- [ ] **Step 2: Inspect the desktop layout**

Run the local application and inspect `/` at approximately `1440 × 900` using the in-app browser.

Verify all of the following:

- 12 logos appear once in a four-column, three-row grid.
- Logo cells are large, evenly ruled, and free of clipping.
- Wide and square logos have comparable optical weight.
- Every non-Zythum logo is monochrome at rest and restores its source colors on hover.
- Zythum is dark on white at rest and white on an ink cell when hovered.
- The heading remains clearly separated from the wall.

- [ ] **Step 3: Inspect tablet and mobile layouts**

Inspect `/` at approximately `768 × 1024` and `390 × 844`.

Verify all of the following:

- Tablet uses three columns and mobile uses two columns.
- All 12 brands remain legible with no horizontal overflow.
- The section grows vertically and scrolls naturally instead of shrinking or clipping logos.
- Original logo colors are visible by default under the no-hover mobile emulation.

- [ ] **Step 4: Run fresh pre-push verification**

Run:

```powershell
node --test
npx tsc --noEmit --incremental false
git diff --check
git status -sb
```

Expected: all tests pass, TypeScript exits `0`, no whitespace errors appear, and `main` contains only the intended committed work.

- [ ] **Step 5: Push `main` directly**

```powershell
git push origin main
```

Expected: `origin/main` advances to the final implementation commit.

- [ ] **Step 6: Confirm local and remote commits match**

```powershell
git status -sb
git rev-parse HEAD
git rev-parse origin/main
```

Expected: the branch is clean, `main...origin/main` has no ahead/behind marker, and both commit hashes are identical.
