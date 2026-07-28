# ADMIRATE Pricing Page Design

**Date:** 2026-07-28

## Goal

Publish a public pricing page at `https://admirate.in/pricing` that shows the
three ADMIRATE product families — Digital Retainer, Website Development, and
Website Care — with real prices rather than a "contact us for a quote"
placeholder, and that shows those prices in the visitor's own currency.

Prices must be editable by an administrator without a code deployment, must be
correct on first paint rather than after a client-side fetch, and must never
depend on a live third-party call at request time.

The page is a marketing page. It does not take payment, create an account, or
commit either party to a contract. Every call to action leads to the existing
`/start-project` enquiry form.

## Chosen Approach

The page follows the site's established public-page convention: a server
component that owns metadata and structured data, a client wrapper around
`RawPage`, a `content.ts` module holding the stylesheet and markup, and an
`init.ts` module holding the imperative behaviour with a cleanup function. It
will reuse the existing visual primitives — the left scroll rail, the
`data-bg` section colour transitions, the `.up` scroll reveals, the red-wipe
hover rows, and the Archivo / Inter / IBM Plex Mono type stack — so it reads as
part of the site rather than as a page grafted onto it.

Two decisions distinguish it from the other pages.

**Prices come from Supabase, not from a code constant.** The site already
proves this pattern with `portfolio_projects`: a public `GET` on an API route,
administrator-only writes behind `requireAdmin()`, and a dashboard screen for
editing. Pricing follows it. The cost is a database dependency on a marketing
page; the benefit is that a price change is an administrative action rather
than a developer task, which is the correct division for a figure that will
move more often than the page around it.

**The visitor's country is resolved at the edge, not in the browser.** The site
is deployed to Netlify, which already supplies the visitor's country on the
`x-nf-country` request header at no cost. Reading that header on the server
means the correct currency is present in the delivered HTML. No third-party
geolocation vendor is introduced, no client-side geolocation request is made,
no Content-Security-Policy entry is required, and no ad-blocker or privacy
browser can break the feature. A visible currency control lets any visitor
override the detection, and that choice is remembered.

Rejected alternatives, for the record: a client-side IP geolocation API (adds
latency, cost, a CSP entry, a visible price flash, and an ad-blocker failure
mode); browser locale or timezone inference (unreliable — a visitor in Dubai on
an `en-US` device resolves incorrectly); and a manual switcher with no
detection at all (most visitors never touch it and see the wrong currency).

### Derived billing cycles

Every quarterly, six-month, and annual figure in the source rate card is
exactly `monthly × months × (1 − discount)`, where the discounts are 5%, 10%,
and 15%. This was verified against all twenty-four published AED figures.

The database therefore stores **only the monthly base price** for recurring
plans, and only the single price for one-time plans. The other three cycles are
computed at render time. This reduces the stored figures from thirty to nine per
currency and, more importantly, makes it structurally impossible for an
administrator to change a monthly price and leave the annual price stale.

The discount schedule lives as a constant in `src/lib/pricing.ts` rather than in
a table. It is universal across families and currencies and does not need to be
independently editable.

### Currency strategy

AED is the base currency. It is the currency the rate card was authored in, and
it is pegged to USD at 3.6725, which makes it a stable base for derived rates.

Currencies are either **authored** or **derived**.

- **Authored** currencies have prices set by a human and stored per plan. AED
  and INR are authored.
- **Derived** currencies have no stored prices. Their figures are computed at
  render time from the AED base multiplied by a stored exchange rate, then
  rounded up to a per-currency increment. USD, GBP, and EUR are derived.

INR is authored rather than derived deliberately. Its seed values are AED
converted at ₹24.00 per dirham and rounded to the nearest ₹500, but they are
then fixed. Were INR derived, home-market prices would drift by several hundred
rupees on every daily rate refresh, which is unacceptable for the primary
market. Only the secondary international currencies float.

Derived prices round **up**, never down, and carry a visible note that they are
converted and indicative. An exchange-rate artefact must never undercut a
published price.

## Data Model

Four new tables. All carry row-level security permitting public `SELECT`;
writes go through the service-role client behind `requireAdmin()`, matching
`portfolio_projects`.

### `pricing_currencies`

| Column | Type | Purpose |
| --- | --- | --- |
| `code` | `text` primary key | ISO 4217, e.g. `AED`, `INR`, `USD` |
| `symbol` | `text` | Rendered prefix, e.g. `₹`, `AED`, `$` |
| `countries` | `text[]` | ISO 3166-1 alpha-2 codes routed to this currency |
| `authored` | `boolean` | `true` when prices are stored, `false` when derived |
| `rate` | `numeric` | Units per 1 AED. Ignored when `authored` is true |
| `rate_updated_at` | `timestamptz` | Last successful refresh |
| `round_to` | `integer` | Rounding increment. Applies only when `authored` is false |
| `active` | `boolean` | Hidden from the switcher when false |
| `sort_order` | `integer` | Order in the switcher |

### `pricing_plans`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` primary key | |
| `family` | `text` | `retainer`, `website`, or `care` |
| `slug` | `text` | `launch`, `growth`, `scale`, `enterprise`, `care`, `manage`, `grow` |
| `name` | `text` | Display name |
| `blurb` | `text` | One line beneath the name |
| `tier_order` | `integer` | Left-to-right position |
| `featured` | `boolean` | The highlighted middle column |
| `price_type` | `text` | `recurring` or `one_time` |

`(family, slug)` is unique.

### `pricing_amounts`

| Column | Type | Purpose |
| --- | --- | --- |
| `plan_id` | `uuid` | References `pricing_plans` |
| `currency_code` | `text` | References `pricing_currencies` |
| `amount` | `numeric` | Monthly base, or the one-time price |

Primary key `(plan_id, currency_code)`. Rows exist only for authored
currencies.

### `pricing_features`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `uuid` primary key | |
| `family` | `text` | Which comparison table the row belongs to |
| `label` | `text` | Row label, e.g. `Reels` |
| `row_order` | `integer` | Vertical position |
| `values` | `jsonb` | Plan slug to cell value |

A `values` entry is either a tick, an em dash, or free text — for example
`{"launch": "8", "growth": "12", "scale": "16"}` or
`{"launch": "—", "growth": "✓", "scale": "✓"}`. The renderer treats `✓` and `—`
as symbols requiring accessible labels and anything else as literal text.

## Seed Data

### Authored monthly and one-time prices

| Family | Plan | AED | INR |
| --- | --- | --- | --- |
| Digital Retainer | Launch | 4,250 | 1,02,000 |
| Digital Retainer | Growth ⭐ | 6,250 | 1,50,000 |
| Digital Retainer | Scale | 10,250 | 2,46,000 |
| Website Development | Launch | 5,750 | 1,38,000 |
| Website Development | Growth ⭐ | 8,950 | 2,15,000 |
| Website Development | Enterprise | 14,950 | 3,59,000 |
| Website Care | Care | 750 | 18,000 |
| Website Care | Manage ⭐ | 1,450 | 35,000 |
| Website Care | Grow | 2,750 | 66,000 |

Digital Retainer and Website Care figures are monthly. Website Development
figures are one-time.

INR values are AED converted at ₹24.00 per dirham, rounded to the nearest ₹500.
This conversion is a one-time seeding step. After the migration runs, the INR
figures are independent stored values and are expected to be revised by an
administrator to suit the Indian market.

### Currency rows

| Code | Symbol | Countries | Authored | `round_to` |
| --- | --- | --- | --- | --- |
| `AED` | `AED` | `AE`, `SA`, `QA`, `KW`, `OM`, `BH` | yes | 50 |
| `INR` | `₹` | `IN` | yes | 500 |
| `USD` | `$` | `US`, `CA`, `AU`, `SG`, `NZ` | no | 10 |
| `GBP` | `£` | `GB`, `IE` | no | 10 |
| `EUR` | `€` | `DE`, `FR`, `NL`, `ES`, `IT`, `BE`, `PT`, `AT` | no | 10 |

Countries absent from every list fall back to `USD`. The `round_to` values for
AED and INR are recorded for completeness but are never applied, because both
currencies are authored.

### Feature rows

Forty-eight rows in total, listed in full in the appendix: fifteen for the
Digital Retainer, twenty-one for Website Development, and twelve for Website
Care.

## Components

### `src/lib/pricing.ts`

A pure module with no database or network access, so it is directly testable
under Node.

- `BILLING_CYCLES` — the four cycles with their month counts and discounts.
- `resolveCurrency(cookie, countryHeader, currencies)` — returns a currency
  code by the precedence described under Data Flow.
- `cycleAmount(monthly, cycle)` — the derived total for a billing cycle.
- `perMonth(total, months)` — the per-month equivalent.
- `convert(aedAmount, rate, roundTo)` — derived-currency conversion, rounding
  up.
- `formatPrice(amount, currency)` — locale-correct formatting. INR uses
  `en-IN` grouping, so `1530000` renders as `15,30,000`.

### `src/app/api/pricing/route.ts`

Mirrors `src/app/api/portfolio/route.ts`.

- `GET` is public and returns currencies, plans, amounts, and features in one
  payload. The pricing page and any future consumer read from here.
- `POST`, `PATCH`, and `DELETE` call `requireAdmin()` first and return its
  denial response when present.
- Write handlers invalidate the `pricing` cache tag so the public page reflects
  the change without a deployment.

### `src/app/api/cron/fx/route.ts`

Guarded by the `CRON_SECRET` bearer token, matching
`src/app/api/cron/send-email/route.ts`. Fetches current rates from Frankfurter
(`https://api.frankfurter.dev/v1/latest?base=AED`), which is free, requires no
API key, and is sourced from European Central Bank reference rates. Writes
`rate` and `rate_updated_at` for every currency where `authored` is false.

The fetch is server-side, so no Content-Security-Policy change is required.

### `netlify/functions/scheduled-fx.ts`

A daily scheduled function that calls the route above with the cron secret,
shaped exactly like `netlify/functions/scheduled-email.ts`.

### `src/components/pricing/content.ts`

Exports `PRICING_CSS` and `pricingHtml(data)`.

This is the one deliberate deviation from the existing page convention. Other
pages export a static `XYZ_HTML` constant because their markup is fixed.
Pricing markup depends on fetched data, so the export is a function of that
data instead. The file's role, location, and relationship to `RawPage` are
otherwise unchanged.

### `src/components/pricing/init.ts`

Wires the currency control, the billing-cycle control, the comparison-table
expansion, the mobile tier selector, and the scroll rail. Returns a cleanup
function that removes every listener it added, as every other `init.ts` does.

It reads the embedded price payload from a `<script type="application/json">`
element rather than re-fetching.

### `src/components/pricing/PricingClient.tsx`

Wraps `RawPage` with the pricing stylesheet and markup plus the shared
navigation, matching `DigitalClient.tsx`.

### `src/app/pricing/page.tsx`

Reads the country header and the currency cookie, fetches the pricing payload
through the cached wrapper, resolves the default currency, and renders. Emits
page metadata through `pageMeta()` and `Service` with `Offer` structured data
through the existing `ld()` helper.

### `src/app/dashboard/pricing/page.tsx`

An administrator screen listing plans grouped by family, with editable amounts
per authored currency, feature-row editing, and a read-only panel showing each
derived currency's current rate and when it was last refreshed.

## Page Structure

Six sections, top to bottom, each with its own background colour so the page
moves through the site's light-to-dark rhythm.

1. **Hero** — the headline, a one-line promise that the prices on the page are
   the real prices, and the currency control. The control states which country
   was detected and makes clear it can be changed.
2. **Digital Retainer** — a billing-cycle control, three tier cards with the
   middle one highlighted, and a collapsed fifteen-row comparison table.
3. **Website Development** — three tier cards showing one-time prices, no
   billing-cycle control, and a collapsed twenty-one-row comparison table.
4. **Website Care** — as the Digital Retainer, with twelve feature rows.
5. **FAQ** — billing cycles, what a retainer month includes, whether plans can
   be changed, and how converted currencies work.
6. **Close** — the primary call to action and the standard footer carrying the
   NAP line and legal links.

### Price presentation

The prominent figure is always the **per-month equivalent**, with the cycle
total and the saving stated beneath it. Growth retainer on annual billing reads
`₹1,27,500/month`, then `₹15,30,000 billed annually · save ₹2,70,000`.

Displaying the cycle total as the headline figure would compare `₹1,50,000`
against `₹15,30,000` and make the discounted plan appear more expensive, which
is both misleading and counterproductive.

### Comparison tables on small screens

A twenty-one-row, four-column table cannot be rendered legibly on a phone.
At 768px and below the table shows one plan column at a time, selected by a row
of tier chips, so the layout is always `feature │ value`. This avoids both
horizontal scrolling and compressed type. The chips default to the featured
plan.

### Calls to action

Every tier card links to
`/start-project?service=<Service>&plan=<slug>&cycle=<cycle>`, carrying the
visitor's selection into the existing enquiry form. The `service` value is the
label the start-project form already recognises, mapped from the family:
`retainer` and `care` both send `Digital`, and `website` sends `Digital` as
well, because the existing form has no finer-grained option. The `plan` and
`cycle` parameters carry the specific selection. `cycle` is omitted for
one-time plans.

## Data Flow

On each request to `/pricing`:

1. The server resolves the currency by precedence — the `admirate_ccy` cookie
   when present and valid; otherwise the country on the `x-nf-country` header
   mapped through `pricing_currencies.countries`; otherwise `USD`.
2. The server reads the pricing payload through a cached fetch tagged
   `pricing`. The database is queried when the tag is invalidated by an
   administrative write, not on every page view.
3. Derived-currency amounts are computed from the AED base and the stored rate.
4. The server renders the markup with the resolved currency's figures already
   in place, and embeds the full multi-currency payload as inline JSON.
5. In the browser, changing currency or billing cycle updates the DOM from the
   embedded payload. No network request is made and no navigation occurs.
6. Changing the currency writes the `admirate_ccy` cookie with a one-year
   expiry, so the choice survives future visits.

Reading request headers opts the route out of static rendering. This is
accepted: the per-request work is header parsing and string formatting against
a cached payload.

Separately, once daily, the Netlify scheduled function calls the FX route,
which fetches current rates and writes them to `pricing_currencies`. The public
page never calls the rate provider.

Structured data always emits INR offers regardless of the resolved currency, so
the machine-readable price does not vary with the crawler's location.

## Error Handling

- **No country header.** Falls back to `USD`. The page renders normally.
- **Unrecognised country.** Falls back to `USD`.
- **Invalid or stale cookie value.** A cookie naming an unknown or inactive
  currency is ignored and detection proceeds as though it were absent.
- **Rate provider unavailable.** The cron route logs the failure and returns
  without writing. Existing rates remain in place, so the page continues to
  serve the last known good figures. A stale rate is always preferable to a
  missing price.
- **Missing authored amount.** A plan with no row for an authored currency is
  omitted from that currency's rendering rather than displayed at zero. The
  administrator screen flags the gap.
- **Supabase unavailable.** The page returns the framework error boundary
  rather than an empty price table. A pricing page showing blank prices is
  worse than one that is briefly unavailable.
- **JavaScript disabled.** The server-rendered currency and the monthly cycle
  are present in the HTML, so prices are readable. Only the switching controls
  are inert.

## Navigation and Catalogue Updates

`/pricing` becomes a fourth link in the shared navigation pill, between
Services and Blogs.

The pill is tightly tuned: existing media queries at 860px, 640px, 380px, and
340px keep three links and a call to action from overflowing. Adding a fourth
link requires retuning those breakpoints, and the result must be verified down
to a 320px viewport.

The page is also added to `src/components/sitemap/catalog.mjs`,
`src/components/llms/catalog.mjs`, and the services mega-menu footer. All three
have existing tests that will need their expected counts and entries updated.

## Verification

Automated tests will verify that:

- every published AED cycle figure in the source rate card is reproduced
  exactly by `cycleAmount()` from the monthly base — all twenty-four of them;
- `perMonth()` and the saving calculation agree with the cycle total;
- `resolveCurrency()` honours the documented precedence, including the invalid
  cookie and unknown country cases;
- `convert()` rounds up and never down, at the boundary values;
- `formatPrice()` produces Indian digit grouping for INR;
- each family renders its full feature set — fifteen, twenty-one, and twelve
  rows respectively — so a dropped row is caught rather than silently omitted;
- the sitemap and `llms.txt` catalogues include `/pricing`;
- the navigation renders four links with the correct active state.

Manual verification will confirm that the page renders correctly at 320px,
768px, and 1440px; that the comparison tables are legible on a phone; that a
simulated `x-nf-country` header changes the rendered currency without a
client-side flash; that the currency cookie survives a reload; that keyboard
navigation reaches every control and focus is visible; and that
`prefers-reduced-motion` suppresses the animations.

The existing test suite and a production build will be run after
implementation.

## Out of Scope

- Taking payment, checkout, or subscription management.
- Per-country plan structures. Every market receives the same plans and
  inclusions, differing only in currency and amount.
- Localisation of page copy. The page is English in every market.
- Automatic currency conversion for INR. Indian prices are stored values.
- VAT, GST, or other tax presentation. Prices are shown exclusive of tax, and
  the page states this.
- A public pricing API for third-party consumption.
- Country-specific URLs such as `/ae/pricing`, or `hreflang` alternates.
- Changes to existing service page copy, the start-project form's fields, or
  any other page's pricing claims.

## Required Follow-Up

The seeded INR figures are straight conversions from AED at ₹24.00 per dirham.
They were seeded on explicit instruction and are not the output of an Indian
market pricing exercise. They should be reviewed by the business and adjusted
through the dashboard before the page is promoted in the Indian market.

## Implementation Note

This design spans a database schema, an API surface, a scheduled job, a public
page, an administrator screen, and a change to shared navigation. The
implementation plan should sequence it so that each stage is independently
verifiable — data layer and pure pricing functions first, then the public page
against seeded data, then the administrator screen, then the navigation and
catalogue changes last, since those touch every existing page and its tests.

## Appendix: Feature Matrix

Transcribed from the source rate card. These populate `pricing_features`, where
each row's `values` column maps plan slug to cell value. A `✓` renders as a
tick with an accessible label, `—` as a not-included marker, and any other
string renders literally.

### Digital Retainer — fifteen rows

| Feature | Launch | Growth ⭐ | Scale |
| --- | --- | --- | --- |
| Posts | 8 | 12 | 16 |
| Reels | 4 | 6 | 8 |
| Social Media Management | ✓ | ✓ | ✓ |
| Social Media Publishing | ✓ | ✓ | ✓ |
| Professional Copywriting | ✓ | ✓ | ✓ |
| Monthly Content Planning | ✓ | ✓ | ✓ |
| Meta Ads Support | ✓ | ✓ | ✓ |
| Google Ads Support | ✓ | ✓ | ✓ |
| Website Maintenance | ✓ | ✓ | ✓ |
| Monthly Report | ✓ | ✓ | ✓ |
| Landing Page Updates | — | — | ✓ |
| Email Marketing Creatives | — | ✓ | ✓ |
| Festive Creatives | Included | Unlimited | Unlimited |
| Business Card Designs | — | 4 One-Time | Unlimited |
| Outdoor Hoarding Designs | 1/Quarter | 2/Quarter | Unlimited |

Website maintenance is included in every retainer tier, and the section
heading should say so.

### Website Development — twenty-one rows

| Feature | Launch | Growth ⭐ | Enterprise |
| --- | --- | --- | --- |
| Premium Pages | Up to 5 | Up to 5 + Booking | Unlimited |
| Premium UI/UX | ✓ | ✓ | Custom |
| Responsive Design | ✓ | ✓ | ✓ |
| Unlimited Design Revisions | ✓ | ✓ | ✓ |
| Unlimited Content Revisions | ✓ | ✓ | ✓ |
| WhatsApp Integration | ✓ | ✓ | ✓ |
| Contact Forms | ✓ | ✓ | Custom |
| SEO Maintenance | ✓ | ✓ | ✓ |
| Google Analytics | ✓ | ✓ | Dashboard |
| Mobile Optimisation | ✓ | ✓ | ✓ |
| Booking System | — | ✓ | ✓ |
| Appointment Scheduling | — | ✓ | ✓ |
| Calendar Integration | — | ✓ | ✓ |
| Payment Gateway | — | ✓ | ✓ |
| Customer Dashboard | — | ✓ | ✓ |
| Admin Dashboard | — | ✓ | ✓ |
| Lead Management | — | ✓ | ✓ |
| CRM Integration | — | — | ✓ |
| API Integrations | — | — | ✓ |
| Blog & CMS | — | — | ✓ |
| Complete Copywriting | — | — | ✓ |

### Website Care — twelve rows

| Feature | Care | Manage ⭐ | Grow |
| --- | --- | --- | --- |
| Security Updates | ✓ | ✓ | ✓ |
| Plugin Updates | ✓ | ✓ | ✓ |
| Website Backups | ✓ | ✓ | ✓ |
| Performance Monitoring | ✓ | ✓ | ✓ |
| Technical Support | ✓ | ✓ | Priority |
| Content Updates | — | ✓ | Unlimited |
| Banner & Image Changes | — | ✓ | ✓ |
| Minor Design Updates | — | ✓ | ✓ |
| Landing Page Updates | — | ✓ | New Pages |
| SEO Maintenance | — | — | ✓ |
| Conversion Optimisation | — | — | ✓ |
| Monthly Website Report | — | — | ✓ |
