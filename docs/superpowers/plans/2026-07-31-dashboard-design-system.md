# Dashboard Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-07-31-dashboard-design-system-design.md`

**Goal:** Put every dashboard page on the ADMIRATE brand palette through a shared component layer, and rebuild the Recipients page with search, multi-select and bulk delete so a fifty-row imported list is workable.

**Architecture:** Brand colours become Tailwind v4 `@theme` tokens in `src/app/globals.css`, so `bg-warm` and `text-ink` are real utilities rather than hardcoded hex. A presentational component layer under `src/components/dashboard/ui/` absorbs the card, button, input and badge markup the five pages currently duplicate. Recipients' search, filter and selection logic lives in `src/lib/recipient-list.ts` as pure functions over plain arrays, mirroring the existing `src/lib/recipient-sheet.ts`, so it is testable under Node with no React. The recipients API gains bulk shapes alongside its existing single-record ones.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, Supabase, Node's built-in test runner.

## Global Constraints

- **Brand palette, exact values.** `warm #FBF7F1`, `paper #FAFAF8`, `ink #0B0B0C`, `muted #8A8A8E`, `line #E9E9E6`, `brand #E3001B`. No other greys or reds are introduced.
- **`#FF0D0D` must not survive.** It is the wrong red, currently in 54 places. `grep -r "FF0D0D" src/` returns nothing when this plan is done.
- **Surface treatment:** app canvas `warm`, cards `white`, 1px `border-line`, **no shadows**.
- **`src/app/globals.css` stays minimal.** Add the `@theme` block and nothing else. The public pages inject their own complete stylesheets at mount and any global element rule competes with them. `@theme` emits only custom properties and utility definitions, which is why it is safe.
- **Components under `src/components/dashboard/ui/` are presentational.** Props in, markup out. No `fetch`, no `toast`, no route knowledge.
- **All motion sits behind `prefers-reduced-motion: reduce`.**
- **Delete all means the entire list, never the filtered view.** Its button is disabled whenever a search or status filter is active.
- **Select-all applies to currently filtered rows only.**
- **This repo has no React test harness.** Only `node:test` over pure modules. UI tasks are therefore verified by `npx tsc --noEmit`, `npm run build`, and the explicit manual checks written into each task. Do not invent a test framework.
- **Existing API request shapes keep working.** `{ id }` for DELETE and `{ id, active }` for PATCH are still used by row actions.

### Class mapping — the one reference for every restyle task

Tasks 1 and 6–9 all convert the same classes. Use this table rather than
judgement, so five pages cannot end up with five interpretations.

| Old | New |
| --- | --- |
| `bg-gray-50` | `bg-warm` |
| `bg-neutral-900`, `bg-neutral-800`, `bg-black` | `bg-white` |
| `bg-neutral-800/40`, `bg-neutral-700` | `bg-warm` |
| `border-gray-200`, `border-gray-100` | `border-line` |
| `border-neutral-800`, `border-neutral-700` | `border-line` |
| `text-white` (on a light surface) | `text-ink` |
| `text-gray-900`, `text-neutral-200`, `text-neutral-300` | `text-ink` |
| `text-gray-600`, `text-gray-500`, `text-gray-400` | `text-muted` |
| `text-neutral-400`, `text-neutral-500`, `text-neutral-600` | `text-muted` |
| `hover:bg-gray-100`, `hover:bg-neutral-700` | `hover:bg-warm` |
| `bg-red-600`, `hover:bg-red-700` | `bg-brand`, `hover:bg-brand/90` |
| `text-red-400`, `bg-red-500/10` | `text-brand`, `bg-brand/5` |
| `focus:ring-red-500` | `focus:ring-brand/25` |
| `#FF0D0D` anywhere | `brand` token, or `#E3001B` in an inline style |
| `shadow-sm`, `shadow`, `shadow-md` | delete — the treatment is borders, not shadows |

Green and yellow status colours (`text-green-400`, `bg-yellow-500/10` and
friends) are **not** in the palette. Replace them with `Badge` tones: active
state uses `tone="active"`, paused uses `tone="paused"`, and counts use
`tone="neutral"`.

## Pre-existing failures — do not try to fix

`node --test tests/*.test.mjs` has **five failures on `main` that predate this work**: sitemap-catalog, client-grid-renderer, llms-catalog, sitemap-http, services-overview-mobile-labels. They are unrelated to the dashboard and out of scope. When a task says "run the suite", the bar is *no new failures*, not a green suite. Confirm the count is still five.

---

## File Structure

**Created:**

| File | Responsibility |
| --- | --- |
| `src/components/dashboard/ui/Card.tsx` | White surface, hairline border, padding |
| `src/components/dashboard/ui/Button.tsx` | `primary`/`ghost`/`danger`, `sm`/`md`, loading, disabled |
| `src/components/dashboard/ui/Input.tsx` | Text and search fields, optional leading icon |
| `src/components/dashboard/ui/Badge.tsx` | Status pills |
| `src/components/dashboard/ui/PageHeader.tsx` | Title, description, actions slot |
| `src/components/dashboard/ui/StatTile.tsx` | Label and value, tabular numerals |
| `src/components/dashboard/ui/EmptyState.tsx` | Icon, title, body, optional action |
| `src/components/dashboard/ui/Skeleton.tsx` | Pulsing placeholder block and row |
| `src/components/dashboard/ui/ConfirmDialog.tsx` | Modal, cancel + confirm, danger variant |
| `src/components/dashboard/ui/index.ts` | Barrel export |
| `src/components/dashboard/RecipientsTable.tsx` | Table, checkboxes, row actions |
| `src/lib/recipient-list.ts` | Pure search / filter / count / selection |
| `tests/recipient-list.test.mjs` | Tests for the above |

**Modified:** `src/app/globals.css`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/emailer/page.tsx`, `src/app/dashboard/emailer/recipients/page.tsx`, `src/app/dashboard/portfolio/page.tsx`, `src/app/dashboard/pricing/page.tsx`, `src/app/api/email/recipients/route.ts`.

---

## Task 1: Brand tokens and palette swap

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/dashboard/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities `bg-warm`, `bg-paper`, `text-ink`, `text-muted`, `border-line`, `bg-brand`, `text-brand`, `border-brand` — and every colour variant Tailwind generates from a `--color-*` token. All later tasks use these names.

- [ ] **Step 1: Add the theme block to `src/app/globals.css`**

Append below the existing `* { box-sizing: border-box; }` rule:

```css
/* ADMIRATE brand palette, the same values the public pages declare in their
   own injected stylesheets. Only the dashboard consumes these utilities.

   @theme is safe in this file despite the "stay minimal" note above: it emits
   custom properties and utility class definitions only, and styles no element
   on its own. The public pages use none of these classes, so nothing here can
   compete with the stylesheets they inject at mount.

   `paper` is unused by any current screen. It is declared so the palette lives
   complete in one place — a partial one is an invitation to hardcode whichever
   value is missing, which is how 54 off-brand reds accumulated. */
@theme {
  --color-warm: #fbf7f1;
  --color-paper: #fafaf8;
  --color-ink: #0b0b0c;
  --color-muted: #8a8a8e;
  --color-line: #e9e9e6;
  --color-brand: #e3001b;
}
```

- [ ] **Step 2: Verify the utilities compile**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds. If `bg-warm` is not recognised later, the `@theme` block is in the wrong file or Tailwind v4 is not picking up `globals.css`.

- [ ] **Step 3: Swap the layout's colours**

In `src/app/dashboard/layout.tsx` make exactly these replacements:

| Find | Replace |
| --- | --- |
| `bg-gray-50` | `bg-warm` |
| `bg-white border-b border-gray-200` (header) | `bg-white border-b border-line` |
| `bg-white border-r border-gray-200` (aside) | `bg-white border-r border-line` |
| `border-gray-100` | `border-line` |
| `text-gray-900` | `text-ink` |
| `text-gray-600`, `text-gray-500` | `text-muted` |
| `text-gray-400` | `text-muted` |
| `hover:bg-gray-100` | `hover:bg-warm` |
| `#FF0D0D` (every occurrence) | `#E3001B` |

Then replace the remaining literal `#E3001B` utilities with tokens: `bg-[#E3001B]/8` → `bg-brand/8`, `text-[#E3001B]` → `text-brand`, `hover:text-[#E3001B]` → `hover:text-brand`, `hover:bg-[#E3001B]/5` → `hover:bg-brand/5`.

Also update the `Toaster` `toastOptions.style` to:

```tsx
style: {
  background: "#FFFFFF",
  color: "#0B0B0C",
  border: "1px solid #E9E9E6",
  borderRadius: "12px",
  fontSize: "14px",
  boxShadow: "none",
},
```

Hex is correct here rather than tokens — this object is inline style passed to a third-party component, not a class list.

- [ ] **Step 4: Verify no off-brand red remains in the layout**

Run: `grep -c "FF0D0D" src/app/dashboard/layout.tsx`
Expected: `0`

- [ ] **Step 5: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/dashboard/layout.tsx
git commit -m "Add brand palette tokens and apply them to the dashboard shell

The dashboard used #FF0D0D, which is not the brand red; #E3001B is, and
the public pages have declared a full palette all along that the
dashboard never used. Tokens make the values utilities so the next page
cannot quietly reintroduce a hex literal.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Presentational primitives

**Files:**
- Create: `src/components/dashboard/ui/Card.tsx`, `Button.tsx`, `Input.tsx`, `Badge.tsx`, `PageHeader.tsx`, `StatTile.tsx`, `EmptyState.tsx`, `Skeleton.tsx`, `index.ts`

**Interfaces:**
- Consumes: the tokens from Task 1.
- Produces:
  - `<Card className?>{children}</Card>`
  - `<Button variant="primary"|"ghost"|"danger" size="sm"|"md" loading?:boolean {...ButtonHTMLAttributes}>`
  - `<Input icon?:ReactNode {...InputHTMLAttributes}>`
  - `<Badge tone="neutral"|"active"|"paused"|"brand">{children}</Badge>`
  - `<PageHeader title:string description?:string actions?:ReactNode />`
  - `<StatTile label:string value:number|string hint?:string />`
  - `<EmptyState icon?:ReactNode title:string body?:string action?:ReactNode />`
  - `<Skeleton className?:string />` and `<SkeletonRows count:number />`

- [ ] **Step 1: Create `src/components/dashboard/ui/Card.tsx`**

```tsx
import type { ReactNode } from "react";

/**
 * The dashboard's one surface.
 *
 * White on the warm canvas with a hairline border and no shadow — the same
 * treatment the public pages use, so the admin reads as the same brand rather
 * than as a separate product.
 */
const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border border-line rounded-xl ${className}`}
  >
    {children}
  </div>
);

export default Card;
```

- [ ] **Step 2: Create `src/components/dashboard/ui/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md";

/**
 * `danger` is deliberately distinct from `primary` despite both being red-ish:
 * primary is the brand fill used for the ordinary forward action, danger is
 * outlined and reserved for destruction, so "Send" and "Delete all" can never
 * be mistaken for one another at a glance.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand/90 border border-transparent",
  ghost: "bg-white text-ink border border-line hover:bg-warm",
  danger: "bg-white text-brand border border-brand/40 hover:bg-brand/5",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: Props) => (
  <button
    // A loading button is disabled: the guard belongs on the element rather
    // than on every call site, because a double-submit is a duplicate row.
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
```

- [ ] **Step 3: Create `src/components/dashboard/ui/Input.tsx`**

```tsx
import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

const Input = ({ icon, className = "", ...rest }: Props) => (
  <div className="relative flex-1 min-w-0">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
        {icon}
      </span>
    )}
    <input
      className={`w-full ${icon ? "pl-9" : "pl-4"} pr-4 py-2.5 bg-white border border-line rounded-lg text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors ${className}`}
      {...rest}
    />
  </div>
);

export default Input;
```

- [ ] **Step 4: Create `src/components/dashboard/ui/Badge.tsx`**

```tsx
import type { ReactNode } from "react";

type Tone = "neutral" | "active" | "paused" | "brand";

const TONES: Record<Tone, string> = {
  neutral: "bg-warm text-muted border-line",
  active: "bg-brand/5 text-brand border-brand/20",
  paused: "bg-warm text-muted border-line",
  brand: "bg-brand text-white border-transparent",
};

const Badge = ({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap ${TONES[tone]}`}
  >
    {children}
  </span>
);

export default Badge;
```

- [ ] **Step 5: Create `src/components/dashboard/ui/PageHeader.tsx`**

```tsx
import type { ReactNode } from "react";

const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted mt-1 max-w-2xl">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
```

- [ ] **Step 6: Create `src/components/dashboard/ui/StatTile.tsx`**

```tsx
import Card from "./Card";

/**
 * `tabular-nums` matters more than it looks: without it the counts jitter
 * horizontally as they change, which reads as the page flickering.
 */
const StatTile = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) => (
  <Card className="px-5 py-4">
    <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
      {label}
    </p>
    <p className="text-2xl font-bold text-ink mt-1 tabular-nums">{value}</p>
    {hint && <p className="text-xs text-muted mt-0.5">{hint}</p>}
  </Card>
);

export default StatTile;
```

- [ ] **Step 7: Create `src/components/dashboard/ui/EmptyState.tsx`**

```tsx
import type { ReactNode } from "react";

const EmptyState = ({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-16">
    {icon && (
      <div className="w-12 h-12 rounded-full bg-warm border border-line flex items-center justify-center text-muted mb-4">
        {icon}
      </div>
    )}
    <p className="text-sm font-semibold text-ink">{title}</p>
    {body && <p className="text-sm text-muted mt-1 max-w-sm">{body}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
```

- [ ] **Step 8: Create `src/components/dashboard/ui/Skeleton.tsx`**

```tsx
/**
 * `motion-reduce:animate-none` rather than a JS check: the pulse is decoration,
 * and Tailwind's variant costs nothing at runtime.
 */
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-line/60 rounded animate-pulse motion-reduce:animate-none ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonRows = ({ count }: { count: number }) => (
  <div className="space-y-2" role="status" aria-label="Loading">
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 bg-white border border-line rounded-xl px-5 py-4"
      >
        <Skeleton className="h-4 w-4 shrink-0" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    ))}
  </div>
);

export default Skeleton;
```

- [ ] **Step 9: Create `src/components/dashboard/ui/index.ts`**

```ts
export { default as Card } from "./Card";
export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Badge } from "./Badge";
export { default as PageHeader } from "./PageHeader";
export { default as StatTile } from "./StatTile";
export { default as EmptyState } from "./EmptyState";
export { Skeleton, SkeletonRows } from "./Skeleton";
export { default as ConfirmDialog } from "./ConfirmDialog";
```

`ConfirmDialog` does not exist yet — Task 3 creates it. Write the line now anyway and expect Step 10 to fail until Task 3 lands; that failure is the reminder.

- [ ] **Step 10: Typecheck**

Run: `npx tsc --noEmit`
Expected: FAILS with a missing-module error for `./ConfirmDialog`. That is correct at this point. Comment out the last line of `index.ts`, re-run to confirm everything else compiles clean, then restore it.

- [ ] **Step 11: Commit**

```bash
git add src/components/dashboard/ui
git commit -m "Add presentational primitives for the dashboard

The five dashboard pages each hand-roll the same card, button, input and
badge markup, which is what let them drift into two different themes.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: ConfirmDialog

**Files:**
- Create: `src/components/dashboard/ui/ConfirmDialog.tsx`

**Interfaces:**
- Consumes: `Button` from Task 2.
- Produces: `<ConfirmDialog open:boolean title:string message:string confirmLabel?:string danger?:boolean busy?:boolean onConfirm:() => void onCancel:() => void />`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useEffect } from "react";
import Button from "./Button";

/**
 * A blocking confirm for destructive actions.
 *
 * The count belongs in `message` at the call site, not here — "Delete all 50
 * recipients?" puts the number in front of the person at the moment they
 * click, which is the only moment it can still change their mind.
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  // Escape closes, and the page behind is locked so a scroll gesture over the
  // scrim does not move the list the dialog is asking about.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm bg-white border border-line rounded-xl p-6">
        <h2 id="confirm-title" className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p className="text-sm text-muted mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
```

- [ ] **Step 2: Restore the barrel export if it was commented out in Task 2 Step 10**

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/ui/ConfirmDialog.tsx src/components/dashboard/ui/index.ts
git commit -m "Add ConfirmDialog for destructive dashboard actions

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: Recipient list logic (TDD)

**Files:**
- Create: `src/lib/recipient-list.ts`
- Test: `tests/recipient-list.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type RecipientStatus = "all" | "active" | "paused"`
  - `filterRecipients<T extends { name: string; email: string; active: boolean }>(rows: T[], opts: { query?: string; status?: RecipientStatus }): T[]`
  - `countByStatus(rows: { active: boolean }[]): { total: number; active: number; paused: number }`
  - `toggleSelection(selected: Set<string>, id: string): Set<string>`
  - `selectAll(selected: Set<string>, ids: string[]): Set<string>`
  - `clearSelection(): Set<string>`
  - `allSelected(selected: Set<string>, ids: string[]): boolean`

- [ ] **Step 1: Write the failing test at `tests/recipient-list.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/recipient-list.ts")).href;

let filterRecipients;
let countByStatus;
let toggleSelection;
let selectAll;
let clearSelection;
let allSelected;

try {
  ({
    filterRecipients,
    countByStatus,
    toggleSelection,
    selectAll,
    clearSelection,
    allSelected,
  } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

const ROWS = [
  { id: "a", name: "Emaar Properties", email: "info@emaar.com", active: true },
  { id: "b", name: "DAMAC Properties", email: "info@damacgroup.com", active: true },
  { id: "c", name: "Nakheel", email: "customercare@nakheel.com", active: false },
];

test("recipient-list exports its functions", () => {
  for (const fn of [
    filterRecipients,
    countByStatus,
    toggleSelection,
    selectAll,
    clearSelection,
    allSelected,
  ]) {
    assert.equal(typeof fn, "function");
  }
});

test("search matches on name, case-insensitively", () => {
  const out = filterRecipients(ROWS, { query: "emaar" });
  assert.deepEqual(out.map((r) => r.id), ["a"]);
});

test("search matches on email too", () => {
  const out = filterRecipients(ROWS, { query: "damacgroup" });
  assert.deepEqual(out.map((r) => r.id), ["b"]);
});

test("an empty or whitespace query returns everything", () => {
  assert.equal(filterRecipients(ROWS, { query: "" }).length, 3);
  assert.equal(filterRecipients(ROWS, { query: "   " }).length, 3);
  assert.equal(filterRecipients(ROWS, {}).length, 3);
});

test("status filters to the right subsets", () => {
  assert.deepEqual(
    filterRecipients(ROWS, { status: "active" }).map((r) => r.id),
    ["a", "b"]
  );
  assert.deepEqual(
    filterRecipients(ROWS, { status: "paused" }).map((r) => r.id),
    ["c"]
  );
  assert.equal(filterRecipients(ROWS, { status: "all" }).length, 3);
});

test("search and status combine", () => {
  const out = filterRecipients(ROWS, { query: "properties", status: "active" });
  assert.deepEqual(out.map((r) => r.id), ["a", "b"]);
});

test("countByStatus is correct when mixed", () => {
  assert.deepEqual(countByStatus(ROWS), { total: 3, active: 2, paused: 1 });
});

test("countByStatus is correct when empty", () => {
  assert.deepEqual(countByStatus([]), { total: 0, active: 0, paused: 0 });
});

test("countByStatus is correct when everything is active", () => {
  const all = [{ active: true }, { active: true }];
  assert.deepEqual(countByStatus(all), { total: 2, active: 2, paused: 0 });
});

test("toggleSelection adds then removes", () => {
  const once = toggleSelection(new Set(), "a");
  assert.deepEqual([...once], ["a"]);
  const twice = toggleSelection(once, "a");
  assert.deepEqual([...twice], []);
});

test("toggleSelection does not mutate its input", () => {
  const before = new Set(["a"]);
  toggleSelection(before, "b");
  assert.deepEqual([...before], ["a"]);
});

test("selectAll selects only the ids it is given", () => {
  // The guard against deleting rows hidden by a filter: the page passes the
  // filtered ids, so select-all can never reach beyond what is on screen.
  const out = selectAll(new Set(), ["a", "b"]);
  assert.deepEqual([...out].sort(), ["a", "b"]);
});

test("selectAll keeps ids already selected outside the given set", () => {
  const out = selectAll(new Set(["c"]), ["a"]);
  assert.deepEqual([...out].sort(), ["a", "c"]);
});

test("allSelected reflects only the given ids", () => {
  assert.equal(allSelected(new Set(["a", "b"]), ["a", "b"]), true);
  assert.equal(allSelected(new Set(["a"]), ["a", "b"]), false);
  assert.equal(allSelected(new Set(["a", "b", "c"]), ["a", "b"]), true);
});

test("allSelected is false for an empty id list", () => {
  // An empty filtered view must not render its header checkbox as ticked.
  assert.equal(allSelected(new Set(["a"]), []), false);
});

test("clearSelection returns an empty set", () => {
  assert.equal(clearSelection().size, 0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/recipient-list.test.mjs`
Expected: FAIL — every test errors because the module does not exist.

- [ ] **Step 3: Write `src/lib/recipient-list.ts`**

```ts
/**
 * Search, filtering, counting and selection for the recipients list.
 *
 * Pure functions over plain arrays, in the same shape as `recipient-sheet.ts`
 * and for the same reason: the list page is a client component, and none of
 * this reasoning should need a browser or React to be tested.
 */

export type RecipientStatus = "all" | "active" | "paused";

type Filterable = { name: string; email: string; active: boolean };

/**
 * Name and email are searched together against one query, rather than offering
 * a field selector. Someone looking for a recipient knows one of the two and
 * should not have to say which.
 */
export function filterRecipients<T extends Filterable>(
  rows: T[],
  opts: { query?: string; status?: RecipientStatus } = {}
): T[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  const status = opts.status ?? "all";

  return rows.filter((r) => {
    if (status === "active" && !r.active) return false;
    if (status === "paused" && r.active) return false;
    if (q === "") return true;
    return (
      r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  });
}

export function countByStatus(rows: { active: boolean }[]): {
  total: number;
  active: number;
  paused: number;
} {
  const active = rows.filter((r) => r.active).length;
  return { total: rows.length, active, paused: rows.length - active };
}

/* The selection helpers all return a new Set rather than mutating: React only
   re-renders on identity change, and a mutated Set would leave the checkboxes
   showing stale state. */

export function toggleSelection(
  selected: Set<string>,
  id: string
): Set<string> {
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/**
 * `ids` is the *filtered* view, never the whole list. That is what stops
 * select-all followed by delete from removing rows the user cannot see.
 */
export function selectAll(
  selected: Set<string>,
  ids: string[]
): Set<string> {
  const next = new Set(selected);
  for (const id of ids) next.add(id);
  return next;
}

export function clearSelection(): Set<string> {
  return new Set();
}

export function allSelected(
  selected: Set<string>,
  ids: string[]
): boolean {
  // An empty view is not "all selected" — the header checkbox must read
  // unticked when a search matches nothing.
  return ids.length > 0 && ids.every((id) => selected.has(id));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/recipient-list.test.mjs`
Expected: PASS, 16 tests.

- [ ] **Step 5: Confirm no new failures across the suite**

Run: `node --test tests/*.test.mjs 2>&1 | grep -cE "^✖ [a-z]"`
Expected: `5` — the pre-existing failures, unchanged.

- [ ] **Step 6: Commit**

```bash
git add src/lib/recipient-list.ts tests/recipient-list.test.mjs
git commit -m "Add pure search, filter and selection helpers for recipients

Selection helpers take the filtered ids rather than the whole list, so
select-all followed by delete cannot reach rows hidden by a search.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Bulk API shapes

**Files:**
- Modify: `src/app/api/email/recipients/route.ts:75-151`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `DELETE` accepts `{ id }`, `{ ids: string[] }`, or `{ all: true }`; responds `{ message, deleted: number }`.
  - `PATCH` accepts `{ id, active }` or `{ ids: string[], active }`; responds `{ message, updated: number }`.

- [ ] **Step 1: Replace the `DELETE` handler**

Replace the whole existing `export async function DELETE` block with:

```ts
/**
 * Deletes one recipient, a named set, or the entire list.
 *
 * `all` is an explicit flag rather than a client-supplied array of every id.
 * Emptying the table should say so: it lets the server recognise the intent,
 * and it means a truncated or half-built id list cannot silently delete a
 * subset nobody chose. The single-`id` shape is unchanged because the row
 * actions still use it.
 */
export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, ids, all } = await request.json();
    const supabase = await createClient();

    if (all === true) {
      // Supabase requires a filter on delete. `not id is null` matches every
      // row without naming one.
      const { data, error } = await supabase
        .from("email_recipients")
        .delete()
        .not("id", "is", null)
        .select("id");

      if (error) {
        console.error("Delete all recipients error:", error);
        return NextResponse.json(
          { error: "Failed to delete recipients" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Deleted ${data?.length ?? 0} recipients`,
        deleted: data?.length ?? 0,
      });
    }

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id, a list of ids, or all:true is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("email_recipients")
      .delete()
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Delete recipients error:", error);
      return NextResponse.json(
        { error: "Failed to delete recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        data?.length === 1 ? "Deleted successfully" : `Deleted ${data?.length ?? 0}`,
      deleted: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Extend the `PATCH` handler to accept `ids`**

Read the existing `PATCH` body first. Change the destructure to `const { id, ids, active } = await request.json();`, then replace its single-record update with:

```ts
    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id or a list of ids is required" },
        { status: 400 }
      );
    }

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "active must be true or false" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("email_recipients")
      .update({ active })
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
```

Keep the surrounding `requireAdmin()` check, `createClient()` call and `try/catch` exactly as they are.

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Verify by hand against the running app**

Start `npm run dev`, log into the dashboard so the admin cookie is set, then in the browser console on a dashboard page:

```js
// Expect { error: "An id, a list of ids, or all:true is required" }, status 400
await (await fetch("/api/email/recipients", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
})).json();
```

Do **not** exercise `{ all: true }` by hand — there are 50 real imported recipients and it does not ask twice. It is covered by the UI check in Task 6.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/email/recipients/route.ts
git commit -m "Accept bulk shapes on the recipients DELETE and PATCH routes

Removing an imported list meant fifty individual requests. all:true is a
flag rather than a client-built array of every id, so emptying the table
is an intent the server can recognise and a partial list cannot cause.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6: Recipients table and page

**Files:**
- Create: `src/components/dashboard/RecipientsTable.tsx`
- Modify: `src/app/dashboard/emailer/recipients/page.tsx` (whole file)

**Interfaces:**
- Consumes: everything from Tasks 2–5.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Create `src/components/dashboard/RecipientsTable.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge, Button } from "./ui";

export type Recipient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
};

/**
 * The list as a table rather than stacked cards.
 *
 * Fifty rows of cards is a great deal of scrolling and truncates the address,
 * which is the one field that has to be readable in full to be checked.
 */
const RecipientsTable = ({
  rows,
  selected,
  onToggleRow,
  onToggleAll,
  allChecked,
  onToggleActive,
  onDelete,
}: {
  rows: Recipient[];
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  allChecked: boolean;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const reduce = useReducedMotion();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleAll}
                className="w-4 h-4 accent-[#E3001B] cursor-pointer"
                aria-label="Select all shown"
              />
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Name
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Email
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              // Capped so a fifty-row list does not take two seconds to
              // finish arriving.
              transition={{ duration: 0.18, delay: Math.min(i * 0.012, 0.3) }}
              className="border-b border-line/70 hover:bg-warm/60 transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => onToggleRow(r.id)}
                  className="w-4 h-4 accent-[#E3001B] cursor-pointer"
                  aria-label={`Select ${r.name}`}
                />
              </td>
              <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
              <td className="px-4 py-3 text-muted">{r.email}</td>
              <td className="px-4 py-3">
                <Badge tone={r.active ? "active" : "paused"}>
                  {r.active ? "Active" : "Paused"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleActive(r.id, r.active)}
                  >
                    {r.active ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(r.id)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipientsTable;
```

`accent-[#E3001B]` is an arbitrary value on purpose: `accent-color` takes a colour, and Tailwind has no `accent-brand` generated from a `--color-*` token.

- [ ] **Step 2: Rewrite the Recipients page**

Keep every existing handler (`fetchRecipients`, `handleAdd`, `handleFile`, `handleImport`, `handleToggle`, `handleDelete`) and the `SHEET_EXT` constant and `Preview` type exactly as they are — the sheet import works and is not in scope. Change only the state added, the new handlers, and the returned markup.

**Delete the page's local `type Recipient = { … }` declaration.** Task 6 Step 1 exports that type from `RecipientsTable.tsx`, and two structurally identical declarations of the same row will drift the moment a column is added. Import it instead:

```tsx
import RecipientsTable, { type Recipient } from "@/components/dashboard/RecipientsTable";
```

and drop `Recipient` from the barrel import listed below.

Add this state:

```tsx
const [query, setQuery] = useState("");
const [status, setStatus] = useState<RecipientStatus>("all");
const [selected, setSelected] = useState<Set<string>>(new Set());
const [confirm, setConfirm] = useState<null | "all" | "selected">(null);
const [bulkBusy, setBulkBusy] = useState(false);
```

Derive:

```tsx
const counts = countByStatus(recipients);
const visible = filterRecipients(recipients, { query, status });
const visibleIds = visible.map((r) => r.id);
const filtering = query.trim() !== "" || status !== "all";
```

Add these handlers:

```tsx
const handleBulkActive = async (active: boolean) => {
  setBulkBusy(true);
  try {
    const res = await fetch("/api/email/recipients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], active }),
    });
    if (!res.ok) throw new Error();
    setRecipients((prev) =>
      prev.map((r) => (selected.has(r.id) ? { ...r, active } : r))
    );
    toast.success(`${selected.size} ${active ? "activated" : "paused"}`);
    setSelected(clearSelection());
  } catch {
    toast.error("Failed to update");
  } finally {
    setBulkBusy(false);
  }
};

const handleBulkDelete = async (scope: "all" | "selected") => {
  setBulkBusy(true);
  try {
    const res = await fetch("/api/email/recipients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        scope === "all" ? { all: true } : { ids: [...selected] }
      ),
    });
    const data = await res.json();
    if (!res.ok) throw new Error();
    setRecipients((prev) =>
      scope === "all" ? [] : prev.filter((r) => !selected.has(r.id))
    );
    setSelected(clearSelection());
    toast.success(data.message || "Deleted");
  } catch {
    toast.error("Failed to delete");
  } finally {
    setBulkBusy(false);
    setConfirm(null);
  }
};
```

Import at the top of the file:

```tsx
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Input, PageHeader,
  SkeletonRows, StatTile,
} from "@/components/dashboard/ui";
import RecipientsTable, {
  type Recipient,
} from "@/components/dashboard/RecipientsTable";
import {
  allSelected, clearSelection, countByStatus, filterRecipients,
  selectAll, toggleSelection, type RecipientStatus,
} from "@/lib/recipient-list";
```

Markup, in order:

1. `<PageHeader title="Recipients" description="Everyone the campaign sends to." />`
2. A `grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6` of three `StatTile`s: `Total` / `counts.total`, `Active` / `counts.active`, `Paused` / `counts.paused`.
3. The add-recipient form, wrapped in `<Card className="p-5 mb-6">`, using `Input` and `Button` in place of the raw elements. Same handler, same fields.
4. The spreadsheet importer, wrapped in `<Card className="p-5 mb-6">`. Convert `bg-neutral-*` to `bg-white`/`bg-warm`, `text-neutral-*` to `text-ink`/`text-muted`, `border-neutral-*` to `border-line`, and the badge `<span>`s to `<Badge>`. Keep the dropzone `<label>` and its handlers untouched.
5. The list, in `<Card>`:
   - A sticky toolbar: `<div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 px-4 py-3 bg-white border-b border-line rounded-t-xl">` containing the search `Input` (with a magnifier icon), a `<select>` bound to `status` styled to match `Input`, a `<span className="text-xs text-muted tabular-nums">` reading `Showing {visible.length} of {counts.total}`, and on the right a `Button variant="danger" size="sm"` labelled `Delete all`, `disabled={filtering || counts.total === 0}` with `title={filtering ? "Clear the filter to delete all" : undefined}`, calling `setConfirm("all")`.
   - `<AnimatePresence>` wrapping a selection bar rendered only when `selected.size > 0`: a `motion.div` with `initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}` holding `{selected.size} selected` and three `Button size="sm"`: `Activate` → `handleBulkActive(true)`, `Pause` → `handleBulkActive(false)`, and `Delete` (`variant="danger"`) → `setConfirm("selected")`.
   - Body: if `loading`, `<SkeletonRows count={6} />`. Else if `counts.total === 0`, an `EmptyState` titled `No recipients yet` with body `Add one above, or import a spreadsheet.` Else if `visible.length === 0`, an `EmptyState` titled `No matches` with body `Nothing matches that search or filter.` Else `<RecipientsTable …/>` wired to `visible`, `selected`, `(id) => setSelected(toggleSelection(selected, id))`, `() => setSelected(allSelected(selected, visibleIds) ? clearSelection() : selectAll(selected, visibleIds))`, `allSelected(selected, visibleIds)`, `handleToggle`, `handleDelete`.
6. `<ConfirmDialog>` driven by `confirm`:

```tsx
<ConfirmDialog
  open={confirm !== null}
  danger
  busy={bulkBusy}
  title={confirm === "all" ? "Delete all recipients?" : "Delete selected?"}
  message={
    confirm === "all"
      ? `Delete all ${counts.total} recipients? This cannot be undone.`
      : `Delete ${selected.size} recipient${selected.size === 1 ? "" : "s"}? This cannot be undone.`
  }
  confirmLabel="Delete"
  onCancel={() => setConfirm(null)}
  onConfirm={() => handleBulkDelete(confirm === "all" ? "all" : "selected")}
/>
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Verify no off-brand red survives**

Run: `grep -rc "FF0D0D" src/app/dashboard/emailer/recipients/page.tsx src/components/dashboard/`
Expected: `0` for every file listed.

- [ ] **Step 5: Manual check against the running app**

`npm run dev`, go to `/dashboard/emailer/recipients`. Confirm each of:

1. Page title is **visible** — dark ink on warm, not white on white. This was the reported bug.
2. Stat tiles show 50 / 50 / 0 against the imported list.
3. Typing `emaar` narrows to one row; the count reads `Showing 1 of 50`.
4. While that search is active, **Delete all is disabled** and hovering it explains why.
5. With the search still active, the header checkbox selects **one** row, not fifty.
6. Clearing the search re-enables Delete all.
7. Selecting two rows and choosing Pause updates only those two.
8. Delete selected asks first and names the count.
9. Delete all asks `Delete all 50 recipients? This cannot be undone.` **Only confirm this if you are willing to lose the list** — otherwise cancel and take Step 6 as the check.
10. The toolbar stays pinned while the table scrolls. If it does not, the scroll container is `<main>` in `src/app/dashboard/layout.tsx`; check at both mobile and `lg` widths.
11. With OS "reduce motion" on, rows appear without animating.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/RecipientsTable.tsx src/app/dashboard/emailer/recipients/page.tsx
git commit -m "Rebuild the recipients page as a searchable, selectable table

A spreadsheet import puts fifty rows on a page that had no search and no
bulk actions, so removing them meant fifty clicks. Delete all is disabled
while a filter is active: one button that means either the whole list or
the three rows on screen, depending on a control scrolled out of view, is
how people destroy data they meant to keep.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7: Emailer page

**Files:**
- Modify: `src/app/dashboard/emailer/page.tsx`

**Interfaces:**
- Consumes: Task 2 primitives.
- Produces: nothing.

- [ ] **Step 1: Restyle**

Replace the bare `<h1 className="text-2xl font-bold text-gray-900 mb-6">Email Composer</h1>` with `<PageHeader title="Email Composer" description="Compose, save and send the campaign." />`. Wrap the composer and the drafts list in `Card`. Replace raw inputs and buttons with `Input` and `Button`. Convert every `bg-neutral-*` / `text-neutral-*` / `border-neutral-*` / `text-gray-*` / `border-gray-*` to the token equivalents from Task 1's table. Replace `#FF0D0D` with `bg-brand`/`text-brand`.

**No stat tiles on this page.** A composer has no metric worth one beyond draft count, and inventing metrics is decoration.

- [ ] **Step 2: Add loading and empty states for drafts**

While `loading`, render `<SkeletonRows count={3} />`. When there are no drafts, render `<EmptyState title="No drafts yet" body="Compose above and save a draft to see it here." />`.

- [ ] **Step 3: Typecheck, build, grep**

Run: `npx tsc --noEmit && npm run build && grep -c "FF0D0D" src/app/dashboard/emailer/page.tsx`
Expected: builds succeed, grep prints `0`.

- [ ] **Step 4: Manual check**

At `/dashboard/emailer`: heading is dark ink on warm, composer sits on a white card with a hairline border and no shadow, Send is brand red, no grey-blue Tailwind defaults remain.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/emailer/page.tsx
git commit -m "Restyle the email composer onto the brand palette

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8: Submissions page

**Files:**
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: Task 2 primitives.
- Produces: nothing.

- [ ] **Step 1: Add stat tiles**

Above the existing search, derive and render three tiles. `Submission.status` is `"unread"` for new; `created_at` is an ISO string.

```tsx
const now = Date.now();
const stats = {
  unread: submissions.filter((s) => s.status === "unread").length,
  week: submissions.filter(
    (s) => now - new Date(s.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length,
  total: submissions.length,
};
```

Render as `New` / `stats.unread`, `This week` / `stats.week`, `Total` / `stats.total` in a `grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6`.

- [ ] **Step 2: Restyle**

`PageHeader` for the title. The existing search `<input>` becomes `Input` with a magnifier icon. Submission rows become `Card`. Convert `text-gray-*`, `border-gray-*`, `bg-white` shadows to tokens; drop `shadow-sm`. The unread highlight `border-[#FF0D0D]/30 bg-[#FF0D0D]/[0.02]` becomes `border-brand/30 bg-brand/[0.02]`. Status buttons become `Button size="sm"`.

- [ ] **Step 3: Real loading and empty states**

Replace `<div className="text-gray-400">Loading submissions...</div>` with `<SkeletonRows count={5} />`. Replace the two bare empty strings with `EmptyState` — `No submissions yet` / `Enquiries from the site land here.` when the list is empty, and `No matches` / `Nothing matches that search.` when a search excludes everything.

- [ ] **Step 4: Typecheck, build, grep**

Run: `npx tsc --noEmit && npm run build && grep -c "FF0D0D" src/app/dashboard/page.tsx`
Expected: builds succeed, grep prints `0`.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "Restyle submissions onto the brand palette and add stat tiles

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9: Portfolio and Pricing pages

**Files:**
- Modify: `src/app/dashboard/portfolio/page.tsx`
- Modify: `src/app/dashboard/pricing/page.tsx`

**Interfaces:**
- Consumes: Task 2 primitives.
- Produces: nothing.

- [ ] **Step 1: Restyle Portfolio**

`PageHeader` for the title, `Card` for panels, `Button` and `Input` for controls, tokens for every `gray`/`neutral` class, `#FF0D0D` → brand. Remove its two dark classes. Add `SkeletonRows` while loading and an `EmptyState` titled `No portfolio items yet` when the list is empty.

- [ ] **Step 2: Restyle Pricing**

Same treatment. This page is already light, so it is colour tokens, `PageHeader` and `Card` only — no structural change. It is the largest file at 560 lines; work through it section by section rather than with a blind find-and-replace, and do not alter any pricing arithmetic or form logic.

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Final palette sweep — the plan's acceptance gate**

Run: `grep -rn "FF0D0D" src/`
Expected: **no output**. Any hit is an unconverted call site.

Run: `grep -rn "neutral-9\|neutral-8\|bg-gray-50\|text-gray-900" src/app/dashboard/`
Expected: no output. Any hit is a leftover from the old dark theme or the pre-token greys.

- [ ] **Step 5: Confirm no new test failures**

Run: `node --test tests/*.test.mjs 2>&1 | grep -cE "^✖ [a-z]"`
Expected: `5`.

- [ ] **Step 6: Manual sweep of all five pages**

Visit `/dashboard`, `/dashboard/emailer`, `/dashboard/emailer/recipients`, `/dashboard/portfolio`, `/dashboard/pricing`. On each: warm canvas, white hairline-bordered cards, no shadows, dark ink headings that are actually visible, one red and it is `#E3001B`.

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/portfolio/page.tsx src/app/dashboard/pricing/page.tsx
git commit -m "Restyle portfolio and pricing onto the brand palette

Completes the migration: no dashboard file now references #FF0D0D or the
dark-theme neutrals.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
