import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/campaign-audience.ts")).href;

let cleanAudience;
let describeAudience;

try {
  ({ cleanAudience, describeAudience } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

test("the module exports what the send routes import", () => {
  assert.equal(typeof cleanAudience, "function");
  assert.equal(typeof describeAudience, "function");
});

test("an empty audience means everyone, and stays empty", () => {
  assert.deepEqual(cleanAudience([]), []);
  assert.deepEqual(cleanAudience(null), []);
  assert.deepEqual(cleanAudience(undefined), []);
  assert.deepEqual(cleanAudience("real-estate-brokerage"), []);
  assert.deepEqual(cleanAudience({}), []);
});

test("known ids survive", () => {
  assert.deepEqual(cleanAudience(["technology", "hospitality"]), [
    "technology",
    "hospitality",
  ]);
});

test("unknown ids are dropped, the rest still apply", () => {
  assert.deepEqual(cleanAudience(["technology", "a-segment-we-retired"]), [
    "technology",
  ]);
  assert.deepEqual(cleanAudience(["nope", 7, null]), []);
});

test("repeats are collapsed so the query is not silly", () => {
  assert.deepEqual(cleanAudience(["technology", "technology"]), ["technology"]);
});

test("labels are accepted, because the same matcher resolves them", () => {
  assert.deepEqual(cleanAudience(["Technology"]), ["technology"]);
});

test("describeAudience names the segments for a toast and an error", () => {
  assert.equal(describeAudience([]), "everyone");
  assert.equal(describeAudience(["technology"]), "Technology");
  assert.equal(
    describeAudience(["technology", "hospitality"]),
    "Technology and Hospitality"
  );
  assert.equal(
    describeAudience(["technology", "hospitality", "construction"]),
    "Technology, Hospitality and Construction"
  );
});
