import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/industries.ts")).href;

let INDUSTRIES;
let industryLabel;
let toIndustryId;

try {
  ({ INDUSTRIES, industryLabel, toIndustryId } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

test("the module exports what the app imports", () => {
  assert.ok(Array.isArray(INDUSTRIES), "INDUSTRIES should be an array");
  assert.equal(typeof industryLabel, "function");
  assert.equal(typeof toIndustryId, "function");
});

test("every entry has a unique id and a label", () => {
  const ids = INDUSTRIES.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length, "ids must be unique");
  for (const entry of INDUSTRIES) {
    assert.match(entry.id, /^[a-z0-9-]+$/, `${entry.id} should be kebab-case`);
    assert.ok(entry.label.length > 0);
  }
});

test("the list covers the segments the campaign targets", () => {
  const ids = INDUSTRIES.map((i) => i.id);
  for (const required of [
    "real-estate-brokerage",
    "real-estate-developer",
    "interior-fitout",
    "construction",
    "hospitality",
    "retail-fnb",
    "healthcare-wellness",
    "professional-services",
    "technology",
    "other",
  ]) {
    assert.ok(ids.includes(required), `missing ${required}`);
  }
});

test("industryLabel resolves an id, and names the empty case", () => {
  assert.equal(industryLabel("real-estate-brokerage"), "Real Estate — Brokerage");
  assert.equal(industryLabel(null), "Unassigned");
  assert.equal(industryLabel(undefined), "Unassigned");
  assert.equal(industryLabel(""), "Unassigned");
  assert.equal(industryLabel("no-such-industry"), "Unassigned");
});

test("toIndustryId is idempotent on ids it already produced", () => {
  for (const entry of INDUSTRIES) {
    assert.equal(toIndustryId(entry.id), entry.id);
  }
});

test("toIndustryId accepts the label as written", () => {
  for (const entry of INDUSTRIES) {
    assert.equal(toIndustryId(entry.label), entry.id);
  }
});

test("toIndustryId ignores case, spacing and punctuation", () => {
  assert.equal(toIndustryId("  REAL ESTATE - BROKERAGE "), "real-estate-brokerage");
  assert.equal(toIndustryId("Retail & F&B"), "retail-fnb");
  assert.equal(toIndustryId("interior design & fit-out"), "interior-fitout");
});

test("toIndustryId maps the words a spreadsheet actually uses", () => {
  assert.equal(toIndustryId("Realtor"), "real-estate-brokerage");
  assert.equal(toIndustryId("brokerage"), "real-estate-brokerage");
  assert.equal(toIndustryId("Property"), "real-estate-brokerage");
  assert.equal(toIndustryId("Developer"), "real-estate-developer");
  assert.equal(toIndustryId("Property Development"), "real-estate-developer");
  assert.equal(toIndustryId("Fit Out"), "interior-fitout");
  assert.equal(toIndustryId("Interiors"), "interior-fitout");
  assert.equal(toIndustryId("Contracting"), "construction");
  assert.equal(toIndustryId("Hotel"), "hospitality");
  assert.equal(toIndustryId("Restaurant"), "retail-fnb");
  assert.equal(toIndustryId("Clinic"), "healthcare-wellness");
  assert.equal(toIndustryId("Law Firm"), "professional-services");
  assert.equal(toIndustryId("SaaS"), "technology");
});

test("plain 'Real Estate' resolves to brokerage, the larger segment", () => {
  assert.equal(toIndustryId("Real Estate"), "real-estate-brokerage");
});

test("toIndustryId returns null rather than guessing", () => {
  assert.equal(toIndustryId(""), null);
  assert.equal(toIndustryId("   "), null);
  assert.equal(toIndustryId(null), null);
  assert.equal(toIndustryId(undefined), null);
  assert.equal(toIndustryId(42), null);
  assert.equal(toIndustryId({}), null);
  assert.equal(toIndustryId("Aardvark Wrangling"), null);
});
