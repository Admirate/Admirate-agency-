# ADMIRATE Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-07-28-pricing-page-design.md`

**Goal:** Publish `https://admirate.in/pricing` showing the three product families with real, administrator-editable prices in the visitor's own currency, resolved at the edge and correct on first paint.

**Architecture:** Four Supabase tables hold currencies, plans, amounts, and feature rows. A pure `src/lib/pricing.ts` owns every calculation — billing-cycle derivation, currency conversion, tax, and formatting — so the arithmetic is testable under Node with no framework or network. A public API route mirrors `/api/portfolio`. The page follows the site's `RawPage` convention: server component for metadata and structured data, client wrapper, `content.ts` for stylesheet and markup, `init.ts` for behaviour with a cleanup function.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase, Netlify scheduled functions, Node's built-in test runner.

---

## Deviations from the spec

Three, all recorded here so the spec and the code do not silently disagree.

### 1. Tax presentation is in scope

The spec's Out of Scope reads "VAT, GST, or other tax presentation. Prices are shown exclusive of tax, and the page states this." That is reversed on instruction.

**Decision:** the headline figure remains **exclusive** of tax, with the rate and the tax-inclusive total stated directly beneath it. Growth retainer in India reads `₹1,50,000/month`, then `+18% GST · ₹1,77,000 incl.`

Rationale: the buyers are GST- and VAT-registered businesses who reclaim input credit, so the ex-tax figure is what they budget against and what appears on the quote. Stating the inclusive figure immediately beneath removes the gap between the published price and the invoice without demoting the number that matters commercially.

No toggle. The page already carries a currency control and a billing-cycle control; a third switch acting on the same figure is clutter for a value that never changes within a session. The multi-currency payload embedded in the page carries the tax rate, so a toggle remains a small addition if the position changes.

Tax is **data, not a constant**: `tax_rate` and `tax_label` live on `pricing_currencies` and are editable from the dashboard. AED is seeded 5% / `VAT`, INR 18% / `GST`. USD, GBP, and EUR are seeded null — the page makes no claim about foreign tax treatment it cannot stand behind, and simply omits the line.

### 2. Quarterly cycle figures require a rounding rule

The spec asserts every cycle figure is `monthly × months × (1 − discount)` and that this "was verified against all twenty-four published AED figures."

It does not hold for the quarterly cycle. `4250 × 3 × 0.95 = 12,112.50`; every one of the nine quarterly figures lands on a half unit. The six-month and annual figures are all clean integers (`4250 × 6 × 0.90 = 22,950`; `4250 × 12 × 0.85 = 43,350`), so the discrepancy is confined to the 5% cycle.

**Decision:** `cycleAmount()` rounds **up** to the whole currency unit — 12,113 — consistent with the spec's own stated principle that a derived figure must never undercut a published price. The same rule applies to tax amounts.

**Open:** whether the printed rate card publishes 12,113, 12,112, or 12,110 for quarterly Launch. The tests below assert the formula and its rounding, not the card, because the card's cycle figures are not reproduced in the spec. This needs one check against the source document; if the card rounds differently, `ROUND_CYCLE_TO` is the single place to change.

### 3. INR provenance confirmed

The spec's Required Follow-Up section is retained and its status upgraded from open question to confirmed decision: the INR figures are AED converted at ₹24.00 per dirham and rounded to ₹500, on instruction, and are not the output of an Indian market pricing exercise. They remain administrator-editable.

---

## Global Constraints

- No client-side geolocation, no third-party rate call at request time, no new Content-Security-Policy entry.
- Prices must be present in the delivered HTML. No price may arrive via a client-side fetch.
- Every calculation lives in `src/lib/pricing.ts` and is reachable from a Node test without importing Next.
- Writes are admin-only behind `requireAdmin()`. `GET /api/pricing` is public, matching `/api/portfolio`.
- Derived currency amounts round up. Never down.
- The migration is written to `supabase/migrations/` but **not applied** — the project's one existing migration was applied by hand, and applying to production is the operator's call.
- Do not change existing service page copy, the start-project form's fields, or any other page's pricing claims.

## File Structure

**Create**
- `supabase/migrations/0002_pricing.sql` — four tables, RLS, seed data
- `src/lib/pricing.ts` — pure calculation module
- `src/app/api/pricing/route.ts` — public GET, admin writes
- `src/app/api/cron/fx/route.ts` — `CRON_SECRET`-guarded rate refresh
- `netlify/functions/scheduled-fx.ts` — daily trigger
- `src/components/pricing/content.ts` — `PRICING_CSS`, `pricingHtml(data)`
- `src/components/pricing/init.ts` — imperative behaviour + cleanup
- `src/components/pricing/PricingClient.tsx` — `RawPage` wrapper
- `src/app/pricing/page.tsx` — server component, metadata, JSON-LD
- `src/app/dashboard/pricing/page.tsx` — administrator screen
- `tests/pricing-calc.test.mjs` — cycle, conversion, tax, format, resolve

**Modify**
- `src/types/database.ts` — four table definitions
- `src/components/shared/nav.ts` — fourth link + breakpoint retune
- `src/components/sitemap/catalog.mjs` — `/pricing` in Main Pages
- `src/components/llms/catalog.mjs` — `/pricing` in Primary pages
- `src/app/sitemap.xml/route.ts` — `/pricing` entry
- `src/app/dashboard/layout.tsx` — Pricing nav item
- `tests/sitemap-catalog.test.mjs`, `tests/llms-catalog.test.mjs`, `tests/sitemap-http.test.mjs` — expected paths

---

### Task 1: Data layer

**Files:** Create `supabase/migrations/0002_pricing.sql`; modify `src/types/database.ts`

**Interfaces:** `pricing_currencies`, `pricing_plans`, `pricing_amounts`, `pricing_features` exactly as the spec's Data Model section defines them, plus `tax_rate numeric` and `tax_label text` on `pricing_currencies` per Deviation 1.

- [ ] **Step 1: Write the migration**

Four `CREATE TABLE IF NOT EXISTS` statements. Every table gets `ALTER TABLE … ENABLE ROW LEVEL SECURITY` and a `FOR SELECT USING (true)` policy for the `anon` and `authenticated` roles. No write policy: writes go through the service-role client behind `requireAdmin()`, matching `portfolio_projects`.

Seed in the same migration, idempotently (`ON CONFLICT DO NOTHING`):
- five currency rows with the countries, `authored`, `round_to`, `sort_order`, and tax columns from the spec plus Deviation 1
- nine plan rows across the three families
- eighteen amount rows — nine plans × two authored currencies
- forty-eight feature rows — fifteen retainer, twenty-one website, twelve care — transcribed from the spec appendix

- [ ] **Step 2: Add the table types**

Extend the `Database` interface in `src/types/database.ts` with `Row`/`Insert`/`Update` for all four tables, following the shape of `portfolio_projects`.

- [ ] **Step 3: Verify the migration parses**

Read it back and confirm all four tables, the RLS policies, and the seed counts (5 / 9 / 18 / 48) are present.

- [ ] **Step 4: Commit**

```powershell
git add -- supabase/migrations/0002_pricing.sql src/types/database.ts
git commit -m "feat: add pricing schema and seed"
```

### Task 2: Pure pricing module

**Files:** Create `tests/pricing-calc.test.mjs`, `src/lib/pricing.ts`

**Interfaces:**
- `BILLING_CYCLES` — `[{ id, label, months, discount }]` for monthly/quarterly/six-month/annual at 0 / .05 / .10 / .15
- `cycleAmount(monthly, cycle) -> number` — rounds up to the whole unit
- `perMonth(total, months) -> number`
- `cycleSaving(monthly, cycle) -> number`
- `convert(aedAmount, rate, roundTo) -> number` — rounds up to `roundTo`
- `taxOn(amount, rate) -> number`, `withTax(amount, rate) -> number` — round up to the whole unit
- `resolveCurrency(cookie, countryHeader, currencies) -> string`
- `formatPrice(amount, currency) -> string` — `en-IN` grouping for INR, `en-US` otherwise

- [ ] **Step 1: Write the failing tests**

Assert, at minimum:
- `cycleAmount(4250, quarterly) === 12113` and the six-month/annual figures are exact integers (`22950`, `43350`) for all nine monthly bases
- `perMonth` and `cycleSaving` agree with the cycle total
- `convert` rounds up at boundaries — `convert(100, 0.2723, 10)` must not round down
- `taxOn(150000, 0.18) === 27000` and `withTax(150000, 0.18) === 177000`
- `resolveCurrency` precedence: valid cookie wins; unknown cookie ignored; inactive-currency cookie ignored; country header mapped; unmapped country and absent header both fall to `USD`
- `formatPrice(1530000, INR)` yields `15,30,000` grouping

- [ ] **Step 2: Run and verify RED**

```powershell
node --test tests/pricing-calc.test.mjs
```

- [ ] **Step 3: Implement `src/lib/pricing.ts`**

No database or network import. Discount schedule as a module constant per the spec.

- [ ] **Step 4: Run and verify GREEN**

- [ ] **Step 5: Commit**

```powershell
git add -- src/lib/pricing.ts tests/pricing-calc.test.mjs
git commit -m "feat: add pricing calculation module"
```

### Task 3: API surface

**Files:** Create `src/app/api/pricing/route.ts`, `src/app/api/cron/fx/route.ts`, `netlify/functions/scheduled-fx.ts`

- [ ] **Step 1: Pricing route**

`GET` public, returning `{ currencies, plans, amounts, features }` in one payload. `POST`/`PATCH`/`DELETE` open with `const denied = await requireAdmin(); if (denied) return denied;` and dispatch on a `table` field so one route serves plans, amounts, and features. Writes call `revalidateTag("pricing")`.

- [ ] **Step 2: FX route**

Bearer-token guard against `CRON_SECRET`, matching `/api/cron/send-email`. Fetch `https://api.frankfurter.dev/v1/latest?base=AED`, write `rate` and `rate_updated_at` for every `authored = false` currency. On provider failure: log, return 200 with a message, write nothing — a stale rate beats a missing price.

- [ ] **Step 3: Netlify scheduled function**

Shaped exactly like `netlify/functions/scheduled-email.ts`. Daily schedule.

- [ ] **Step 4: Commit**

```powershell
git add -- src/app/api/pricing/route.ts src/app/api/cron/fx/route.ts netlify/functions/scheduled-fx.ts
git commit -m "feat: add pricing api and fx refresh"
```

### Task 4: Public page

**Files:** Create `src/components/pricing/content.ts`, `init.ts`, `PricingClient.tsx`, `src/app/pricing/page.tsx`

- [ ] **Step 1: `content.ts`**

`PRICING_CSS` reusing the site's primitives — `:root` tokens, left scroll rail, `data-bg` section transitions, `.up` reveals, red-wipe rows, Archivo/Inter/IBM Plex Mono. `pricingHtml(data)` — a function, not a constant, because the markup depends on fetched data; this is the one deliberate deviation from the page convention and is noted in the file header.

Six sections per the spec: hero with currency control, three family sections, FAQ, close with NAP and legal footer.

Price block renders per Deviation 1: per-month equivalent as the headline, then cycle total and saving, then the tax line.

- [ ] **Step 2: `init.ts`**

Reads the embedded payload from `<script type="application/json">` rather than re-fetching. Wires currency control (writes `admirate_ccy`, one-year expiry), billing-cycle control, comparison-table expansion, mobile tier chips, scroll rail. Returns a cleanup removing every listener.

- [ ] **Step 3: `PricingClient.tsx`**

Wraps `RawPage` with `PRICING_CSS + NAV_CSS` and `navHtml("pricing", "/start-project") + pricingHtml(data)`, matching `DigitalClient.tsx`.

- [ ] **Step 4: `page.tsx`**

Reads `x-nf-country` and the `admirate_ccy` cookie, fetches the payload through a `unstable_cache`/`revalidateTag("pricing")`-tagged wrapper, resolves currency, renders. `pageMeta()` for metadata; `Service` + `Offer` JSON-LD through `ld()`, always emitting INR offers so the machine-readable price does not vary with the crawler's location.

Graceful degradation: with JavaScript disabled the server-rendered currency and monthly cycle are in the HTML; only the switches are inert.

- [ ] **Step 5: Commit**

```powershell
git add -- src/components/pricing src/app/pricing
git commit -m "feat: add geo aware pricing page"
```

### Task 5: Administrator screen

**Files:** Create `src/app/dashboard/pricing/page.tsx`; modify `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Build the screen**

Tailwind, matching `dashboard/portfolio/page.tsx`. Plans grouped by family with editable amounts per authored currency; feature-row editing; a read-only panel showing each derived currency's rate and `rate_updated_at`; editable `tax_rate`/`tax_label` per currency. Flags any plan missing an authored amount.

- [ ] **Step 2: Add the nav item**

`{ href: "/dashboard/pricing", label: "Pricing" }` in the layout's item list, with an icon matching the existing entries.

- [ ] **Step 3: Commit**

```powershell
git add -- src/app/dashboard/pricing src/app/dashboard/layout.tsx
git commit -m "feat: add pricing dashboard screen"
```

### Task 6: Navigation and catalogues

**Files:** Modify `src/components/shared/nav.ts`, `src/components/sitemap/catalog.mjs`, `src/components/llms/catalog.mjs`, `src/app/sitemap.xml/route.ts`, and the three test files

- [ ] **Step 1: Update the catalogue tests first**

Add `/pricing` to the expected path arrays in `tests/sitemap-catalog.test.mjs`, `tests/llms-catalog.test.mjs`, and `tests/sitemap-http.test.mjs`. Run and verify RED.

- [ ] **Step 2: Add `/pricing` to both catalogues and the XML sitemap**

Main Pages / Primary pages, positioned after Services.

- [ ] **Step 3: Fourth nav link**

Add Pricing between Services and Blogs; extend `NavPage` with `"pricing"`. Retune the 860px, 640px, 380px, and 340px media queries so four links and the CTA still fit. The pill is `width:max-content` inside `max-width:calc(100vw - 24px)` — the failure mode is the CTA clipping off the right edge, so verify at 320px.

- [ ] **Step 4: Add the mega-menu footer link**

`/pricing` alongside the existing Overview link in `.smfoot`.

- [ ] **Step 5: Run the catalogue tests and verify GREEN**

### Task 7: Verification

- [ ] **Step 1: Full Node suite**

```powershell
node --test tests/*.test.mjs
```

Expected: every test passes, zero failures.

- [ ] **Step 2: Production build**

```powershell
npm run build
```

Expected: completes, `/pricing` listed as a dynamic route (it reads request headers, which opts it out of static rendering — this is intended and stated in the spec).

- [ ] **Step 3: Manual checks**

Against a running dev server, confirm: renders at 320px, 768px, and 1440px; comparison tables legible on a phone; a simulated `x-nf-country: AE` changes the rendered currency with no client-side flash; the currency cookie survives a reload; keyboard reaches every control with visible focus; `prefers-reduced-motion` suppresses animation; the nav's four links and CTA fit at 320px.

- [ ] **Step 4: Report what is not verifiable here**

The migration is unapplied, so the page cannot be exercised against real data until an operator runs `0002_pricing.sql`. State this plainly rather than reporting the feature as live.
