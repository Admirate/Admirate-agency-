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
