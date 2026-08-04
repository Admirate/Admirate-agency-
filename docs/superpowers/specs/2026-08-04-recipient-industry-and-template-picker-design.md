# Recipient industry, and a template picker for the emailer

*2026-08-04*

## Why

The emailer sends one creative to everybody.

`src/components/email/template.ts` is the only template that exists, and both send paths import it by name. The recipients list has no field describing who anyone is — `email_recipients` is `id, email, name, active, created_at` — so there is no way to look at the 77 rows on the list and tell a brokerage from a fit-out contractor, and no way to send the real-estate creative only to the real-estate contacts.

Those two gaps are one gap. Knowing a recipient's industry is only worth the column if the campaign can act on it, and a second template is only worth authoring if it can be aimed. This spec adds both, and the wiring between them.

## What we are building

1. An `industry` field on recipients — typed on the add form, editable inline in the table, detected on spreadsheet import, and filterable.
2. A registry of pre-made HTML templates, chosen from cards in the composer, previewable before sending.
3. An audience selector in the composer that sends a campaign to chosen industries rather than to everyone.

All three survive **Save Draft** and **Schedule**, which is the part that constrains the design.

### Approach

The scheduled path is `src/app/api/cron/send-email/route.ts`. It wakes up, reads the newest `scheduled` row out of `email_drafts`, and sends it — hours after the composer that created it closed. Anything the composer chose has to be recorded on that row or the scheduled send quietly reverts to defaults.

Three options were considered.

**A — persist template and audience on the draft.** Chosen. Two columns on `email_drafts`; the composer writes them, both send routes read them. Send Now and Schedule behave identically, and editing a saved draft restores what it was going to do.

**B — send-time only.** Template and audience live in component state and are passed to `/api/email/send`. No schema change, but Schedule would silently discard both, and a saved draft would forget them. Rejected: it makes Schedule lie.

**C — a new `email_campaigns` table.** Campaign records with audience snapshots and per-recipient send logs. Rejected as out of scope — worth revisiting if "who did we send what to" ever becomes a question, but it replaces the emailer rather than extending it.

## Data

One migration, `supabase/migrations/0007_recipient_industry_and_campaign_template.sql`:

```sql
ALTER TABLE email_recipients
  ADD COLUMN IF NOT EXISTS industry TEXT;

ALTER TABLE email_drafts
  ADD COLUMN IF NOT EXISTS template_id TEXT,
  ADD COLUMN IF NOT EXISTS industries  TEXT[] NOT NULL DEFAULT '{}';
```

All three are additive and nullable-or-defaulted, in the same shape as `0006_wizard_fields.sql`, so every existing row keeps working untouched.

| Column | Meaning of the empty value |
| --- | --- |
| `email_recipients.industry` | `NULL` — Unassigned. Still sendable. |
| `email_drafts.template_id` | `NULL` — the default template. |
| `email_drafts.industries` | `'{}'` — everyone active. Today's behaviour. |

The empty value is today's behaviour in all three cases. That is deliberate: the 77 existing recipients and every existing draft keep sending exactly as they do now without a backfill.

`src/types/database.ts` gains the matching fields on the `Row`, `Insert` and `Update` shapes for both tables.

**Applying it.** The Supabase MCP server is not authorised in this environment and the base tables were never captured as migrations — `supabase/migrations/` starts at `0001_brief_fields.sql`, so `email_recipients` and `email_drafts` were created outside it. The migration file is written to the repo; running it against the project is a manual step for whoever holds the Supabase credentials.

## Industries

A code-side constant, `src/lib/industries.ts`:

```ts
export const INDUSTRIES = [
  { id: "real-estate-brokerage", label: "Real Estate — Brokerage" },
  { id: "real-estate-developer", label: "Real Estate — Developer" },
  { id: "interior-fitout",       label: "Interior Design & Fit-out" },
  { id: "construction",          label: "Construction" },
  { id: "hospitality",           label: "Hospitality" },
  { id: "retail-fnb",            label: "Retail & F&B" },
  { id: "healthcare-wellness",   label: "Healthcare & Wellness" },
  { id: "professional-services", label: "Professional Services" },
  { id: "technology",            label: "Technology" },
  { id: "other",                 label: "Other" },
] as const;
```

The column stores the `id`, never the label, so a label can be reworded without a data migration.

Nothing enforces the set at the database level. The API validates against it and coerces anything unrecognised to `NULL`; an id retired later degrades to Unassigned in the UI instead of breaking a query. A `CHECK` constraint would instead make retiring an id a migration, and would fail an import mid-flight rather than skipping one field of one row.

**A second list already exists.** `src/lib/brief.ts` exports `INDUSTRIES` — nine plain label strings — for the `/start-project` wizard's chips, stored as labels on `contact_submissions.industry`. It is deliberately not reused here. The wizard's list is a customer describing themselves in a public form, where "Real Estate" is the right granularity; this list is us segmenting an outbound campaign, where the brokerage/developer split is the whole point. Sharing one constant would mean either coarsening the targeting or putting internal segmentation vocabulary in front of prospects. The duplication is small, both lists are one screenful, and neither reads the other.

## Recipients page

### Table

`src/components/dashboard/RecipientsTable.tsx` gains an **Industry** column between Email and Status. Its `Recipient` type gains `industry: string | null`.

The cell is an inline `<select>`, not read-only text. Assigning industries to 77 existing contacts has to be 77 clicks and no dialogs, or it will not happen. Changing it fires a `PATCH` and updates optimistically, the same pattern `onToggleActive` already uses. Unassigned renders as muted placeholder text.

### Add form

A third control beside Name and Email, defaulting to Unassigned. The row is `flex-col sm:flex-row` today and stays that way; three fields plus a button is wide, and the existing stack handles it on small screens.

### Filtering

A second `<select>` beside the All/Active/Paused one, offering All industries, each industry, and Unassigned.

`filterRecipients` in `src/lib/recipient-list.ts` grows an `industry` key beside `query` and `status`. Its `Filterable` type gains `industry?: string | null`, so existing callers and tests stay valid.

Free-text search continues to match name and email only. Industry has its own control; folding it into the search box would make "Showing 14 of 77" ambiguous about which control produced the 14.

The stat tiles stay Total / Active / Paused. A per-industry breakdown belongs where an audience is being chosen, which is the composer.

### Spreadsheet import

`src/lib/recipient-sheet.ts` already sniffs the name and email columns and reports what it skipped. Industry gets the same treatment:

- **Column detection.** Headers matching `Industry`, `Sector`, `Category`, `Vertical`, `Type` or `Business Type`, scored like `nameHeaderScore` does, so the most specific label wins over the leftmost.
- **Value matching.** Case-insensitive, punctuation- and whitespace-insensitive comparison against both the id and the label, plus a small alias table (`realtor`, `broker`, `brokerage`, `property` → `real-estate-brokerage`; `developer`, `development` → `real-estate-developer`; `fitout`, `fit out`, `interiors` → `interior-fitout`; and so on).
- **No match.** `null`. Never a skipped row — a recipient with an unreadable industry is still a recipient, and rejecting the row would lose an address over a field that was optional to begin with.

`ParsedRecipient` gains `industry: string | null`. `SheetParseResult` gains `withIndustry: number`, and the import preview prints a line — "48 of 60 matched an industry" — so a mis-detected column is visible before anything is written. The existing four-row sample gains the industry label.

### API

`src/app/api/email/recipients/route.ts`:

- `POST` accepts `industry`, validates it against `INDUSTRIES`, stores `null` otherwise.
- `PATCH` currently takes `{ id | ids, active }`. It gains an `industry` branch: when `industry` is present it updates that instead, with the same id/ids targeting, so bulk industry assignment is available without new endpoints. `active` stays required only when `industry` is absent.
- `GET` is unchanged — it already selects `*`.

`src/app/api/email/recipients/bulk/route.ts` re-validates each row's industry against the list and coerces unknown values to `null`, alongside the email re-validation it already does. The client parser is not the authority.

## Templates

### Registry

`src/components/email/templates/`, one module per template, each exporting:

```ts
export type EmailTemplateModule = {
  id: string;          // stable — this is what lands on the draft
  name: string;        // "Dubai Campaign — Real Estate"
  description: string; // one line, under the thumbnail
  thumbnail: string;   // /email-templates/<id>.jpg, from public/
  render: (props: { subject: string; body: string }) => string;
};
```

`templates/index.ts` exports the array and `getTemplate(id: string | null)`, which returns the default when the id is `null` or unknown. That fallback is what keeps an already-scheduled draft sending after a template is renamed or removed.

### Extracting the shell

The existing creative moves to `templates/campaign-dubai.ts` as the first registry entry, with byte-identical output. Its shared parts move to `templates/shell.ts`:

- `esc` and `preheader`
- the `<head>` block — the Outlook conditional comments, `x-apple-disable-message-reformatting`, the `color-scheme` declarations and the `@media` rules
- the outer table wrapper and the legal footer

A new template is then a slice list and a body, not two hundred lines of re-derived Outlook trivia. This is the one refactor in the spec, and it is what makes the second template cheap rather than a copy-paste that drifts.

The long comment block explaining why the creative is flat artwork rather than live text travels with it. That reasoning is about this template's design, so it belongs to this template; the shell's comments cover only what the shell does.

`src/components/email/template.ts` remains as a one-line re-export of `campaign-dubai`'s render function under the name `EmailTemplate`, so nothing importing it breaks mid-change. The send routes stop using it. It can be deleted once nothing does.

**Thumbnails.** No new image files. A template's `thumbnail` is its own first slice, already hosted in the `emailer` bucket, passed through Next's image optimizer with the existing `optimized()` helper from `src/lib/cdn.ts` — `optimized(emailerAsset("creative-1-story.jpg"), 384)`. The Supabase host is already in `next.config.ts` `remotePatterns`, and 384 is one of Next's default `imageSizes`, so this needs no configuration.

The slices are tall strips, so the card crops with `object-cover object-top` in a fixed-height box: the top of the creative is what identifies it. A thumbnail that fails to load leaves the card's neutral background and the name and description, which is enough to pick from — a broken image must not stop the picker working.

### Preview

`GET /api/email/preview?template=<id>&subject=…&body=…`, admin-gated with `requireAdmin` like every other dashboard route, returning the rendered HTML with `Content-Type: text/html`.

The Preview button opens it in a new tab. It renders through the same `getTemplate(id).render()` the send routes call, with the subject and preheader currently in the composer, so what is on screen is what Resend will be handed — not a mockup of it.

The composer truncates `body` to 200 characters before putting it in the query string. Nothing is lost: `preheader()` already cuts it at 140 for display, and the body is not otherwise rendered by the current template. This keeps a long draft from producing a URL that a browser or proxy will refuse.

### Adding a template later

One file in `templates/`, one line in `index.ts`, one thumbnail in `public/email-templates/`. No database write, no dashboard screen, no deploy configuration.

## Composer

`src/app/dashboard/emailer/page.tsx`.

**Template**, above Subject: a horizontally scrolling row of cards, each a thumbnail, name and description, the selected one ringed in `brand`. A Preview button sits beside the section heading.

**Audience**, below Body: the industries as toggle chips plus an Everyone chip. Each chip carries its live count of *active* recipients, computed client-side from a `GET /api/email/recipients` the page now makes on mount. Nothing selected means everyone active, which is today's behaviour and therefore the safe default.

The send button reads `Send to 27` or `Send to 14 in Real Estate — Brokerage`, so the size of the blast is on the control being pressed.

`templateId` and `industries` are sent with Save Draft, Schedule and Send Now, and are restored by Edit. The draft cards in the list below gain a quiet line naming the template and the audience, so a saved draft states what it will do rather than only what it says.

## Sending

Both `src/app/api/email/send/route.ts` and `src/app/api/cron/send-email/route.ts` change the same two ways:

1. They stop importing `EmailTemplate` and call `getTemplate(templateId).render({ subject, body })` — `templateId` from the request body in the first case, from the draft row in the second.
2. The recipient query gains `.in("industry", industries)` when `industries` is non-empty, on top of the existing `.eq("active", true)`.

`/api/email/send` validates `industries` against `INDUSTRIES` and drops unknown ids. The cron route does not need to — it reads what the API already validated on the way in — but it applies the same `getTemplate` fallback, because a template can be removed between scheduling and sending.

An audience matching zero active recipients is a 400 with a message naming the industries, not a silent success. The existing "No active recipients found" error already covers the everyone case; this extends it.

Sending remains one `sendCampaign` call with a `to` array, unchanged. Segmentation narrows that array; it does not split the send into several.

## Error handling

| Situation | Behaviour |
| --- | --- |
| `template_id` names a removed template | Falls back to the default template. Never a failed send. |
| An audience id is not in `INDUSTRIES` | Dropped from the filter. Remaining ids still apply. |
| An audience matches zero active recipients | 400, naming the industries. Nothing is sent, nothing is marked sent. |
| Import row has an unreadable industry | Imported with `industry: null`. Counted in the preview's matched total. |
| Import sheet has no industry column | Every row imports as Unassigned. No warning — the column is optional. |

## Testing

`tests/` holds plain `.mjs` test files over the pure modules; the dashboard's React is untested there and stays that way. New coverage:

- `recipient-sheet` — industry column detection under several header spellings, alias matching, no-column and no-match cases, and that a bad industry never drops a row.
- `recipient-list` — `filterRecipients` with the new `industry` key, including Unassigned, and that existing two-key callers are unaffected.
- `getTemplate` — known id, unknown id, `null`, all returning a renderable module.
- Audience-to-query translation — empty array means no `.in` clause; a populated one filters; unknown ids are dropped.
- Template render — every registry entry produces a string containing the escaped subject and the legal footer, which catches a new template that forgot the shell.

## Out of scope

- Per-recipient send logs, open tracking, and click tracking.
- Editing template HTML from the dashboard.
- Backfilling industries onto the existing 77 rows automatically. They become Unassigned and are assigned inline or by re-import.
- Any change to the `/start-project` wizard or `contact_submissions`.
