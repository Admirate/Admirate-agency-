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
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
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
export function selectAll(selected: Set<string>, ids: string[]): Set<string> {
  const next = new Set(selected);
  for (const id of ids) next.add(id);
  return next;
}

export function clearSelection(): Set<string> {
  return new Set();
}

export function allSelected(selected: Set<string>, ids: string[]): boolean {
  // An empty view is not "all selected" — the header checkbox must read
  // unticked when a search matches nothing.
  return ids.length > 0 && ids.every((id) => selected.has(id));
}
