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
