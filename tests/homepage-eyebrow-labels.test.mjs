import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  resolve(here, "../src/components/landing/content.ts"),
  "utf8",
);

test("homepage removes the requested red eyebrow labels and keeps its main captions", () => {
  assert.match(source, /<div class="tag">WHO WE ARE<\/div>/);

  for (const label of ["VIDEO PRODUCTION", "DIGITAL", "SOCIAL MEDIA", "CLIENTS"]) {
    assert.doesNotMatch(
      source,
      new RegExp(`<div class="eb rise"[^>]*>${label}<\\/div>`),
    );
  }

  for (const heading of [
    "Video Production",
    "Websites",
    "Social Media",
    "Brands we've worked with",
  ]) {
    assert.ok(source.includes(heading), `missing retained heading: ${heading}`);
  }
});
