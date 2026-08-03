# Start Project Wizard Design

**Date:** 2026-08-03

## Goal

Replace the single long form at `https://admirate.in/start-project` with a
step-by-step project builder that asks one question per screen.

The current page presents a fourteen-control form in one view: name, company,
email, phone, thirteen service chips, six budget chips, four timeline chips,
and a free-text brief. Everything is visible at once, every decision competes
with every other, and the only thing distinguishing a serious enquiry from a
casual one is how much the visitor chose to type.

The wizard trades a single tall screen for seven short ones. The intended
outcomes, in order of importance:

1. **A more structured lead.** Industry, service and plan arrive as their own
   columns rather than as prose inside a message body, so an enquiry can be
   routed and counted rather than only read.
2. **Higher completion.** One question at a time, with the contact ask arriving
   after the visitor has already invested five steps rather than as the entry
   toll.
3. **Prices that are never wrong.** Plan cards and their detail panels render
   from the same Supabase payload `/pricing` reads, in the visitor's own
   currency, so the two pages cannot disagree.

Non-goals: this page still does not take payment, create an account, or commit
either party to anything. It produces a row in `contact_submissions` and an
email, exactly as it does today.

## Chosen Approach

The page keeps the site's established public-page convention — a server
component owning metadata and structured data, a client wrapper around
`RawPage`, a `content.ts` holding stylesheet and markup, an `init.ts` holding
imperative behaviour with a cleanup function.

A React wizard using `useReducer` and `framer-motion` was considered and
rejected. It would type the UI, but it would also introduce a second paradigm
onto a public site where twelve pages share one, and pull `framer-motion` —
currently confined to the dashboard bundle — into a marketing route. The
maintainability argument for React largely evaporates once the branching logic
is extracted into a typed module, which this design does anyway.

Three decisions distinguish this page from the others.

**All seven steps are server-rendered at once and hidden.** The imperative
driver toggles which step is live rather than building markup on demand. This
is the same argument `PricingClient` already makes about avoiding a price
flash: the plan cards and their figures are in the HTML the server delivers,
not assembled after a fetch.

**The branching logic is a pure module, not DOM code.** `src/lib/brief.ts`
holds the step machine, the validation rules, the deep-link resolution and the
message composition, with no DOM access and no `next/*` import. `init.ts`
becomes glue over it. This is the pattern `src/lib/pricing.ts` already proves —
extracted from the pricing page precisely so `tests/pricing-calc.test.mjs` can
assert the arithmetic directly under Node rather than through a rendered page
where a wrong value is a string in a blob of HTML. The branching here has the
same property: a path that silently skips the wrong step is a bug nobody sees
until a lead arrives malformed.

**Plan content comes from Supabase, never from hand-written copy.** The three
`pricing_plans` families — `retainer`, `website`, `care` — already map exactly
to the three packaged services. Their names, blurbs, `pricing_features` grids
and per-currency amounts feed the cards and the detail panels directly. No
plan copy is authored in this page's `content.ts`, so nothing can drift from
`/pricing` when a price or a feature changes.

## Architecture

`src/app/start-project/page.tsx` becomes an async server component mirroring
`/pricing`: it reads the cached pricing payload, resolves the currency from the
`admirate_ccy` cookie and the `x-nf-country` header, builds the view, and
passes it to `StartClient` as a prop.

Two pages now need the same reader and the same view builder. Those are
extracted from `src/app/pricing/page.tsx` rather than duplicated:

| File | Contents | Status |
| --- | --- | --- |
| `src/lib/pricing-data.ts` | `getPricing()` — the `unstable_cache` reader behind the `pricing` tag | new, moved |
| `src/lib/pricing-view.ts` | `FAMILIES`, `cellsFor`, `buildView` | new, moved |
| `src/lib/brief.ts` | step machine, validation, deep-link resolution, message composition — pure | new |
| `src/components/start/content.ts` | `START_CSS`, `startHtml(view)` | rewritten |
| `src/components/start/init.ts` | imperative driver over `lib/brief.ts` | rewritten |
| `src/components/start/StartClient.tsx` | takes `view` as a prop | amended |
| `src/app/start-project/page.tsx` | async server component | rewritten |
| `src/app/pricing/page.tsx` | imports the two extracted modules | reduced |

`content.ts` exports `startHtml(view)` rather than a `START_HTML` constant, for
the same reason `pricing/content.ts` exports `pricingHtml(view)`: the markup is
now a function of fetched data.

The wizard ignores the cosmetic fields on `FAMILIES` — `title`, `bg`, `dark` —
which exist for the pricing page's section treatment, and supplies its own card
copy for the three services. `id`, `cycles` and `service` are the shared truth
and are what it reads.

## The Step Machine

Seven steps. Step 4 changes shape rather than disappearing, so the progress
rail never renumbers between paths.

```
             ┌──────────────── packaged path ────────────────┐
1 Brand → 2 Industry → 3 Service ─┬→ 4 PLAN (+ cycle) ───┬→ 5 Notes → 6 Contact → 7 Review → ✓
                                  └→ 4 SCOPE ────────────┘
                                     chips + budget
                                     (Something Else)
```

### Step definitions

**1 — Brand.** *What's your brand called?* Single text input. Required, 2–120
characters, matching the API's `company` cap. Maps to `company`.

**2 — Industry.** *What industry are you in?* Nine single-select chips: Real
Estate, Healthcare, Events, Hospitality, Retail, Education, Manufacturing,
Technology, Other. Selecting *Other* reveals a text input, max 60 characters,
which then becomes required. Maps to the new `industry` column.

**3 — Service.** Four cards: Digital Retainer, Website Development, Website
Care, Something Else. Each of the first three carries two actions: **Know
More**, which opens the detail panel, and **Select**, which chooses the service
and advances in one click. *Something Else* has no detail panel — its card
states what it covers and carries **Select** alone, and choosing it swaps step
4 to the scope variant.

**4a — Plan** *(packaged path)*. Only the chosen family's plans, from
`view.families[].plans`. Each card shows name, blurb, the formatted price cell
for the active currency, a **Know More** action, and **Choose Plan**. Required.

Billing-cycle chips — Monthly, Quarterly, 6 months, Annual — appear for
`retainer` and `care` only, defaulting to Monthly. The `website` family is
`price_type = one_time` and has no cycles to offer. Switching a cycle re-reads
the pre-formatted figure from the embedded payload; no arithmetic happens in
the browser, for the same reason it does not on `/pricing`.

**No currency switcher.** `/pricing` offers one because that page's single job
is to let a visitor find their number and believe it. Here the currency is
resolved server-side and shown, but not made switchable: a control that changes
every figure mid-wizard invites a detour on the step where the visitor is
closest to converting, and someone who needs another currency has already
chosen it on `/pricing`, where the cookie this page reads was set.

**4b — Scope** *(Something Else path)*. The existing thirteen service chips,
multi-select, at least one required. Plus the existing six budget bands,
single-select, required. Maps to `services[]` and `budget`.

**5 — Notes.** *Tell us a little more about your project.* Textarea, **optional**,
max 2000. Placeholder: "Goals, expectations, timelines, competitors, references,
or anything you'd like us to know." Below it, an optional single-select TIMELINE
chip row — ASAP, This month, This quarter, Flexible — which populates the
`timeline` column for both paths without costing a step of its own.

**6 — Contact.** *How do we reach you?* Name required 2–100, email required,
phone optional. Maps to `name`, `email`, `phone`.

**7 — Review.** Read-only summary of every answer. Each row carries an edit
affordance jumping straight to the step that set it. Two actions: `← Edit`,
which returns to step 6, and **Submit Project**.

### Submit failures

Only a successful save may show the success screen. The submit button disables
and the status line reads `// SENDING…`. On a non-OK response the button
re-enables and the status shows the API's own message; on a thrown fetch the
status reads `// NETWORK ERROR. TRY WHATSAPP INSTEAD.` In both cases the
visitor stays on step 7 with every answer intact and the stored session
untouched, so a retry costs one click rather than seven steps.

The review screen carries the same WhatsApp and email chips the landing screen
does, so a visitor blocked by a persistent failure has a way through rather
than a dead end.

### Validation

Validation runs on **Next**, not continuously, and the Next button is never
disabled — a disabled control gives a visitor no way to discover what is wrong.
A failure marks the offending control with the existing `.err` class, which
already carries the `shake` keyframe, writes a specific message, and moves
focus to the first failure.

Every rule mirrors a rule the zod schema on `/api/contact` enforces, so nothing
round-trips only to return as a generic failure:

| Field | Rule | Message |
| --- | --- | --- |
| brand | 2–120 | `YOUR BRAND NAME NEEDS AT LEAST 2 CHARACTERS.` / `THAT BRAND NAME IS OVER 120 CHARACTERS.` |
| industry | one selected; *Other* text 1–60 | `PICK THE INDUSTRY YOU WORK IN.` |
| service | one selected | `PICK A SERVICE TO CONTINUE.` |
| plan | one selected | `PICK A PLAN, OR GO BACK AND CHOOSE SOMETHING ELSE.` |
| scope chips | ≥ 1 selected | `PICK AT LEAST ONE THING YOU NEED.` |
| budget | one selected | `PICK A BUDGET RANGE — AN ESTIMATE IS FINE.` |
| notes | ≤ 2000 | `THE BRIEF IS OVER 2000 CHARACTERS. TRIM IT AND WE WILL ASK THE REST.` |
| name | 2–100 | `YOUR NAME NEEDS AT LEAST 2 CHARACTERS.` |
| email | `/^[^@\s]+@[^@\s]+\.[^@\s]+$/` | `THAT EMAIL DOES NOT LOOK RIGHT.` |
| phone | when filled: ≤ 20 and `/^\+?[\d\s()-]{7,}$/` | `THAT PHONE NUMBER DOES NOT LOOK RIGHT.` |

**Notes are optional**, which is a deliberate change from today's required
ten-character brief. The message sent to the API is always composed from the
structured answers with the notes appended, so the schema's `min(10)` is
satisfied structurally even when the textarea is empty. The enquiry that
results is more structured than today's, not less — industry, service and plan
now arrive as their own fields rather than as whatever the visitor chose to
type.

## Screens

### Landing

Unchanged from today: the ink screen, the word-by-word headline animation, the
`01 / 02 / 03` process list, and the WhatsApp and email chips that let someone
skip the form entirely.

One change. The scroll hint is replaced by a single primary CTA, **Start Your
Project**. Clicking it plays the existing ink→paper morph as a ~700ms
transition rather than as a scroll, locks body scroll, and hands the viewport
to the wizard.

The morph is the page's signature move and is kept — as a transition it is
tied to an intentional click rather than to scroll position, which is the
behaviour a wizard needs anyway, since the page no longer scrolls.

### Wizard chrome

A progress rail across the top with seven segments — filled for completed,
red for current — carrying `role="progressbar"` with `aria-valuenow`,
`aria-valuemin` and `aria-valuemax`. Beside it a mono `STEP 03 / 07` label. A
persistent `← Back` on every step after the first.

A visitor arriving from a `/pricing` tier card also sees a pinned context line
above the rail: `Enquiring about: Growth — Digital Retainer, billed annually`.

### Know More

A modal, not a card flip. A flip is fragile at variable content heights and on
touch, where the backface must be hidden reliably across engines; the panel
content here varies from three feature rows to seventeen.

Desktop renders a centred dialog; below 900px it becomes a bottom sheet. It
carries `role="dialog"` and `aria-modal="true"`, traps focus, closes on Escape
and on backdrop click, and returns focus to the button that opened it.

Contents come entirely from the Supabase view:

| Panel section | Source |
| --- | --- |
| Heading | `plan.name` / service name |
| Positioning line | `plan.blurb` — already written as an ideal-for line |
| Price | `plan.cells[currency][cycle]` — figure, per, billing total, saving, tax |
| What's included | `Everything in {plan.inheritsFrom}, plus` + `plan.includes[]` |
| Engagement | derived from `plan.oneTime` — `One-time build` or `Ongoing` |

For a service card, the panel lists the family's plan range instead of one
plan's features.

Nothing here is authored by hand, so nothing can drift from `/pricing`. The
panel's primary action is **Choose {plan}**, which selects and advances.

### Success

Reuses the checkmark draw animation already in `START_CSS` — the stroke-dash
circle and tick at `.done svg`.

Headline: **You're all set.** Subtext: "Your project request has been sent
successfully. Our team will review it and get back to you shortly with the next
steps."

Two actions. The brief specified *View Website* and *Back to Home*, which are
the same destination on this site; they become **See our work → `/services`**
and **Back to home → `/`**.

## Data and Submission

### Migration

`supabase/migrations/0006_wizard_fields.sql` adds three nullable columns,
following the shape of `0001_brief_fields.sql` so existing rows and the plain
contact path are untouched:

```sql
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS industry      TEXT,
  ADD COLUMN IF NOT EXISTS plan          TEXT,
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT;
```

`src/types/database.ts` gains the three on `Row`, `Insert` and `Update`. The
zod schema in `src/app/api/contact/route.ts` gains `industry` (max 60), `plan`
(max 60) and `billing_cycle` (max 20), each optional and each accepting the
empty string, exactly as `budget` and `timeline` already do. The insert passes
them through with the same `|| null` treatment.

`src/app/dashboard/page.tsx` renders the three in conditional blocks alongside
the existing company, services, budget and timeline blocks. `/api/submissions`
selects `*` and needs no change.

### Field mapping

| Column | Packaged path | Something Else path |
| --- | --- | --- |
| `name` | step 6 | step 6 |
| `email` | step 6 | step 6 |
| `phone` | step 6, nullable | step 6, nullable |
| `company` | brand, step 1 | brand, step 1 |
| `industry` | step 2 | step 2 |
| `services` | `["Digital Retainer"]` — the service name | the chip selection |
| `plan` | `Growth` | null |
| `billing_cycle` | `annual`, or null for `website` | null |
| `budget` | the rendered figure, e.g. `₹1,50,000/month` | the chosen band |
| `timeline` | step 5 chips, nullable | step 5 chips, nullable |
| `message` | composed | composed |

### Message composition

`composeMessage()` in `lib/brief.ts` builds the body, so an operator reading
the dashboard sees the same summary the visitor confirmed on step 7:

```
Industry: Real Estate
Service: Digital Retainer
Plan: Growth — ₹1,50,000/month, billed annually
———
Looking to generate leads in Dubai.
```

The header alone always exceeds ten characters, which is what lets step 5 be
optional. When notes are empty the separator and everything below it are
omitted rather than left dangling.

## Deep Links

Two families of inbound link already exist and both must keep working.

**From `/pricing`** — every tier card links as
`?service=<Label>&plan=<slug>&cycle=<id>`. The resolution is not a
straightforward lookup and its subtleties move into `lib/brief.ts` intact:

- `plan` alone is ambiguous. `launch` and `growth` are slugs in two different
  families; `service` disambiguates them, so the pair resolves together.
- A care slug beats `service`. `/pricing` sends `Digital` for both the build
  and the care plans, so mapping it blindly ticks Website Build on a care
  enquiry — the visitor arrives asking for a site they already have. `care` and
  `grow` are care-family slugs whatever `service` claims.
- A malformed or unknown value selects nothing rather than throwing.

**From the six `/services/<slug>` pages** — these send `?service=<Label>` where
the label is a nav service name, not a plan family. These resolve to the
**Something Else** path with the existing `SERVICE_CHIPS` map preselecting
chips: `identity` → Branding + Logo design, `design` → Campaigns + Print ads,
and so on.

In both cases the visitor still lands on **step 1**. Steps 3 and 4 are simply
already answered, and the review screen shows what was carried in. Dropping
someone into the middle of a wizard they have not started reads as broken; a
prefilled wizard that still begins at the beginning does not.

## Persistence

State is written to `sessionStorage` under `admirate_brief` on every
transition, restored on mount, and cleared on a successful submit. Seven steps
of answers must not die to an accidental refresh or a mistaken back gesture.

`sessionStorage` rather than `localStorage`: a brief is a single sitting, and a
half-finished enquiry resurfacing weeks later on a shared machine is worse than
losing it.

A restore that fails to parse is discarded silently and the wizard starts
clean. A stored state naming a plan slug that no longer exists — a plan removed
from `pricing_plans`, as `0005` removed `care/manage` — drops that answer and
returns the visitor to step 4.

## Accessibility

- Only the live step sits in the DOM flow; the others carry `hidden`, so tab
  order is always correct and a screen reader never encounters six inert
  screens.
- Focus moves to the step **heading** on advance, not to the first input, so
  the question is announced before the control that answers it.
- Chips and cards are real `<button>` elements with `aria-pressed`.
- The step region carries `aria-live="polite"` so a step change is announced.
- The Know More dialog traps focus, closes on Escape, and restores focus to its
  trigger.
- Scroll lock is `overflow: hidden` on `body` with the wizard scrolling
  internally, so a long step remains reachable by keyboard.
- The existing `prefers-reduced-motion` block extends to the step transitions
  and the CTA morph: both resolve instantly rather than animating.
- Errors set `aria-invalid` and are associated with their control via
  `aria-describedby`.

## Testing

`tests/brief-flow.test.mjs`, in the `node:test` style of
`tests/pricing-calc.test.mjs`, importing the pure `src/lib/brief.ts`:

- Step order and back-navigation for both paths.
- Choosing Something Else swaps step 4 to the scope variant and requires at
  least one chip and a budget band.
- Choosing a packaged service requires a plan, and offers cycles for `retainer`
  and `care` but not for `website`.
- Every validation rule holds at both bounds, and each matches the
  corresponding zod rule in `/api/contact`.
- Deep-link resolution: a care slug beats a conflicting `service`; an unknown
  `plan` or `service` selects nothing; a `/services` label resolves to the
  Something Else path with the right chips.
- `composeMessage()` clears `min(10)` with empty notes, and omits the separator
  when there are none.
- A restored state naming a plan absent from the view drops to step 4.

The wizard's DOM driver is not unit-tested. What it does — toggling `hidden`,
moving focus, swapping pre-formatted strings — is the part that fails visibly
on the page, whereas a wrong branch is the part that fails silently in the
database.

## Deviations from the Brief

Three, each deliberate:

1. **A contact step was added.** The brief's six steps collected brand,
   industry, service, plan and notes but never asked who the visitor was. The
   resulting enquiry would have had no reply path, and `/api/contact` would
   have rejected it outright — `name` and `email` are required. It sits at step
   6, after the investment and before the review.
2. **A fourth service card was added.** The brief offered three services; the
   agency sells thirteen. Branding, logo design, packaging, video production,
   print ads, brand collaterals, booking systems, campaigns and reels had no
   path through a three-card step. *Something Else* restores them.
3. **Notes are optional and Know More is a modal**, for the reasons given in
   their sections. The success screen's two buttons were repointed because
   *View Website* and *Back to Home* named one destination.
