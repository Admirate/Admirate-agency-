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
