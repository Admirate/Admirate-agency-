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
  // The RED run reaches the explicit function assertions below.
}

/**
 * The shape that broke the import: a hand-built sheet that opens with a title
 * and a sentence of provenance, leaves a gap, and only then gives the header.
 *
 * Both preamble cells contain the word "email", which is the trap — the title
 * says "...Business Emails" and the description says "No personal email format
 * has been guessed." A header sniffer that reads only the first row, and that
 * accepts any cell merely *containing* "email", locks onto column 0 and then
 * rejects every row because column 0 holds the row number.
 */
const PREAMBLE_SHEET = [
  ["ADMIRATE — 50 Solid Dubai Real Estate Business Emails", null, null, null],
  [
    "Every address is publicly listed on an official company page. No personal email format has been guessed.",
    null,
    null,
    null,
  ],
  [null, null, null, null],
  ["#", "Company", "Segment", "Email"],
  [1, "Emaar Properties", "Developer", "info@emaar.com"],
  [2, "DAMAC Properties", "Developer", "info@damacgroup.com"],
  [3, "Nakheel", "Developer", "customercare@nakheel.com"],
];

test("recipient-sheet exports the functions under test", () => {
  assert.equal(typeof parseRecipientRows, "function");
  assert.equal(typeof pickColumns, "function");
});

test("a header below preamble rows is found, not the title row", () => {
  const { recipients, skipped } = parseRecipientRows(PREAMBLE_SHEET);

  assert.equal(
    skipped.length,
    0,
    `expected nothing skipped, got: ${JSON.stringify(skipped)}`
  );
  assert.deepEqual(
    recipients.map((r) => r.email),
    ["info@emaar.com", "info@damacgroup.com", "customercare@nakheel.com"]
  );
});

test("the name column comes from the header below the preamble", () => {
  const { recipients } = parseRecipientRows(PREAMBLE_SHEET);
  assert.deepEqual(
    recipients.map((r) => r.name),
    ["Emaar Properties", "DAMAC Properties", "Nakheel"]
  );
});

test("prose mentioning email is not mistaken for a header cell", () => {
  // No header anywhere — just a sentence, then data. The address column must
  // still be found by inspecting the values.
  const grid = [
    ["A note about our email list", null],
    ["Emaar Properties", "info@emaar.com"],
    ["Nakheel", "customercare@nakheel.com"],
  ];
  const { recipients, skipped } = parseRecipientRows(grid);
  assert.equal(skipped.length, 0, JSON.stringify(skipped));
  assert.deepEqual(
    recipients.map((r) => r.email),
    ["info@emaar.com", "customercare@nakheel.com"]
  );
});

test("a header column that names email but holds none loses to the one that does", () => {
  // "Email Status" is a plausible header that carries no addresses. The real
  // address column has no header at all.
  const grid = [
    ["Company", "Email Status", "Contact"],
    ["Emaar Properties", "verified", "info@emaar.com"],
    ["Nakheel", "bounced", "customercare@nakheel.com"],
  ];
  const { recipients, skipped } = parseRecipientRows(grid);
  assert.equal(skipped.length, 0, JSON.stringify(skipped));
  assert.deepEqual(
    recipients.map((r) => r.email),
    ["info@emaar.com", "customercare@nakheel.com"]
  );
});

test("an ordinary single-row header still works", () => {
  const grid = [
    ["Name", "Email"],
    ["Priya Sharma", "priya@example.com"],
  ];
  const { recipients, skipped } = parseRecipientRows(grid);
  assert.equal(skipped.length, 0, JSON.stringify(skipped));
  assert.deepEqual(recipients, [
    { name: "Priya Sharma", email: "priya@example.com" },
  ]);
});

test("a sheet with no header at all still imports", () => {
  const grid = [
    ["Priya Sharma", "priya@example.com"],
    ["Rahul Nair", "rahul@example.com"],
  ];
  const { recipients, skipped } = parseRecipientRows(grid);
  assert.equal(skipped.length, 0, JSON.stringify(skipped));
  assert.deepEqual(
    recipients.map((r) => r.email),
    ["priya@example.com", "rahul@example.com"]
  );
});

test("genuinely malformed addresses are still reported", () => {
  const grid = [
    ["Name", "Email"],
    ["Good", "ok@example.com"],
    ["Bad", "not-an-address"],
  ];
  const { recipients, skipped } = parseRecipientRows(grid);
  assert.deepEqual(
    recipients.map((r) => r.email),
    ["ok@example.com"]
  );
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].reason, "Not a valid email");
});
