# Recipient Industry and Emailer Template Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every recipient an industry, let the emailer pick from pre-made HTML templates, and let a campaign be aimed at chosen industries — with all three surviving Save Draft and Schedule.

**Architecture:** A code-side industry vocabulary (`src/lib/industries.ts`) is the single source of truth for both the recipients list and the composer's audience chips. Templates become a registry of TS modules behind a common `render(subject, body) => string` interface, with the Outlook/dark-mode boilerplate extracted to a shared shell so a second template is a slice list rather than a copy-paste. Template id and audience are persisted on the `email_drafts` row, so `/api/email/send` and the scheduled `/api/cron/send-email` read the same two fields and behave identically.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind v4, Supabase (`@supabase/supabase-js`), Resend, framer-motion, `node:test` for tests.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-08-04-recipient-industry-and-template-picker-design.md`. Read it before starting.
- **Tests run with:** `node --import ./tests/resolve-alias.mjs --test "tests/<file>.test.mjs"` from `Admirate-agency-/`. Node 24 strips TypeScript natively, so tests `import()` `.ts` modules directly by `file://` URL. There is no `npm test` script — do not add one.
- **The whole suite is `node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"`.** The quoted glob is required: `node --test tests/` and `node --test tests` both fail on this machine with `ERR_UNSUPPORTED_DIR_IMPORT` — that is a runner quirk, not a broken test.
- **`tests/resolve-alias.mjs` is a `--import` hook that teaches the runner the `@/…` alias** from `tsconfig.json`. It is required from Task 4 onward, when modules under test start importing each other. Task 1 Step 1 covers it. Adding it changes nothing for the tests that predate this plan.
- **Known-failing baseline, measured before any of this work:** 88 pass, 6 fail. All 6 are in `tests/sitemap-http.test.mjs`, which boots a real Next dev server that does not start in this environment ("Next.js exited before becoming ready"). They are unrelated to this plan. Do not try to fix them, and do not count them as a regression — but do re-check that the count is still exactly 6 before claiming a suite is green.
- **Test style:** Every test file follows the existing pattern in `tests/recipient-list.test.mjs` — resolve the module path with `pathToFileURL`, `await import()` it inside a `try {} catch {}` so the RED run reaches an explicit `assert.equal(typeof fn, "function")` rather than crashing on a missing module.
- **Working directory for every command:** `c:\Admirate work\admirate\Admirate-agency-`.
- **Empty means today's behaviour.** `industry` NULL = Unassigned and still sendable. `template_id` NULL = default template. `industries` `'{}'` = everyone active. No backfill, no data migration.
- **The industry column stores the id** (`real-estate-brokerage`), never the label. Labels are display-only.
- **The client is never the authority.** Every API route re-validates industry ids through `toIndustryId` regardless of what the browser sent, exactly as `bulk/route.ts` already re-validates emails.
- **Tailwind tokens only:** `bg-warm`, `text-ink`, `text-muted`, `border-line`, `bg-brand`, `text-brand`. No raw hex — the one existing exception is `accent-[#E3001B]` on checkboxes in `RecipientsTable.tsx`; match it if you add a checkbox, introduce no others.
- **Do not modify** `src/lib/brief.ts`, the `/start-project` wizard, or `contact_submissions`. Its `INDUSTRIES` export is a separate, deliberately unshared vocabulary.
- **Commit after every task**, with the message given in the task's final step.

---

### Task 1: Industry vocabulary

The shared list, its display labels, and the fuzzy matcher that maps arbitrary spreadsheet text onto an id. Everything downstream depends on this, so it lands first and alone.

**Files:**
- Create: `tests/resolve-alias.mjs`
- Create: `src/lib/industries.ts`
- Test: `tests/industries.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Industry = { id: string; label: string }`
  - `INDUSTRIES: readonly Industry[]` — 10 entries, order is display order
  - `industryLabel(id: string | null | undefined): string` — the label, or `"Unassigned"`
  - `toIndustryId(value: unknown): string | null` — fuzzy match; returns a canonical id or `null`

- [ ] **Step 1: Add the alias resolver hook**

This file already exists on disk — it was written and verified during planning. Confirm its contents match the following, then move on; it is committed with this task.

Create `tests/resolve-alias.mjs`:

```js
/**
 * Teaches `node --test` the "@/…" path alias that tsconfig.json declares and
 * Next understands, so a module under test can import another src module.
 *
 * Without it, anything the tests cover may only import from packages and
 * relative paths — a constraint on production code imposed by the test runner,
 * which is exactly backwards.
 *
 * Used as: node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = resolve(root, "src", specifier.slice(2));
      // The alias is written without an extension, as bundler resolution
      // allows; Node requires one, so the candidates are tried in the order
      // TypeScript would.
      for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
        if (existsSync(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
});
```

Verify it changes nothing for the existing suite:

Run: `node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"`
Expected: 88 pass, 6 fail — the 6 being `sitemap-http.test.mjs`, per the baseline in Global Constraints.

- [ ] **Step 2: Write the failing test**

Create `tests/industries.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/industries.ts")).href;

let INDUSTRIES;
let industryLabel;
let toIndustryId;

try {
  ({ INDUSTRIES, industryLabel, toIndustryId } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

test("the module exports what the app imports", () => {
  assert.ok(Array.isArray(INDUSTRIES), "INDUSTRIES should be an array");
  assert.equal(typeof industryLabel, "function");
  assert.equal(typeof toIndustryId, "function");
});

test("every entry has a unique id and a label", () => {
  const ids = INDUSTRIES.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length, "ids must be unique");
  for (const entry of INDUSTRIES) {
    assert.match(entry.id, /^[a-z0-9-]+$/, `${entry.id} should be kebab-case`);
    assert.ok(entry.label.length > 0);
  }
});

test("the list covers the segments the campaign targets", () => {
  const ids = INDUSTRIES.map((i) => i.id);
  for (const required of [
    "real-estate-brokerage",
    "real-estate-developer",
    "interior-fitout",
    "construction",
    "hospitality",
    "retail-fnb",
    "healthcare-wellness",
    "professional-services",
    "technology",
    "other",
  ]) {
    assert.ok(ids.includes(required), `missing ${required}`);
  }
});

test("industryLabel resolves an id, and names the empty case", () => {
  assert.equal(industryLabel("real-estate-brokerage"), "Real Estate — Brokerage");
  assert.equal(industryLabel(null), "Unassigned");
  assert.equal(industryLabel(undefined), "Unassigned");
  assert.equal(industryLabel(""), "Unassigned");
  assert.equal(industryLabel("no-such-industry"), "Unassigned");
});

test("toIndustryId is idempotent on ids it already produced", () => {
  for (const entry of INDUSTRIES) {
    assert.equal(toIndustryId(entry.id), entry.id);
  }
});

test("toIndustryId accepts the label as written", () => {
  for (const entry of INDUSTRIES) {
    assert.equal(toIndustryId(entry.label), entry.id);
  }
});

test("toIndustryId ignores case, spacing and punctuation", () => {
  assert.equal(toIndustryId("  REAL ESTATE - BROKERAGE "), "real-estate-brokerage");
  assert.equal(toIndustryId("Retail & F&B"), "retail-fnb");
  assert.equal(toIndustryId("interior design & fit-out"), "interior-fitout");
});

test("toIndustryId maps the words a spreadsheet actually uses", () => {
  assert.equal(toIndustryId("Realtor"), "real-estate-brokerage");
  assert.equal(toIndustryId("brokerage"), "real-estate-brokerage");
  assert.equal(toIndustryId("Property"), "real-estate-brokerage");
  assert.equal(toIndustryId("Developer"), "real-estate-developer");
  assert.equal(toIndustryId("Property Development"), "real-estate-developer");
  assert.equal(toIndustryId("Fit Out"), "interior-fitout");
  assert.equal(toIndustryId("Interiors"), "interior-fitout");
  assert.equal(toIndustryId("Contracting"), "construction");
  assert.equal(toIndustryId("Hotel"), "hospitality");
  assert.equal(toIndustryId("Restaurant"), "retail-fnb");
  assert.equal(toIndustryId("Clinic"), "healthcare-wellness");
  assert.equal(toIndustryId("Law Firm"), "professional-services");
  assert.equal(toIndustryId("SaaS"), "technology");
});

test("plain 'Real Estate' resolves to brokerage, the larger segment", () => {
  assert.equal(toIndustryId("Real Estate"), "real-estate-brokerage");
});

test("toIndustryId returns null rather than guessing", () => {
  assert.equal(toIndustryId(""), null);
  assert.equal(toIndustryId("   "), null);
  assert.equal(toIndustryId(null), null);
  assert.equal(toIndustryId(undefined), null);
  assert.equal(toIndustryId(42), null);
  assert.equal(toIndustryId({}), null);
  assert.equal(toIndustryId("Aardvark Wrangling"), null);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/industries.test.mjs"`
Expected: FAIL — "INDUSTRIES should be an array".

- [ ] **Step 4: Write the implementation**

Create `src/lib/industries.ts`:

```ts
/**
 * The industries a recipient can belong to, and the campaign can be aimed at.
 *
 * A code constant rather than a table: the set changes when we decide to sell
 * to someone new, which is a deploy, not a Tuesday. Nothing enforces it in
 * Postgres either — the API coerces anything it does not recognise to null, so
 * retiring an id degrades those rows to Unassigned instead of failing a query
 * or blocking a migration.
 *
 * NOT THE SAME LIST AS `brief.ts`. That one is a customer describing themselves
 * on the public /start-project wizard, where "Real Estate" is the right
 * granularity. This one is us segmenting an outbound campaign, where the
 * brokerage/developer split is the entire point. Sharing one constant would
 * mean either coarsening the targeting or showing internal segmentation
 * vocabulary to prospects.
 */

export type Industry = { id: string; label: string };

export const INDUSTRIES: readonly Industry[] = [
  { id: "real-estate-brokerage", label: "Real Estate — Brokerage" },
  { id: "real-estate-developer", label: "Real Estate — Developer" },
  { id: "interior-fitout", label: "Interior Design & Fit-out" },
  { id: "construction", label: "Construction" },
  { id: "hospitality", label: "Hospitality" },
  { id: "retail-fnb", label: "Retail & F&B" },
  { id: "healthcare-wellness", label: "Healthcare & Wellness" },
  { id: "professional-services", label: "Professional Services" },
  { id: "technology", label: "Technology" },
  { id: "other", label: "Other" },
] as const;

/** What a row with no industry reads as, everywhere it is shown. */
const UNASSIGNED = "Unassigned";

export const industryLabel = (id: string | null | undefined): string =>
  INDUSTRIES.find((i) => i.id === id)?.label ?? UNASSIGNED;

/**
 * Strips everything that a person might type differently on a different day:
 * case, spacing, hyphens, ampersands, the em dash in a label. "Real Estate —
 * Brokerage", "real estate - brokerage" and the id itself all collapse to
 * "realestatebrokerage", so a label, an id and a hand-typed cell all match by
 * the same rule and no separate label table is needed.
 */
const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * The words a spreadsheet actually carries, mapped to the id they mean.
 *
 * Keys are already normalised. This exists because a CRM export says "Realtor"
 * or "Contracting", not "Real Estate — Brokerage", and an import that returned
 * null for all of those would make the industry column look broken on the first
 * upload. Bare "real estate" resolves to brokerage rather than staying
 * ambiguous: brokerages are the larger half of the list, and a wrong-but-
 * plausible segment is visible and one click to fix, where Unassigned is
 * invisible and stays that way.
 */
const ALIASES: Record<string, string> = {
  realestate: "real-estate-brokerage",
  realtor: "real-estate-brokerage",
  realty: "real-estate-brokerage",
  broker: "real-estate-brokerage",
  brokers: "real-estate-brokerage",
  brokerage: "real-estate-brokerage",
  property: "real-estate-brokerage",
  properties: "real-estate-brokerage",
  realestateagency: "real-estate-brokerage",
  realestateagent: "real-estate-brokerage",

  developer: "real-estate-developer",
  developers: "real-estate-developer",
  development: "real-estate-developer",
  propertydeveloper: "real-estate-developer",
  propertydevelopment: "real-estate-developer",
  realestatedevelopment: "real-estate-developer",

  interior: "interior-fitout",
  interiors: "interior-fitout",
  interiordesign: "interior-fitout",
  fitout: "interior-fitout",
  fitouts: "interior-fitout",
  joinery: "interior-fitout",
  furniture: "interior-fitout",

  contracting: "construction",
  contractor: "construction",
  contractors: "construction",
  building: "construction",
  engineering: "construction",

  hotel: "construction" /* placeholder-guard: replaced below */,

  restaurant: "retail-fnb",
  restaurants: "retail-fnb",
  cafe: "retail-fnb",
  fnb: "retail-fnb",
  foodandbeverage: "retail-fnb",
  food: "retail-fnb",
  retail: "retail-fnb",
  ecommerce: "retail-fnb",

  health: "healthcare-wellness",
  healthcare: "healthcare-wellness",
  clinic: "healthcare-wellness",
  clinics: "healthcare-wellness",
  medical: "healthcare-wellness",
  dental: "healthcare-wellness",
  wellness: "healthcare-wellness",
  fitness: "healthcare-wellness",

  legal: "professional-services",
  law: "professional-services",
  lawfirm: "professional-services",
  consulting: "professional-services",
  consultancy: "professional-services",
  finance: "professional-services",
  accounting: "professional-services",
  insurance: "professional-services",
  recruitment: "professional-services",

  tech: "technology",
  software: "technology",
  saas: "technology",
  it: "technology",
  ai: "technology",
  fintech: "technology",

  misc: "other",
  general: "other",
  various: "other",
};

// Hospitality, kept out of the literal above so the travel words sit together.
for (const word of ["hotel", "hotels", "hospitality", "travel", "tourism", "resort", "resorts"]) {
  ALIASES[word] = "hospitality";
}

/** id and label lookups, precomputed once rather than scanned per cell. */
const CANONICAL: Record<string, string> = {};
for (const entry of INDUSTRIES) {
  CANONICAL[norm(entry.id)] = entry.id;
  CANONICAL[norm(entry.label)] = entry.id;
}

/**
 * Turns arbitrary text into an id, or null.
 *
 * Idempotent on its own output, which is what lets the API run it over values
 * the client already resolved without a second, stricter code path.
 */
export function toIndustryId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const key = norm(value);
  if (key === "") return null;
  return CANONICAL[key] ?? ALIASES[key] ?? null;
}
```

Note the `hotel` entry inside the object literal is immediately overwritten by the loop beneath it — delete that line rather than leaving it; it is called out here only so a reader of the diff is not surprised that `hotel` appears twice.

- [ ] **Step 5: Run test to verify it passes**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/industries.test.mjs"`
Expected: PASS, 10 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/industries.ts tests/industries.test.mjs tests/resolve-alias.mjs
git commit -m "Add the industry vocabulary shared by recipients and campaigns"
```

---

### Task 2: Migration and database types

Three additive columns and the TypeScript that describes them. No behaviour changes; this is what the next five tasks compile against.

**Files:**
- Create: `supabase/migrations/0007_recipient_industry_and_campaign_template.sql`
- Modify: `src/types/database.ts:64-110` (the `email_recipients` and `email_drafts` blocks)

**Interfaces:**
- Consumes: nothing.
- Produces: `Database["public"]["Tables"]["email_recipients"]` gains `industry: string | null`; `email_drafts` gains `template_id: string | null` and `industries: string[]`.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0007_recipient_industry_and_campaign_template.sql`:

```sql
-- Industry on a recipient, and the template plus audience on a campaign.
--
-- All three are additive and nullable-or-defaulted, in the same shape as
-- 0006_wizard_fields.sql, so every existing row keeps sending exactly as it
-- does now and no backfill is required. The empty value is today's behaviour
-- in each case: a null industry is still sendable, a null template_id is the
-- default template, and an empty industries array is everyone active.
--
-- No CHECK constraint on industry. The set of industries is a code constant
-- (src/lib/industries.ts) and the API coerces anything it does not recognise
-- to null; a constraint would instead make retiring an industry a migration,
-- and would fail an import mid-flight over one optional field of one row.

ALTER TABLE email_recipients
  ADD COLUMN IF NOT EXISTS industry TEXT;

ALTER TABLE email_drafts
  ADD COLUMN IF NOT EXISTS template_id TEXT,
  ADD COLUMN IF NOT EXISTS industries  TEXT[] NOT NULL DEFAULT '{}';

-- The recipients query filters on active and, when a campaign is aimed,
-- industry. 77 rows do not need this; a list that grows will.
CREATE INDEX IF NOT EXISTS email_recipients_active_industry_idx
  ON email_recipients (active, industry);
```

- [ ] **Step 2: Update the database types**

In `src/types/database.ts`, in the `email_recipients` block, add `industry` to all three shapes:

```ts
      email_recipients: {
        Row: {
          id: string;
          email: string;
          name: string;
          active: boolean;
          /** An id from src/lib/industries.ts. Null means Unassigned. */
          industry: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          active?: boolean;
          industry?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          active?: boolean;
          industry?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
```

And in the `email_drafts` block:

```ts
      email_drafts: {
        Row: {
          id: string;
          subject: string;
          body: string;
          status: "draft" | "sent" | "scheduled";
          /** A template id from src/components/email/templates. Null is the default. */
          template_id: string | null;
          /** Industry ids to send to. Empty means everyone active. */
          industries: string[];
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          body: string;
          status?: "draft" | "sent" | "scheduled";
          template_id?: string | null;
          industries?: string[];
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          body?: string;
          status?: "draft" | "sent" | "scheduled";
          template_id?: string | null;
          industries?: string[];
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
```

- [ ] **Step 3: Verify the project still type-checks**

Run: `npx tsc --noEmit`
Expected: PASS with no errors. Nothing reads the new fields yet, so adding them cannot break a caller.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0007_recipient_industry_and_campaign_template.sql src/types/database.ts
git commit -m "Add industry, template_id and industries columns"
```

- [ ] **Step 5: Flag the manual step**

The migration is not applied by this plan — the Supabase MCP server is unauthorised in this environment and the base tables predate `supabase/migrations/`. Tell the user, in the task report, that `0007_recipient_industry_and_campaign_template.sql` must be run against the project before the feature works end to end, and that everything up to Task 9 can be built and tested without it.

---

### Task 3: Filter recipients by industry

**Files:**
- Modify: `src/lib/recipient-list.ts:11-31` (the `Filterable` type and `filterRecipients`)
- Test: `tests/recipient-list.test.mjs` (append)

**Interfaces:**
- Consumes: nothing from Task 1 — this module stays free of the vocabulary so it keeps testing as pure array logic.
- Produces: `filterRecipients(rows, { query?, status?, industry? })`. `industry` is `undefined`, `""` or `"all"` for no filter, `"unassigned"` for rows with no industry, otherwise an exact id match.

- [ ] **Step 1: Write the failing test**

Append to `tests/recipient-list.test.mjs`:

```js
const INDUSTRY_ROWS = [
  { id: "a", name: "Emaar", email: "a@emaar.com", active: true, industry: "real-estate-developer" },
  { id: "b", name: "Betterhomes", email: "b@bh.ae", active: true, industry: "real-estate-brokerage" },
  { id: "c", name: "Nobody", email: "c@nobody.ae", active: true, industry: null },
  { id: "d", name: "Paused Co", email: "d@paused.ae", active: false, industry: "technology" },
];

test("filterRecipients ignores industry when it is not asked for", () => {
  assert.equal(filterRecipients(INDUSTRY_ROWS, {}).length, 4);
  assert.equal(filterRecipients(INDUSTRY_ROWS, { industry: "all" }).length, 4);
  assert.equal(filterRecipients(INDUSTRY_ROWS, { industry: "" }).length, 4);
});

test("filterRecipients matches an industry id exactly", () => {
  const rows = filterRecipients(INDUSTRY_ROWS, { industry: "real-estate-brokerage" });
  assert.deepEqual(rows.map((r) => r.id), ["b"]);
});

test("filterRecipients selects the unassigned rows", () => {
  const rows = filterRecipients(INDUSTRY_ROWS, { industry: "unassigned" });
  assert.deepEqual(rows.map((r) => r.id), ["c"]);
});

test("industry combines with status and query rather than replacing them", () => {
  assert.equal(
    filterRecipients(INDUSTRY_ROWS, { industry: "technology", status: "active" }).length,
    0
  );
  assert.deepEqual(
    filterRecipients(INDUSTRY_ROWS, { industry: "technology", status: "paused" }).map((r) => r.id),
    ["d"]
  );
  assert.deepEqual(
    filterRecipients(INDUSTRY_ROWS, { industry: "real-estate-developer", query: "emaar" }).map((r) => r.id),
    ["a"]
  );
});

test("rows with no industry field at all are treated as unassigned", () => {
  const legacy = [{ id: "x", name: "Old", email: "x@old.ae", active: true }];
  assert.equal(filterRecipients(legacy, { industry: "unassigned" }).length, 1);
  assert.equal(filterRecipients(legacy, { industry: "technology" }).length, 0);
  assert.equal(filterRecipients(legacy, {}).length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/recipient-list.test.mjs"`
Expected: FAIL — the industry tests return 4 rows where 1 is expected, because the option is ignored.

- [ ] **Step 3: Write the implementation**

In `src/lib/recipient-list.ts`, replace the `Filterable` type and `filterRecipients`:

```ts
type Filterable = {
  name: string;
  email: string;
  active: boolean;
  industry?: string | null;
};

/** The two filter values that are not an industry id. */
export const INDUSTRY_ANY = "all";
export const INDUSTRY_NONE = "unassigned";

/**
 * Name and email are searched together against one query, rather than offering
 * a field selector. Someone looking for a recipient knows one of the two and
 * should not have to say which.
 *
 * Industry is deliberately *not* part of that query and has its own control.
 * Folding it in would make the "Showing 14 of 77" counter ambiguous about which
 * control produced the 14.
 */
export function filterRecipients<T extends Filterable>(
  rows: T[],
  opts: { query?: string; status?: RecipientStatus; industry?: string } = {}
): T[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  const status = opts.status ?? "all";
  const industry = opts.industry ?? INDUSTRY_ANY;

  return rows.filter((r) => {
    if (status === "active" && !r.active) return false;
    if (status === "paused" && r.active) return false;

    if (industry !== INDUSTRY_ANY && industry !== "") {
      // A row predating the column has no key at all, which reads the same as
      // an explicit null: nobody has said what they do.
      const has = r.industry ?? null;
      if (industry === INDUSTRY_NONE) {
        if (has !== null) return false;
      } else if (has !== industry) return false;
    }

    if (q === "") return true;
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/recipient-list.test.mjs"`
Expected: PASS — the original 16 tests plus 5 new ones.

- [ ] **Step 5: Commit**

```bash
git add src/lib/recipient-list.ts tests/recipient-list.test.mjs
git commit -m "Filter the recipients list by industry"
```

---

### Task 4: Detect an industry column on import

**Files:**
- Modify: `src/lib/recipient-sheet.ts` — `ParsedRecipient`, `SheetParseResult`, `pickColumns`, `parseRecipientRows`
- Test: `tests/recipient-sheet-industry.test.mjs`

**Interfaces:**
- Consumes: `toIndustryId` from `src/lib/industries.ts` (Task 1).
- Produces: `ParsedRecipient` gains `industry: string | null`. `SheetParseResult` gains `withIndustry: number`. `pickColumns` returns `{ nameIdx, emailIdx, industryIdx, headerRows }`.

- [ ] **Step 1: Write the failing test**

Create `tests/recipient-sheet-industry.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/recipient-sheet.ts")).href;

let parseRecipientRows;
let pickColumns;

try {
  ({ parseRecipientRows, pickColumns } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

test("the module still exports what the page imports", () => {
  assert.equal(typeof parseRecipientRows, "function");
  assert.equal(typeof pickColumns, "function");
});

test("an Industry header is found and its values resolved", () => {
  const rows = [
    ["Name", "Email", "Industry"],
    ["Emaar", "a@emaar.com", "Real Estate Developer"],
    ["Betterhomes", "b@bh.ae", "Realtor"],
  ];
  const { industryIdx } = pickColumns(rows);
  assert.equal(industryIdx, 2);

  const out = parseRecipientRows(rows);
  assert.deepEqual(
    out.recipients.map((r) => r.industry),
    ["real-estate-developer", "real-estate-brokerage"]
  );
  assert.equal(out.withIndustry, 2);
});

test("Sector, Vertical and Business Type are read as the industry", () => {
  for (const header of ["Sector", "Vertical", "Business Type", "Category"]) {
    const rows = [
      ["Name", "Email", header],
      ["Emaar", "a@emaar.com", "Hospitality"],
    ];
    assert.equal(pickColumns(rows).industryIdx, 2, `${header} should be the industry column`);
  }
});

test("an industry column whose values mean nothing is not used", () => {
  // "Type" is a plausible header carrying something else entirely. The label
  // alone must not be enough, the same way "Email Status" is not the email.
  const rows = [
    ["Name", "Email", "Type"],
    ["Emaar", "a@emaar.com", "Buy"],
    ["Betterhomes", "b@bh.ae", "Rent"],
  ];
  assert.equal(pickColumns(rows).industryIdx, -1);
  const out = parseRecipientRows(rows);
  assert.deepEqual(out.recipients.map((r) => r.industry), [null, null]);
  assert.equal(out.withIndustry, 0);
});

test("the industry column never steals the name column", () => {
  const rows = [
    ["Company Name", "Email", "Industry"],
    ["Emaar", "a@emaar.com", "Developer"],
  ];
  const { nameIdx, industryIdx } = pickColumns(rows);
  assert.equal(nameIdx, 0);
  assert.equal(industryIdx, 2);
  assert.equal(parseRecipientRows(rows).recipients[0].name, "Emaar");
});

test("an unreadable industry value never drops the row", () => {
  const rows = [
    ["Name", "Email", "Industry"],
    ["Emaar", "a@emaar.com", "Aardvark Wrangling"],
    ["Betterhomes", "b@bh.ae", "Hospitality"],
  ];
  const out = parseRecipientRows(rows);
  assert.equal(out.recipients.length, 2);
  assert.equal(out.recipients[0].industry, null);
  assert.equal(out.recipients[1].industry, "hospitality");
  assert.equal(out.withIndustry, 1);
  assert.equal(out.skipped.length, 0);
});

test("a sheet with no industry column imports everyone as unassigned", () => {
  const rows = [
    ["Name", "Email"],
    ["Emaar", "a@emaar.com"],
  ];
  assert.equal(pickColumns(rows).industryIdx, -1);
  const out = parseRecipientRows(rows);
  assert.equal(out.recipients[0].industry, null);
  assert.equal(out.withIndustry, 0);
});

test("a headerless sheet still imports, with no industry", () => {
  const rows = [
    ["Emaar", "a@emaar.com"],
    ["Betterhomes", "b@bh.ae"],
  ];
  const out = parseRecipientRows(rows);
  assert.equal(out.recipients.length, 2);
  assert.equal(out.withIndustry, 0);
  assert.deepEqual(out.recipients.map((r) => r.industry), [null, null]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/recipient-sheet-industry.test.mjs"`
Expected: FAIL — `industryIdx` is `undefined`, not `2`.

- [ ] **Step 3: Write the implementation**

In `src/lib/recipient-sheet.ts`:

Add the import at the top, beneath the existing header comment:

```ts
import { toIndustryId } from "@/lib/industries";
```

Widen the two exported types:

```ts
export type ParsedRecipient = {
  name: string;
  email: string;
  /** An id from src/lib/industries.ts, or null when the sheet did not say. */
  industry: string | null;
};

export type SheetParseResult = {
  recipients: ParsedRecipient[];
  /** Rows that carried something but could not be used, for reporting back. */
  skipped: { row: number; value: string; reason: string }[];
  /** Repeats inside the uploaded file itself, already collapsed. */
  duplicatesInFile: number;
  /** How many of `recipients` came out with an industry, for the preview. */
  withIndustry: number;
};
```

Add these two helpers next to `nameHeaderScore`:

```ts
/**
 * Ranked like `nameHeaderScore`, and for the same reason: a sheet can offer
 * "Category" and "Industry" at once, and the specific claim should win over the
 * leftmost one. "Business Type" outranks bare "Type" because the bare word is
 * the one that turns up over columns holding "Buy"/"Rent".
 */
const industryHeaderScore = (v: string): number => {
  if (/^(industry|sector|vertical)$/i.test(v)) return 100;
  if (/^(business|company)[-\s]?type$/i.test(v)) return 90;
  if (/^(category|segment|type)$/i.test(v)) return 60;
  if (/industry|sector|vertical/i.test(v)) return 50;
  return 0;
};

/** Whether a column's values actually resolve to industries from `from` down. */
const columnHasIndustries = (rows: unknown[][], col: number, from: number) => {
  for (let r = from; r < rows.length; r++) {
    if (toIndustryId(cell(rows[r]?.[col])) !== null) return true;
  }
  return false;
};
```

Change `pickColumns`'s return type and its header branch. The signature becomes:

```ts
export function pickColumns(rows: unknown[][]): {
  nameIdx: number;
  emailIdx: number;
  industryIdx: number;
  headerRows: number;
} {
```

Inside the header loop, after `headerName` has been chosen and before the `return`, add the industry pick and widen the return:

```ts
    let headerIndustry = -1;
    let bestIndustry = 0;
    cells.forEach((c, i) => {
      if (i === headerEmail || i === headerName || c === "" || !isLabelLike(c)) return;
      const score = industryHeaderScore(c);
      // The label is a claim; the values are the evidence. A column called
      // "Type" holding "Buy" and "Rent" names nothing we can send to, and
      // taking it on the strength of its header would mark every row
      // Unassigned while looking as though it had worked.
      if (score > bestIndustry && columnHasIndustries(rows, i, h + 1)) {
        bestIndustry = score;
        headerIndustry = i;
      }
    });
    return {
      nameIdx: headerName,
      emailIdx: headerEmail,
      industryIdx: headerIndustry,
      headerRows: h + 1,
    };
```

In the headerless fallback at the end of the function, return `industryIdx: -1`:

```ts
  return { nameIdx, emailIdx, industryIdx: -1, headerRows };
```

Without a header there is no way to tell an industry column from a city or a note, and guessing would assign segments nobody chose.

In `parseRecipientRows`, destructure the new index, count the hits, and carry the value onto each recipient:

```ts
  const { nameIdx, emailIdx, industryIdx, headerRows } = pickColumns(grid);
```

The `emailIdx === -1` early return needs the new field:

```ts
  if (emailIdx === -1) {
    return {
      recipients,
      skipped: [
        { row: 0, value: "", reason: "No column of email addresses found" },
      ],
      duplicatesInFile,
      withIndustry: 0,
    };
  }
```

Declare the counter beside `duplicatesInFile`:

```ts
  let withIndustry = 0;
```

And replace the push at the end of the row loop:

```ts
    const rawName = nameIdx === -1 ? "" : cell(row[nameIdx]);
    const industry =
      industryIdx === -1 ? null : toIndustryId(cell(row[industryIdx]));
    if (industry !== null) withIndustry++;

    recipients.push({
      name: rawName || nameFromEmail(email),
      email,
      industry,
    });
```

Finally the successful return:

```ts
  return { recipients, skipped, duplicatesInFile, withIndustry };
```

- [ ] **Step 4: Run both sheet test files to verify**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/recipient-sheet-*.test.mjs"`
Expected: PASS. The pre-existing preamble tests must still pass — if one fails on a changed `pickColumns` return shape, fix the implementation, not the old test.

This is the first test to load a module that uses the `@/` alias. If it dies with `ERR_MODULE_NOT_FOUND` on `@/lib/industries`, the `--import ./tests/resolve-alias.mjs` flag is missing from the command — the hook is not optional from here on.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: one error in `src/app/dashboard/emailer/recipients/page.tsx` if it destructures `SheetParseResult`, and none otherwise. Task 6 fixes the page; if the error appears, note it and continue.

- [ ] **Step 6: Commit**

```bash
git add src/lib/recipient-sheet.ts tests/recipient-sheet-industry.test.mjs
git commit -m "Detect an industry column when importing a spreadsheet"
```

---

### Task 5: Recipients API accepts and validates industry

**Files:**
- Modify: `src/app/api/email/recipients/route.ts` — `POST` (lines 36-74) and `PATCH` (lines 76-126)
- Modify: `src/app/api/email/recipients/bulk/route.ts:57-84` (the re-validation loop)

**Interfaces:**
- Consumes: `toIndustryId` from `src/lib/industries.ts` (Task 1); `ParsedRecipient.industry` from Task 4.
- Produces: `POST /api/email/recipients` accepts `{ email, name, industry? }`. `PATCH` accepts `{ id | ids, active }` **or** `{ id | ids, industry }`. `POST /api/email/recipients/bulk` accepts `recipients: [{ name, email, industry }]`.

- [ ] **Step 1: Add the import to both routes**

In each of `src/app/api/email/recipients/route.ts` and `src/app/api/email/recipients/bulk/route.ts`, add beneath the existing imports:

```ts
import { toIndustryId } from "@/lib/industries";
```

- [ ] **Step 2: Accept industry on POST**

In `route.ts`, replace the body of `POST` between the destructure and the insert:

```ts
    const { email, name, industry } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_recipients")
      // Run through toIndustryId rather than stored as sent: the field is
      // optional, so an unrecognised value becomes Unassigned instead of a
      // 400 that loses an otherwise good address.
      .insert({ email, name, active: true, industry: toIndustryId(industry) })
      .select()
      .single();
```

- [ ] **Step 3: Add the industry branch to PATCH**

In `route.ts`, replace `PATCH` in full:

```ts
/**
 * Updates a recipient's status or their industry, one row or many.
 *
 * The two live in one handler because they share all of their targeting. The
 * shape is a discriminator, not a pair of optional fields: a request naming
 * both would be ambiguous about which the caller meant to change, so exactly
 * one has to be present.
 */
export async function PATCH(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, ids, active, industry } = await request.json();

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id or a list of ids is required" },
        { status: 400 }
      );
    }

    const settingActive = typeof active === "boolean";
    const settingIndustry = industry !== undefined;

    if (settingActive === settingIndustry) {
      return NextResponse.json(
        { error: "Send exactly one of active or industry" },
        { status: 400 }
      );
    }

    const patch = settingActive
      ? { active }
      : // Null is a legitimate value here — it is how a row is set back to
        // Unassigned — so an unrecognised id and a deliberate clear land in
        // the same place, which is the right place.
        { industry: toIndustryId(industry) };

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .update(patch)
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Update recipients error:", error);
      return NextResponse.json(
        { error: "Failed to update recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Updated successfully",
      updated: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Carry industry through the bulk import**

In `bulk/route.ts`, widen the `Incoming` type and the re-validation loop:

```ts
type Incoming = { name?: unknown; email?: unknown; industry?: unknown };
```

```ts
    const byEmail = new Map<
      string,
      { email: string; name: string; industry: string | null }
    >();
    let invalid = 0;

    for (const row of rows) {
      const email =
        typeof row?.email === "string" ? row.email.trim().toLowerCase() : "";
      if (!isEmail(email)) {
        invalid++;
        continue;
      }
      if (byEmail.has(email)) continue;

      const name =
        typeof row?.name === "string" && row.name.trim() !== ""
          ? row.name.trim().slice(0, 200)
          : nameFromEmail(email);

      // Re-resolved rather than trusted. The browser ran the same function over
      // the same cell, but the browser is not the authority on what reaches the
      // column — and toIndustryId is idempotent, so re-running it is free.
      byEmail.set(email, { email, name, industry: toIndustryId(row?.industry) });
    }
```

The insert slice already spreads the candidate, so `industry` rides along with no further change:

```ts
      const slice = fresh
        .slice(i, i + INSERT_CHUNK)
        .map((c) => ({ ...c, active: true }));
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS for both API files. Errors remaining in `recipients/page.tsx` are Task 6's.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/email/recipients/route.ts src/app/api/email/recipients/bulk/route.ts
git commit -m "Accept and re-validate recipient industry in the API"
```

---

### Task 6: Recipients page shows, sets and filters industry

**Files:**
- Modify: `src/components/dashboard/RecipientsTable.tsx` — the `Recipient` type, the header row, the body row
- Modify: `src/app/dashboard/emailer/recipients/page.tsx` — add form, filter bar, import preview, handlers

**Interfaces:**
- Consumes: `INDUSTRIES`, `industryLabel` (Task 1); `filterRecipients` with `industry`, `INDUSTRY_ANY`, `INDUSTRY_NONE` (Task 3); `SheetParseResult.withIndustry` (Task 4); the `PATCH` industry branch (Task 5).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the column to the table**

In `src/components/dashboard/RecipientsTable.tsx`, import the vocabulary and widen the type:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import { INDUSTRIES } from "@/lib/industries";
import { Badge, Button } from "./ui";

export type Recipient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  industry: string | null;
  created_at: string;
};
```

Add `onSetIndustry` to the props:

```tsx
const RecipientsTable = ({
  rows,
  selected,
  onToggleRow,
  onToggleAll,
  allChecked,
  onToggleActive,
  onSetIndustry,
  onDelete,
}: {
  rows: Recipient[];
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  allChecked: boolean;
  onToggleActive: (id: string, active: boolean) => void;
  onSetIndustry: (id: string, industry: string | null) => void;
  onDelete: (id: string) => void;
}) => {
```

Add the header cell between Email and Status:

```tsx
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Industry
            </th>
```

And the body cell in the same position:

```tsx
              {/* A select rather than a label with an edit affordance: 77
                  existing rows have to be assigned, and that has to be 77
                  clicks and no dialogs or it will not happen. The empty option
                  is a real choice — it is how a row goes back to Unassigned. */}
              <td className="px-4 py-3">
                <select
                  value={r.industry ?? ""}
                  onChange={(e) => onSetIndustry(r.id, e.target.value || null)}
                  aria-label={`Industry for ${r.name}`}
                  className={`max-w-[13rem] px-2 py-1 bg-white border border-line rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors ${
                    r.industry ? "text-ink" : "text-muted"
                  }`}
                >
                  <option value="">Unassigned</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </td>
```

- [ ] **Step 2: Add industry to the add form**

In `src/app/dashboard/emailer/recipients/page.tsx`, extend the imports:

```tsx
import { INDUSTRIES, industryLabel } from "@/lib/industries";
import {
  allSelected,
  clearSelection,
  countByStatus,
  filterRecipients,
  selectAll,
  toggleSelection,
  INDUSTRY_ANY,
  INDUSTRY_NONE,
  type RecipientStatus,
} from "@/lib/recipient-list";
```

Add state beside `newName` / `newEmail`:

```tsx
  const [newIndustry, setNewIndustry] = useState("");
```

Send it in `handleAdd`:

```tsx
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          industry: newIndustry || null,
        }),
```

Clear it on success, next to the two existing resets:

```tsx
        setNewEmail("");
        setNewName("");
        setNewIndustry("");
```

Add the control inside the form's flex row, after the email `Input`:

```tsx
            <select
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              aria-label="Recipient industry"
              className="px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50"
            >
              <option value="">Industry — Unassigned</option>
              {INDUSTRIES.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
```

- [ ] **Step 3: Add the filter control**

Add state beside `status`:

```tsx
  const [industry, setIndustry] = useState<string>(INDUSTRY_ANY);
```

Add the select immediately after the existing status select in the sticky filter bar:

```tsx
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            aria-label="Filter by industry"
            className="px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50"
          >
            <option value={INDUSTRY_ANY}>All industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
            <option value={INDUSTRY_NONE}>Unassigned</option>
          </select>
```

Pass it to the filter, and count it as filtering so Delete all stays disabled on a partial view:

```tsx
  const visible = filterRecipients(recipients, { query, status, industry });
  const visibleIds = visible.map((r) => r.id);
  const filtering =
    query.trim() !== "" || status !== "all" || industry !== INDUSTRY_ANY;
```

- [ ] **Step 4: Add the industry handler and wire the table**

Add beside `handleToggle`:

```tsx
  /**
   * Optimistic, like handleToggle: the select has already moved under the
   * pointer, so waiting on a round trip to redraw it would read as lag. A
   * failure puts the previous value back rather than leaving the control
   * showing something the database does not hold.
   */
  const handleSetIndustry = async (id: string, next: string | null) => {
    const previous = recipients.find((r) => r.id === id)?.industry ?? null;
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, industry: next } : r))
    );

    try {
      const res = await fetch("/api/email/recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, industry: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Set to ${industryLabel(next)}`);
    } catch {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, industry: previous } : r))
      );
      toast.error("Failed to update industry");
    }
  };
```

Pass it to `<RecipientsTable>`:

```tsx
            onToggleActive={handleToggle}
            onSetIndustry={handleSetIndustry}
            onDelete={handleDelete}
```

- [ ] **Step 5: Report the industry match in the import preview**

In the preview block, add a badge after the existing "unusable" one:

```tsx
              {preview.withIndustry > 0 && (
                <Badge>
                  {preview.withIndustry} of {preview.recipients.length} with an
                  industry
                </Badge>
              )}
```

And show the industry on each sample line, so a mis-detected column is visible before it is written:

```tsx
              {preview.recipients.slice(0, 4).map((r) => (
                <li key={r.email} className="truncate">
                  <span className="text-ink">{r.name}</span>
                  <span> — </span>
                  {r.email}
                  {r.industry && <span> · {industryLabel(r.industry)}</span>}
                </li>
              ))}
```

- [ ] **Step 6: Verify it builds and works**

Run: `npx tsc --noEmit`
Expected: PASS, no errors anywhere.

Run: `npm run dev`, open `http://localhost:3000/dashboard/emailer/recipients`, and confirm by hand:
1. The Industry column shows "Unassigned" on every existing row.
2. Changing a row's select shows a toast and survives a page reload — *this requires migration 0007 to have been applied*; if it has not, expect the toast to report a failure and the value to revert, which is the correct behaviour and not a bug in this task.
3. The industry filter narrows the list and the "Showing N of 77" counter follows it.
4. Delete all is disabled while an industry filter is set.

Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/RecipientsTable.tsx src/app/dashboard/emailer/recipients/page.tsx
git commit -m "Show, set and filter recipient industry on the recipients page"
```

---

### Task 7: Template registry

The refactor that makes a second template cheap. The existing creative's output must not change by one byte, so the test is a snapshot taken *before* the refactor.

**Files:**
- Create: `src/components/email/templates/types.ts`
- Create: `src/components/email/templates/shell.ts`
- Create: `src/components/email/templates/campaign-dubai.ts`
- Create: `src/components/email/templates/index.ts`
- Create: `tests/fixtures/campaign-dubai.snapshot.html` (generated, committed)
- Create: `tests/email-templates.test.mjs`
- Modify: `src/components/email/template.ts` (becomes a re-export)

**Interfaces:**
- Consumes: `emailerAsset` from `@/lib/cdn`, `SITE` from `@/lib/seo`.
- Produces:
  - `type EmailTemplateModule = { id, name, description, thumbnail, render }` where `render: (props: { subject: string; body: string }) => string`
  - `TEMPLATES: EmailTemplateModule[]`
  - `DEFAULT_TEMPLATE_ID: string`
  - `getTemplate(id: string | null | undefined): EmailTemplateModule`
  - `shell({ subject, body, content }): string` and `esc`, `preheader`, `W`, `INK`, `FONT` from `shell.ts`

- [ ] **Step 1: Capture the current output as a snapshot**

Before changing anything, run this exact command — it was verified during planning and produces a 6,944-character document:

```bash
mkdir -p tests/fixtures
node --import ./tests/resolve-alias.mjs --input-type=module -e "
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
const { EmailTemplate } = await import(pathToFileURL('src/components/email/template.ts').href);
writeFileSync('tests/fixtures/campaign-dubai.snapshot.html', EmailTemplate({ subject: 'Snapshot Subject & <Test>', body: 'Snapshot preheader body.' }), 'utf8');
console.log('written');
"
```

The `--import ./tests/resolve-alias.mjs` is load-bearing: `template.ts` imports `@/lib/cdn` and `@/lib/seo`, which bare Node cannot resolve.

Confirm the snapshot is complete:

```bash
grep -c "Unsubscribe" tests/fixtures/campaign-dubai.snapshot.html
wc -c tests/fixtures/campaign-dubai.snapshot.html
```
Expected: `1`, and a byte count of 6944. A different byte count means `template.ts` has been edited since planning — stop and check the diff before continuing, because this snapshot is about to become the specification.

**Take the snapshot before touching any file in `src/components/email/`.** Once the refactor starts, there is nothing left to snapshot and the guard is worthless.

- [ ] **Step 2: Write the failing test**

Create `tests/email-templates.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/email/templates/index.ts")
).href;

let TEMPLATES;
let DEFAULT_TEMPLATE_ID;
let getTemplate;

try {
  ({ TEMPLATES, DEFAULT_TEMPLATE_ID, getTemplate } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

const PROPS = { subject: "Snapshot Subject & <Test>", body: "Snapshot preheader body." };

test("the registry exports what the composer and send routes import", () => {
  assert.ok(Array.isArray(TEMPLATES), "TEMPLATES should be an array");
  assert.ok(TEMPLATES.length >= 1);
  assert.equal(typeof DEFAULT_TEMPLATE_ID, "string");
  assert.equal(typeof getTemplate, "function");
});

test("every template is complete enough to put in the picker", () => {
  const ids = TEMPLATES.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "template ids must be unique");
  for (const t of TEMPLATES) {
    assert.match(t.id, /^[a-z0-9-]+$/);
    assert.ok(t.name.length > 0, `${t.id} needs a name`);
    assert.ok(t.description.length > 0, `${t.id} needs a description`);
    assert.ok(t.thumbnail.length > 0, `${t.id} needs a thumbnail`);
    assert.equal(typeof t.render, "function");
  }
});

test("getTemplate falls back rather than failing a send", () => {
  assert.equal(getTemplate(DEFAULT_TEMPLATE_ID).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate(null).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate(undefined).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate("").id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate("a-template-we-deleted").id, DEFAULT_TEMPLATE_ID);
});

test("every template renders a complete document with the legal footer", () => {
  for (const t of TEMPLATES) {
    const html = t.render(PROPS);
    assert.equal(typeof html, "string");
    assert.match(html, /^<!DOCTYPE html/, `${t.id} should be a full document`);
    assert.match(html, /<\/html>$/, `${t.id} should close its document`);
    assert.ok(html.includes("Unsubscribe"), `${t.id} is missing the footer`);
    assert.ok(html.includes("admirate.in"), `${t.id} is missing the site link`);
  }
});

test("the subject is escaped, never interpolated raw", () => {
  for (const t of TEMPLATES) {
    const html = t.render({ subject: '<script>x</script>&"', body: "b" });
    assert.ok(!html.includes("<script>"), `${t.id} interpolates the subject raw`);
    assert.ok(html.includes("&lt;script&gt;"), `${t.id} should escape the subject`);
  }
});

test("the campaign creative is unchanged, byte for byte", () => {
  const expected = readFileSync(
    resolve(here, "fixtures/campaign-dubai.snapshot.html"),
    "utf8"
  );
  assert.equal(getTemplate("campaign-dubai").render(PROPS), expected);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/email-templates.test.mjs"`
Expected: FAIL — "TEMPLATES should be an array".

- [ ] **Step 4: Write the module type**

Create `src/components/email/templates/types.ts`:

```ts
/**
 * The contract every template satisfies.
 *
 * Its own file rather than living in index.ts: a template imports the type and
 * index.ts imports the template, so putting the type in index would make that
 * a cycle.
 */
export type EmailTemplateModule = {
  /** Stable — this is the value stored on `email_drafts.template_id`. */
  id: string;
  /** Shown on the picker card. */
  name: string;
  /** One line, under the name. Say who it is for. */
  description: string;
  /** An image URL for the card. See campaign-dubai.ts for how it is derived. */
  thumbnail: string;
  /**
   * The whole message as an HTML string.
   *
   * A string, not JSX, because the Outlook fallbacks live inside `<!--[if mso]>`
   * conditional comments which JSX cannot emit. The send routes pass this to
   * Resend's `html:` option.
   */
  render: (props: { subject: string; body: string }) => string;
};
```

- [ ] **Step 5: Write the shared shell**

Create `src/components/email/templates/shell.ts`. Move the constants, `esc`, `preheader`, the `<head>` block, the wrapper table and the legal footer out of `src/components/email/template.ts` verbatim — the only edit is that `${rows}` becomes `${content}`:

```ts
import { SITE } from "@/lib/seo";

/**
 * Everything every campaign email has in common: the document, the head, the
 * width wrapper and the legal footer.
 *
 * It exists because the client workarounds below took a long time to get right
 * and are not specific to any one creative. A template that re-derived them
 * would get one of them wrong, and the failure mode is invisible until it is in
 * somebody's inbox.
 */

export const INK = "#1a1a1a";
export const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** Display width of the email body. Artwork is authored at 1200px — 2x. */
export const W = 600;

export const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Dashboard copy arrives as plain text over many lines. The preheader is a
 * single run of text, and clients cut it around 100-150 characters, so it is
 * flattened and trimmed rather than shown whole.
 */
export const preheader = (value: string) => {
  const flat = String(value ?? "").replace(/\s+/g, " ").trim();
  return esc(flat.length > 140 ? `${flat.slice(0, 139).trimEnd()}…` : flat);
};

export type ShellProps = {
  subject: string;
  /** Fills the inbox preview text. Does not appear in the message body. */
  body: string;
  /** The template's own rows, as `<tr>` markup, dropped into the wrapper. */
  content: string;
};

export function shell({ subject, body, content }: ShellProps): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings>
  <o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
  img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;display:block}
  table{border-collapse:collapse !important}
  body{margin:0 !important;padding:0 !important;width:100% !important;height:100% !important}
  a{text-decoration:none}
  /* Stops iOS turning addresses and numbers into blue underlines the design
     never had. */
  a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
  /* Honoured by Apple Mail and Outlook.com, which then leave the creative
     alone. The Gmail app honours none of it and inverts regardless — which is
     why the creative is artwork rather than text, and why only the footer
     below can change colour. */
  :root{color-scheme:light;supported-color-schemes:light}
  @media screen and (max-width:600px){
    .wrap{width:100% !important;max-width:100% !important}
    .fluid{width:100% !important;height:auto !important}
    .px{padding-left:24px !important;padding-right:24px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">

<!-- Preheader. The dashboard's body text, and the only place it appears: it is
     what the inbox prints beside the subject. The zero-width joiners stop
     Gmail pulling the footer in behind it to pad the line. -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
  ${preheader(body)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="${W}"><tr><td><![endif]-->
<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="${W}" style="width:${W}px;max-width:${W}px;background-color:#ffffff;">

${content}

  <!-- 2 — LEGAL. Not in the artwork. It is here because a commercial bulk send
       without a postal address and an unsubscribe path breaches CAN-SPAM and
       most ESP terms, and both Gmail and Outlook weigh its absence when
       deciding the spam folder. Styled to stay quiet, and the only part of the
       message the Gmail app's dark mode can recolour. -->
  <tr><td align="center" class="px" style="padding:34px 40px 40px 40px;font-family:${FONT};font-size:11px;line-height:18px;color:#9a9a9e;">
    ${esc(SITE.name)} &mdash; ${esc(SITE.tagline)}<br />
    ${esc(SITE.area)}, ${esc(SITE.city)}, ${esc(SITE.region)}, ${esc(SITE.country)}<br />
    <a href="${SITE.url}" style="color:#9a9a9e;text-decoration:underline;">admirate.in</a>
    &nbsp;&middot;&nbsp;
    <a href="mailto:${esc(SITE.email)}?subject=Unsubscribe" style="color:#9a9a9e;text-decoration:underline;">Unsubscribe</a>
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
```

- [ ] **Step 6: Write the first template**

Create `src/components/email/templates/campaign-dubai.ts`. The long `WHY FLAT ARTWORK` / `WHY FOUR SLICES` / `ALT TEXT IS THE EMAIL` comment block moves here from `template.ts` unchanged — it is about this creative, not about the shell:

```ts
import { emailerAsset, optimized } from "@/lib/cdn";
import { SITE } from "@/lib/seo";
import type { EmailTemplateModule } from "./types";
import { esc, shell, FONT, INK, W } from "./shell";

/**
 * The ADMIRATE campaign email: the creative as four linked slices of flat
 * artwork, with the shared legal footer beneath it.
 *
 * [Move the full WHY FLAT ARTWORK RATHER THAN LIVE TEXT, WHY FOUR SLICES and
 * ALT TEXT IS THE EMAIL paragraphs from the original template.ts header comment
 * here verbatim. They explain this creative's construction and are the reason
 * nobody should turn it back into live text.]
 */

type Slice = {
  file: string;
  /** Display height. Stated on the tag because Outlook will not infer it. */
  height: number;
  /** Which of the template's destinations the whole slice links to. */
  to: "knowMore" | "pricing" | "contact";
  alt: string;
};

const SLICES: Slice[] = [
  {
    file: "creative-1-story.jpg",
    height: 1484,
    to: "knowMore",
    alt: "ADMIRATE is now accepting new clients. There are 10,000+ real estate offices in Dubai and 11 new ones open every day — every one is your competition. Visibility alone doesn't grow a business. The journey does. For real estate and service businesses, growth isn't driven by a website alone. It's clear messaging, meaningful design across every touchpoint, a consistent social media presence, and a customer journey that turns attention into enquiries.",
  },
  {
    file: "creative-2-pricing.jpg",
    height: 491,
    to: "pricing",
    alt: "That's what we build. Plans starting from AED 3,613 — explore plans and pricing.",
  },
  {
    file: "creative-3-knowmore.png",
    height: 36,
    to: "knowMore",
    alt: "Know more",
  },
  {
    file: "creative-4-contact.png",
    height: 116,
    to: "contact",
    alt: "Contact ADMIRATE",
  },
];

export type CampaignHrefs = {
  knowMoreHref?: string;
  pricingHref?: string;
  contactHref?: string;
};

export function renderCampaignDubai({
  subject,
  body,
  knowMoreHref = SITE.url,
  pricingHref = `${SITE.url}/pricing`,
  contactHref = `${SITE.url}/start-project`,
}: { subject: string; body: string } & CampaignHrefs): string {
  const href = { knowMore: knowMoreHref, pricing: pricingHref, contact: contactHref };

  /* Zero font-size and line-height on the cells: a td inherits the body's
     leading and would otherwise print a few pixels of white under each image,
     which shows as a gap at every join. */
  const rows = SLICES.map((s) => {
    const src = emailerAsset(s.file);
    return `  <tr><td style="padding:0;font-size:0;line-height:0;">
    <a href="${href[s.to]}" style="display:block;text-decoration:none;">
      <img src="${src}" width="${W}" height="${s.height}" alt="${esc(s.alt)}" class="fluid" style="display:block;width:100%;max-width:${W}px;height:auto;border:0;outline:none;font-family:${FONT};font-size:16px;line-height:24px;color:${INK};text-align:center;" />
    </a>
  </td></tr>`;
  }).join("\n");

  return shell({
    subject,
    body,
    content: `  <!-- 1 — THE CREATIVE, in four linked slices. -->\n${rows}`,
  });
}

const campaignDubai: EmailTemplateModule = {
  id: "campaign-dubai",
  name: "Dubai Campaign — Real Estate",
  description:
    "The four-slice creative: the market story, pricing from AED 3,613, and the two closing calls to action.",
  /* No thumbnail file is shipped. The card shows this template's own first
     slice, already hosted in the emailer bucket, through Next's image
     optimizer — the Supabase host is in next.config.ts remotePatterns and 384
     is one of Next's default imageSizes, so this needs no configuration and
     adds no bytes to the repo. */
  thumbnail: optimized(emailerAsset("creative-1-story.jpg"), 384),
  render: renderCampaignDubai,
};

export default campaignDubai;
```

- [ ] **Step 7: Write the registry**

Create `src/components/email/templates/index.ts`:

```ts
import type { EmailTemplateModule } from "./types";
import campaignDubai from "./campaign-dubai";

export type { EmailTemplateModule };

/**
 * Every template the composer can choose. Order is the order of the cards.
 *
 * Adding one is a file here, a line in this array, and nothing else — no
 * database write, no dashboard screen, no deploy configuration.
 */
export const TEMPLATES: EmailTemplateModule[] = [campaignDubai];

/** What a draft with no template_id sends. The first entry, by definition. */
export const DEFAULT_TEMPLATE_ID = TEMPLATES[0].id;

/**
 * Never throws and never returns undefined.
 *
 * A draft can be scheduled on Monday and sent on Thursday, and a template can
 * be renamed or removed in between. Falling back to the default means that send
 * goes out looking slightly wrong; throwing would mean it does not go out at
 * all, and nobody would find out until the campaign was over.
 */
export function getTemplate(
  id: string | null | undefined
): EmailTemplateModule {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
```

- [ ] **Step 8: Reduce the old file to a re-export**

Replace the whole of `src/components/email/template.ts` with:

```ts
/**
 * Kept so nothing importing `EmailTemplate` breaks while the send routes move
 * to the registry. The creative itself now lives in
 * `templates/campaign-dubai.ts`. Delete this file once nothing imports it.
 */
export { renderCampaignDubai as EmailTemplate } from "./templates/campaign-dubai";
export type { EmailTemplateProps } from "./templates/campaign-dubai";
```

For that type export to resolve, add to `campaign-dubai.ts`:

```ts
export type EmailTemplateProps = { subject: string; body: string } & CampaignHrefs;
```

and use it as `renderCampaignDubai`'s parameter type in place of the inline object.

- [ ] **Step 9: Run the tests**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/email-templates.test.mjs"`
Expected: PASS, 6 tests — including the byte-for-byte snapshot.

If the snapshot test fails, diff it rather than editing the snapshot:

```bash
node --import ./tests/resolve-alias.mjs --input-type=module -e "
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
const { getTemplate } = await import(pathToFileURL('src/components/email/templates/index.ts').href);
writeFileSync('actual.html', getTemplate('campaign-dubai').render({ subject: 'Snapshot Subject & <Test>', body: 'Snapshot preheader body.' }), 'utf8');
"
diff tests/fixtures/campaign-dubai.snapshot.html actual.html
rm actual.html
```

The snapshot is the specification here. Fix `shell.ts` or `campaign-dubai.ts` until the diff is empty; never regenerate the snapshot.

- [ ] **Step 10: Type-check and commit**

Run: `npx tsc --noEmit`
Expected: PASS.

```bash
git add src/components/email tests/email-templates.test.mjs tests/fixtures/campaign-dubai.snapshot.html
git commit -m "Extract the email shell and put the creative behind a template registry"
```

---

### Task 8: Preview endpoint

**Files:**
- Create: `src/app/api/email/preview/route.ts`

**Interfaces:**
- Consumes: `getTemplate` (Task 7), `requireAdmin` from `@/lib/api-auth`.
- Produces: `GET /api/email/preview?template=<id>&subject=<s>&body=<b>` returning `text/html`.

- [ ] **Step 1: Write the route**

Create `src/app/api/email/preview/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/components/email/templates";
import { requireAdmin } from "@/lib/api-auth";

/**
 * Renders a template exactly as the send routes will, for a new browser tab.
 *
 * It calls the same `getTemplate(id).render()` those routes call rather than
 * approximating it, so what is on screen is the bytes Resend gets. Sending a
 * creative to a list is not reversible; being able to look at it first is worth
 * one route.
 *
 * Admin-gated like every other dashboard endpoint — this returns marketing
 * copy, not secrets, but an open route that renders arbitrary query text into
 * HTML is not something to leave lying about.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const params = request.nextUrl.searchParams;
  const template = getTemplate(params.get("template"));

  const html = template.render({
    subject: params.get("subject") ?? "",
    body: params.get("body") ?? "",
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // A preview is of whatever is in the composer right now. A cached one
      // showing the previous subject is worse than no preview at all.
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 2: Verify it renders**

Run `npm run dev`, sign in to the dashboard, then open:

`http://localhost:3000/api/email/preview?template=campaign-dubai&subject=Test&body=Hello`

Expected: the full creative renders in the browser, images and all. A 401 means the admin cookie is missing — sign in first.

Then confirm the gate holds. In a private window with no session, open the same URL.
Expected: the JSON error `requireAdmin` returns, not the HTML.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/email/preview/route.ts
git commit -m "Add an admin-only template preview endpoint"
```

---

### Task 9: Send the chosen template to the chosen industries

**Files:**
- Modify: `src/app/api/email/send/route.ts`
- Modify: `src/app/api/cron/send-email/route.ts`
- Modify: `src/app/api/email/drafts/route.ts` — `POST` and `PATCH`
- Create: `src/lib/campaign-audience.ts`
- Test: `tests/campaign-audience.test.mjs`

**Interfaces:**
- Consumes: `toIndustryId` (Task 1), `getTemplate` (Task 7).
- Produces: `cleanAudience(value: unknown): string[]` and `describeAudience(ids: string[]): string` from `src/lib/campaign-audience.ts`.

- [ ] **Step 1: Write the failing test**

Create `tests/campaign-audience.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/campaign-audience.ts")).href;

let cleanAudience;
let describeAudience;

try {
  ({ cleanAudience, describeAudience } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

test("the module exports what the send routes import", () => {
  assert.equal(typeof cleanAudience, "function");
  assert.equal(typeof describeAudience, "function");
});

test("an empty audience means everyone, and stays empty", () => {
  assert.deepEqual(cleanAudience([]), []);
  assert.deepEqual(cleanAudience(null), []);
  assert.deepEqual(cleanAudience(undefined), []);
  assert.deepEqual(cleanAudience("real-estate-brokerage"), []);
  assert.deepEqual(cleanAudience({}), []);
});

test("known ids survive", () => {
  assert.deepEqual(cleanAudience(["technology", "hospitality"]), [
    "technology",
    "hospitality",
  ]);
});

test("unknown ids are dropped, the rest still apply", () => {
  assert.deepEqual(cleanAudience(["technology", "a-segment-we-retired"]), [
    "technology",
  ]);
  assert.deepEqual(cleanAudience(["nope", 7, null]), []);
});

test("repeats are collapsed so the query is not silly", () => {
  assert.deepEqual(cleanAudience(["technology", "technology"]), ["technology"]);
});

test("labels are accepted, because the same matcher resolves them", () => {
  assert.deepEqual(cleanAudience(["Technology"]), ["technology"]);
});

test("describeAudience names the segments for a toast and an error", () => {
  assert.equal(describeAudience([]), "everyone");
  assert.equal(describeAudience(["technology"]), "Technology");
  assert.equal(
    describeAudience(["technology", "hospitality"]),
    "Technology and Hospitality"
  );
  assert.equal(
    describeAudience(["technology", "hospitality", "construction"]),
    "Technology, Hospitality and Construction"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/campaign-audience.test.mjs"`
Expected: FAIL — `cleanAudience` is not a function.

- [ ] **Step 3: Write the implementation**

Create `src/lib/campaign-audience.ts`:

```ts
import { industryLabel, toIndustryId } from "@/lib/industries";

/**
 * The industries a campaign is aimed at, cleaned for the database and the query.
 *
 * Its own module rather than inline in the send route because both send routes
 * and the drafts route need the same answer, and because "which industries did
 * they mean" is exactly the kind of thing that should be testable without a
 * request. An empty array is a real, meaningful value: it means everyone active,
 * which is what the emailer did before this existed.
 */
export function cleanAudience(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const raw of value) {
    // Retired ids are dropped rather than failing the send. The remaining
    // segments are still what was asked for, and a campaign that refuses to go
    // out over one stale chip is worse than one that goes to two segments
    // instead of three.
    const id = toIndustryId(raw);
    if (id !== null && !out.includes(id)) out.push(id);
  }
  return out;
}

/** For a toast, a button label and the zero-recipients error. */
export function describeAudience(ids: string[]): string {
  if (ids.length === 0) return "everyone";
  const labels = ids.map(industryLabel);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import ./tests/resolve-alias.mjs --test "tests/campaign-audience.test.mjs"`
Expected: PASS, 7 tests.

- [ ] **Step 5: Persist template and audience on drafts**

In `src/app/api/email/drafts/route.ts`, add the import:

```ts
import { cleanAudience } from "@/lib/campaign-audience";
```

Replace the `POST` destructure and insert:

```ts
    const { subject, body, status = "draft", templateId, industries } =
      await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_drafts")
      .insert({
        subject,
        body,
        status,
        // Null rather than a default id: the registry decides what the default
        // is, and a draft that names no template should follow it if it moves.
        template_id: typeof templateId === "string" && templateId ? templateId : null,
        industries: cleanAudience(industries),
      })
      .select()
      .single();
```

And in `PATCH`, extend the destructure and the update object:

```ts
    const { id, subject, body, status, templateId, industries } =
      await request.json();
```

```ts
    const updateData: DraftUpdate = {};
    if (subject) updateData.subject = subject;
    if (body) updateData.body = body;
    if (status) updateData.status = status;
    // `undefined` means "not editing this"; null and [] are real values that
    // must be writable, so these test for presence rather than truthiness.
    if (templateId !== undefined) {
      updateData.template_id =
        typeof templateId === "string" && templateId ? templateId : null;
    }
    if (industries !== undefined) {
      updateData.industries = cleanAudience(industries);
    }
```

- [ ] **Step 6: Send through the registry, to the audience**

Replace `src/app/api/email/send/route.ts` in full:

```ts
import { NextRequest, NextResponse } from "next/server";
import { sendCampaign } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTemplate } from "@/components/email/templates";
import { cleanAudience, describeAudience } from "@/lib/campaign-audience";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { subject, body, draftId, templateId, industries } =
      await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const audience = cleanAudience(industries);
    const template = getTemplate(
      typeof templateId === "string" ? templateId : null
    );

    const supabase = createAdminClient();

    let query = supabase
      .from("email_recipients")
      .select("email, name")
      .eq("active", true);

    // An empty audience is not a filter of nothing — it means everyone, which
    // is what this route did before segmentation existed and is still the
    // default the composer sends when no chip is picked.
    if (audience.length > 0) query = query.in("industry", audience);

    const { data: recipients, error: recipientsError } = await query;

    if (recipientsError || !recipients || recipients.length === 0) {
      /* Named rather than a bare "no recipients": with segmentation the usual
         cause is a segment nobody has been assigned to yet, and the fix is to
         go and assign them. A generic message sends people to look at the
         wrong screen. */
      return NextResponse.json(
        {
          error:
            audience.length > 0
              ? `No active recipients in ${describeAudience(audience)}`
              : "No active recipients found",
        },
        { status: 400 }
      );
    }

    const { error: sendError } = await sendCampaign({
      to: recipients.map((r) => r.email),
      subject,
      /* `html`, not `react`: the template emits Outlook conditional comments
         and VML, which JSX cannot express. */
      html: template.render({ subject, body }),
    });

    if (sendError) {
      /* The provider's own words, not "Failed to send email": the composer
         shows this error verbatim, and a bare failure string sent the last
         outage to the server logs to find out what went wrong. */
      return NextResponse.json(
        { error: `Failed to send email: ${sendError}` },
        { status: 500 }
      );
    }

    if (draftId) {
      await supabase
        .from("email_drafts")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          template_id: template.id,
          industries: audience,
        })
        .eq("id", draftId);
    } else {
      await supabase.from("email_drafts").insert({
        subject,
        body,
        status: "sent",
        sent_at: new Date().toISOString(),
        template_id: template.id,
        industries: audience,
      });
    }

    return NextResponse.json({
      message: `Email sent to ${recipients.length} recipients${
        audience.length > 0 ? ` in ${describeAudience(audience)}` : ""
      }`,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

Note the unused `createClient` import from `@/lib/supabase/server` is dropped — it was never used in this file.

- [ ] **Step 7: Do the same for the scheduled send**

In `src/app/api/cron/send-email/route.ts`, replace the `EmailTemplate` import:

```ts
import { getTemplate } from "@/components/email/templates";
import { cleanAudience, describeAudience } from "@/lib/campaign-audience";
```

Drop the unused `createClient` import from `@/lib/supabase/server`.

After the scheduled draft is fetched, resolve the audience and template from the row, then filter the query:

```ts
    // Read from the row, not from a request: this runs hours after the composer
    // closed, and the row is the only record of what was chosen.
    const audience = cleanAudience(scheduledDraft.industries);
    const template = getTemplate(scheduledDraft.template_id);

    let query = supabase
      .from("email_recipients")
      .select("email, name")
      .eq("active", true);

    if (audience.length > 0) query = query.in("industry", audience);

    const { data: recipients, error: recipientsError } = await query;

    if (recipientsError || !recipients || recipients.length === 0) {
      /* 200, not 500: the cron is not broken, there is simply nobody to send
         to. A 500 here would page someone about an empty segment. The draft is
         deliberately left `scheduled` so it goes out once somebody is
         assigned. */
      return NextResponse.json(
        {
          message:
            audience.length > 0
              ? `No active recipients in ${describeAudience(audience)}`
              : "No active recipients",
        },
        { status: 200 }
      );
    }
```

And render through the template:

```ts
      html: template.render({
        subject: scheduledDraft.subject,
        body: scheduledDraft.body,
      }),
```

- [ ] **Step 8: Type-check and run every test**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"`
Expected: every test passes except the 6 in `sitemap-http.test.mjs` from the baseline. The pass count should be 88 plus everything this plan added; the fail count must still be exactly 6.

- [ ] **Step 9: Commit**

```bash
git add src/lib/campaign-audience.ts tests/campaign-audience.test.mjs src/app/api/email/send/route.ts src/app/api/cron/send-email/route.ts src/app/api/email/drafts/route.ts
git commit -m "Send the chosen template to the chosen industries"
```

---

### Task 10: Composer picks a template and an audience

**Files:**
- Modify: `src/app/dashboard/emailer/page.tsx`

**Interfaces:**
- Consumes: `TEMPLATES`, `DEFAULT_TEMPLATE_ID` (Task 7); `INDUSTRIES`, `industryLabel` (Task 1); `describeAudience` (Task 9); the drafts and send route fields (Task 9); `GET /api/email/preview` (Task 8).
- Produces: nothing.

- [ ] **Step 1: Extend the imports, type and state**

At the top of `src/app/dashboard/emailer/page.tsx`:

```tsx
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from "@/components/email/templates";
import { INDUSTRIES, industryLabel } from "@/lib/industries";
import { describeAudience } from "@/lib/campaign-audience";
```

Widen the `Draft` type:

```tsx
type Draft = {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "sent" | "scheduled";
  template_id: string | null;
  industries: string[];
  sent_at: string | null;
  created_at: string;
};

/** Only the fields the audience counter needs. */
type AudienceRow = { active: boolean; industry: string | null };
```

Add state:

```tsx
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [audience, setAudience] = useState<string[]>([]);
  const [rows, setRows] = useState<AudienceRow[]>([]);
```

- [ ] **Step 2: Load the recipient counts**

Add beside `fetchDrafts`, and call it from the existing `useEffect`:

```tsx
  /**
   * The recipient list, for the counts on the audience chips only.
   *
   * Counted in the browser from the list the recipients page already serves,
   * rather than adding a counts endpoint: the whole list is a few KB, it is one
   * request, and the numbers cannot drift from what that page shows.
   */
  const fetchAudienceRows = async () => {
    try {
      const res = await fetch("/api/email/recipients");
      const data = await res.json();
      if (res.ok) setRows(data);
    } catch {
      // A failed count leaves the chips reading 0. It must not block composing.
    }
  };
```

```tsx
  useEffect(() => {
    fetchDrafts();
    fetchAudienceRows();
  }, []);
```

Add the counters above the `return`:

```tsx
  const activeRows = rows.filter((r) => r.active);
  const countFor = (id: string) =>
    activeRows.filter((r) => r.industry === id).length;
  const reach =
    audience.length === 0
      ? activeRows.length
      : activeRows.filter((r) => r.industry && audience.includes(r.industry))
          .length;

  const toggleIndustry = (id: string) =>
    setAudience((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
```

- [ ] **Step 3: Send the two new fields everywhere**

In `handleSaveDraft`, both branches:

```tsx
          body: JSON.stringify({ id: editingId, subject, body, templateId, industries: audience }),
```

```tsx
          body: JSON.stringify({ subject, body, status: "draft", templateId, industries: audience }),
```

In `handleSchedule`:

```tsx
        body: JSON.stringify({ subject, body, status: "scheduled", templateId, industries: audience }),
```

In `handleSendNow`:

```tsx
        body: JSON.stringify({ subject, body, draftId: editingId, templateId, industries: audience }),
```

Reset both wherever `setSubject("")` and `setBody("")` already run together — in `handleSaveDraft`, `handleSchedule`, `handleSendNow` and the Cancel Edit button:

```tsx
      setTemplateId(DEFAULT_TEMPLATE_ID);
      setAudience([]);
```

And restore them in `handleEdit`:

```tsx
  const handleEdit = (draft: Draft) => {
    setSubject(draft.subject);
    setBody(draft.body);
    setTemplateId(draft.template_id ?? DEFAULT_TEMPLATE_ID);
    setAudience(draft.industries ?? []);
    setEditingId(draft.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
```

- [ ] **Step 4: Add the template picker**

Inside the composer `Card`, above the Subject field:

```tsx
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-sm font-medium text-ink">Template</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  window.open(
                    // The body is truncated because it only ever becomes the
                    // preheader, which is cut at 140 characters anyway, and a
                    // long draft would otherwise build a URL a proxy refuses.
                    `/api/email/preview?template=${encodeURIComponent(templateId)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 200))}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Preview
              </Button>
            </div>

            {/* Cards rather than a select. These are flat artwork creatives —
                the names distinguish them for whoever wrote them and for nobody
                else, and picking the wrong one is a send you cannot recall. */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  aria-pressed={templateId === t.id}
                  className={`shrink-0 w-56 text-left rounded-lg border overflow-hidden bg-white transition-colors ${
                    templateId === t.id
                      ? "border-brand ring-2 ring-brand/25"
                      : "border-line hover:border-brand/40"
                  }`}
                >
                  {/* object-top: the slices are tall strips, and the top of the
                      creative is the part that identifies it. */}
                  <span className="block h-28 bg-warm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.thumbnail}
                      alt=""
                      className="w-full h-28 object-cover object-top"
                    />
                  </span>
                  <span className="block px-3 py-2">
                    <span className="block text-sm font-medium text-ink truncate">
                      {t.name}
                    </span>
                    <span className="block text-xs text-muted line-clamp-2">
                      {t.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
```

- [ ] **Step 5: Add the audience chips**

Below the Body textarea, still inside the same `space-y-4` block:

```tsx
          <div>
            <span className="block text-sm font-medium text-ink mb-2">
              Audience
            </span>
            <div className="flex flex-wrap gap-2">
              {/* "Everyone" is not one more industry — it is the absence of a
                  filter, which is why picking it clears the rest rather than
                  joining them. */}
              <button
                type="button"
                onClick={() => setAudience([])}
                aria-pressed={audience.length === 0}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  audience.length === 0
                    ? "bg-brand text-white border-transparent"
                    : "bg-white text-ink border-line hover:bg-warm"
                }`}
              >
                Everyone · {activeRows.length}
              </button>

              {INDUSTRIES.map((i) => {
                const on = audience.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggleIndustry(i.id)}
                    aria-pressed={on}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                      on
                        ? "bg-brand text-white border-transparent"
                        : "bg-white text-ink border-line hover:bg-warm"
                    }`}
                  >
                    {i.label} · {countFor(i.id)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted mt-2">
              {audience.length === 0
                ? "Sending to every active recipient."
                : `Sending to ${describeAudience(audience)}.`}
            </p>
          </div>
```

- [ ] **Step 6: Put the reach on the send button**

Replace the Send Now button:

```tsx
            <Button onClick={handleSendNow} loading={sending} disabled={reach === 0}>
              {sending ? "Sending…" : `Send to ${reach}`}
            </Button>
```

- [ ] **Step 7: Say what a saved draft will do**

In the draft card, after the body preview paragraph:

```tsx
                  <p className="text-xs text-muted mt-1">
                    {(TEMPLATES.find((t) => t.id === draft.template_id) ??
                      TEMPLATES[0]).name}
                    {" · "}
                    {draft.industries?.length
                      ? draft.industries.map(industryLabel).join(", ")
                      : "Everyone"}
                  </p>
```

- [ ] **Step 8: Verify end to end**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run dev` and open `http://localhost:3000/dashboard/emailer`. Confirm:
1. The template card renders with its thumbnail and is selected by default.
2. Preview opens a new tab showing the creative with the subject you typed.
3. Audience chips show live counts; picking one changes the send button to `Send to N`.
4. Save Draft, then Edit it — the template and the chips come back as they were.
5. With a chip selected whose count is 0, the send button is disabled.

Do **not** press Send Now against the real list while testing.

Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add src/app/dashboard/emailer/page.tsx
git commit -m "Pick a template and an audience in the email composer"
```

---

## Done when

- `node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"` shows exactly 6 failures, all in `sitemap-http.test.mjs` — including a passing byte-for-byte campaign snapshot.
- `npx tsc --noEmit` is clean.
- `npm run build` succeeds.
- Migration `0007` has been applied to Supabase by whoever holds the credentials, and a recipient's industry survives a page reload.

## Self-review notes

Checked against the spec while writing:

- Every spec section maps to a task — data (2), industries (1), recipients page (3, 4, 5, 6), templates (7, 8), composer (10), sending (9), error handling (spread across 5, 7, 9), testing (in each task).
- The spec's `public/email-templates/<id>.jpg` thumbnail was replaced during planning with `optimized(emailerAsset(...))`, and the spec was updated to match. No image files are added to the repo.
- Two things the spec did not anticipate, both found by running commands rather than reasoning: `node --test` needs a quoted glob on this machine, and it cannot resolve the `@/` alias that Task 4 introduces into a tested module. Both are handled in Global Constraints and Task 1.
