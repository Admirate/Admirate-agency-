# Dashboard design system, and a Recipients list that scales

*2026-07-31*

## Why

Two problems, one of them a live bug.

**The dashboard is half-migrated.** The shell in `src/app/dashboard/layout.tsx` is light — `bg-gray-50`, a white sidebar. The pages inside it are not: they still carry cards from an earlier dark theme. `src/app/dashboard/emailer/recipients/page.tsx` has fourteen dark classes, including `text-white` on its `<h1>`, which renders a near-invisible page title against the light background. Emailer and Portfolio carry two each. Submissions and Pricing are already light. Nobody chose "black on white" — it is the residue of a theme change that stopped halfway.

**The palette is off-brand.** The dashboard uses `#FF0D0D` in 54 places. The brand red, declared in every public page's stylesheet, is `#E3001B`. The public site already defines a full palette that the dashboard has never used:

| Token   | Value     | Role                        |
| ------- | --------- | --------------------------- |
| `white` | `#FFFFFF` | Card surfaces               |
| `paper` | `#FAFAF8` | Cool off-white              |
| `warm`  | `#FBF7F1` | Warm off-white — app canvas |
| `ink`   | `#0B0B0C` | Body and heading text       |
| `grey`  | `#8A8A8E` | Secondary text              |
| `line`  | `#E9E9E6` | Hairline borders            |
| `red`   | `#E3001B` | Brand accent                |

Separately, the Recipients list is a flat stack of cards with no search and no bulk operations. That was tolerable at three rows. A spreadsheet import now puts fifty on it, and removing them means fifty individual clicks.

## What we are building

A small token-and-component layer for the dashboard, applied across all five pages, and a rebuilt Recipients page with search, multi-select and bulk delete.

### Approach

Three options were considered.

**A — component layer only.** Build shared components but keep arbitrary Tailwind values inside them. Rejected: hardcoded hex is precisely how 54 off-brand reds accumulated.

**B — tokens only.** Add brand tokens as utilities and restyle each page in place. Rejected: the five pages already duplicate card, button and input markup, so every later change is five edits and the duplication is what lets them drift apart.

**C — tokens and a thin component layer.** Chosen. Tokens make the palette first-class; the component layer absorbs markup the pages already repeat. Net line count falls.

### Tokens

A `@theme` block in `src/app/globals.css`, which is on Tailwind v4:

```css
@theme {
  --color-warm:  #FBF7F1;
  --color-paper: #FAFAF8;
  --color-ink:   #0B0B0C;
  --color-muted: #8A8A8E;
  --color-line:  #E9E9E6;
  --color-brand: #E3001B;
}
```

This yields `bg-warm`, `text-ink`, `border-line`, `bg-brand` and so on. `paper`
is not used by any screen in this spec; it is declared anyway so the palette
lives complete in one place, because a partial one is an invitation to hardcode
whichever value is missing.

That file carries a standing instruction to stay minimal, because the public pages inject their own complete stylesheets at mount and anything global competes with them. `@theme` is safe against it: it emits custom properties and utility class definitions only, and sets no element styles. Nothing it adds applies to an element unless a class asks for it, and the public pages use none of these classes.

The surface treatment is warm paper with hairline borders — app canvas `warm`, cards `white`, 1px `line` borders, no shadows. It matches the public site, so the dashboard reads as the same brand, and it keeps red rare enough to carry meaning.

### Components

New, under `src/components/dashboard/ui/`. Each is presentational, takes props, holds no fetch logic.

| Component       | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `Card`          | White surface, hairline border, consistent radius and padding   |
| `Button`        | `primary` (brand fill), `ghost`, `danger`; `sm`/`md`; loading   |
| `Input`         | Text and search fields, with an optional leading icon           |
| `Badge`         | Status pills — active, paused, counts                           |
| `PageHeader`    | Title, optional description, actions slot                       |
| `StatTile`      | Label and value, tabular numerals                               |
| `EmptyState`    | Icon, title, body, optional action                              |
| `Skeleton`      | Pulsing placeholder rows for loading                            |
| `ConfirmDialog` | Modal with cancel and confirm; confirm may be `danger`          |

And one composite, `src/components/dashboard/RecipientsTable.tsx`, holding the table and its selection behaviour.

### Recipients page

Top to bottom: page header; three stat tiles (Total, Active, Paused); the existing add-recipient form and spreadsheet importer, restyled onto `Card`; then the list.

The list gains a toolbar that sticks to the top of the viewport as the table scrolls, carrying:

- a search field, filtering on name and email together
- a status filter — All, Active, Paused
- a count, reading `showing X of Y`
- **Delete all**, styled `danger` and set apart from the other controls

**Delete all always means the entire list, never the filtered view.** To keep
that from being ambiguous, the button is disabled whenever a search or status
filter is active, with the reason given on hover: *"Clear the filter to delete
all."* Deleting a subset is what select-all and Delete selected are for. The
alternative — letting the same button mean "all fifty" or "these three"
depending on a filter set several scrolls above it — is how people destroy data
they meant to keep.

The table has a select-all checkbox in its header, then Name, Email, Status and per-row actions. Select-all applies to the **currently filtered rows**, not the whole list — selecting all while a search is active and then deleting must not remove rows the user cannot see.

When one or more rows are selected, a bar appears with the selection count and Activate, Deactivate and Delete.

### Confirmation

Delete all and Delete selected both raise a `ConfirmDialog`. The message states the number: *"Delete all 50 recipients? This cannot be undone."* The count belongs in the sentence so it is in front of the user at the moment of the click.

Single-row delete keeps its current behaviour and raises no dialog.

### API changes

`src/app/api/email/recipients/route.ts` handles one record at a time. Both handlers gain bulk shapes, and both keep the existing single-record shapes working unchanged, since the composer and the row actions still use them.

`DELETE` accepts exactly one of:

| Body               | Effect                                  |
| ------------------ | --------------------------------------- |
| `{ id }`           | Deletes one. Unchanged.                 |
| `{ ids: [...] }`   | Deletes that set.                       |
| `{ all: true }`    | Deletes every recipient.                |

`all` is an explicit flag rather than a client-supplied list of every id. A request to empty the table should say so, so the server can recognise the intent, and so a truncated or partially built id list cannot silently delete the wrong subset.

`PATCH` accepts `{ id, active }` as now, and additionally `{ ids: [...], active }` for bulk activate and deactivate.

Both bulk paths validate that the array is non-empty and contains strings, and return the number affected. Both remain behind the existing `requireAdmin()` check.

### Pure logic

Search, filtering and selection reducers go in `src/lib/recipient-list.ts` as pure functions over plain arrays — the same shape as `src/lib/recipient-sheet.ts`, and testable under `node:test` without React.

Exports: `filterRecipients(rows, { query, status })`, `countByStatus(rows)`, and selection helpers `toggle`, `selectAll`, `clear` operating on a `Set` of ids.

### Motion

Framer Motion is already a dependency. Three uses, no more:

- table rows stagger in once on first load
- the selection bar slides up as it enters
- skeletons pulse while loading

All of it sits behind `prefers-reduced-motion: reduce`.

### The other four pages

- **Submissions** — already light. Takes tokens, `PageHeader`, stat tiles (new / this week / total), and real empty and loading states. It has a `search` state already, which moves to the shared `Input`.
- **Emailer** — tokens, `PageHeader`, restyled composer and drafts list on `Card`. **No stat tiles.** A composer has no metric worth a tile beyond draft count, and inventing one would be decoration.
- **Portfolio** — tokens, header, empty and loading states, two dark classes removed.
- **Pricing** — already light. Tokens and header only.

### Build order

1. Tokens and the component layer, with nothing consuming them yet.
2. The `recipient-list.ts` helpers and their tests.
3. The API bulk shapes.
4. Recipients — the largest change, and the one that exercises every primitive.
5. Emailer.
6. Submissions, Portfolio, Pricing — largely colour, headers and empty states.

Recipients comes before the remaining pages deliberately: it is the page that
will expose anything missing from the component layer, and finding that out
after four other pages are already built on it is expensive.

## Testing

`tests/recipient-list.test.mjs`, following the existing `node:test` convention:

- search matches on name and on email, case-insensitively
- status filter returns the right subsets, and combines with search
- `countByStatus` is correct across an empty list, all-active, and mixed
- select-all over a filtered view selects only the visible rows
- toggling a selected row deselects it

The API bulk paths get no automated test — the suite has no HTTP-route harness and building one is out of scope here. They are verified by hand: delete two selected rows, delete all, bulk deactivate.

## Out of scope

- Pagination or virtualised scrolling. Fifty rows do not need it; revisit past a few hundred.
- Undo for deletion. Rejected during design as riskier than a confirm dialog.
- ~~Any change to the login page.~~ Brought into scope during execution: leaving it on the old red made the first screen anyone sees the only off-brand one, and it contradicted the plan's own no-#FF0D0D gate.
- The five pre-existing unrelated test failures in `tests/` (sitemap, client-grid, llms, footers, crawler). They fail on `main` without any change from this work and are tracked separately.

## Risks

**The palette swap touches 54 call sites.** Mechanical, but a missed one shows as the wrong red. Mitigated by grepping for `FF0D0D` at the end and expecting zero hits.

**Sticky toolbar inside a scrolling main.** `src/app/dashboard/layout.tsx` puts content in `<main>` with `lg:ml-[270px]`. `position: sticky` resolves against the nearest scrolling ancestor, so this needs checking against the real layout at both breakpoints rather than assumed.

**Select-all semantics.** The filtered-only rule is the whole guard against deleting invisible rows. It needs a test, and it has one.
