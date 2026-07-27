import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  resolve(here, "../src/components/services/content.ts"),
  "utf8",
);
const mobileStart = source.indexOf("/* ---------- MOBILE");
const mobileEnd = source.indexOf("/* ---------- SHORT VIEWPORTS", mobileStart);
const mobileCss = source.slice(mobileStart, mobileEnd);

test("mobile services overview hides only the requested decorative labels", () => {
  assert.match(source, /<div class="tag">OUR DESIGN WORK<\/div>/);
  assert.match(source, /#hero \.tag::before\{content:"\/\/ "\}/);
  assert.ok(mobileCss.includes("#hero .tag::before{display:none}"));
  assert.ok(
    mobileCss.includes(
      "#eye .eb,#logos .eb,#web .eb,#clients .eb,#reels .eb,#tv .eb,#collat .eb{display:none}",
    ),
  );

  for (const label of [
    "EYE-LEVEL DESIGN",
    "IDENTITY",
    "DIGITAL",
    "CLIENT WEBSITES",
    "SOCIAL MEDIA",
    "VIDEO PRODUCTION",
    "BRAND COLLATERALS",
  ]) {
    assert.ok(source.includes(`>${label}</div>`), `desktop label removed: ${label}`);
  }

  for (const retained of [
    "EXPLORE DESIGN",
    "EXPLORE IDENTITY",
    "SOCIAL CREATIVES",
    "WHY IT WORKS",
  ]) {
    assert.ok(source.includes(retained), `retained content removed: ${retained}`);
  }
});
