import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/email/templates/index.ts")
).href;

let TEMPLATES;
let DEFAULT_TEMPLATE_ID;
let getTemplate;

try {
  ({ TEMPLATES, DEFAULT_TEMPLATE_ID, getTemplate } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

const PROPS = { subject: "Snapshot Subject & <Test>", body: "Snapshot preheader body." };

test("the registry exports what the composer and send routes import", () => {
  assert.ok(Array.isArray(TEMPLATES), "TEMPLATES should be an array");
  assert.ok(TEMPLATES.length >= 1);
  assert.equal(typeof DEFAULT_TEMPLATE_ID, "string");
  assert.equal(typeof getTemplate, "function");
});

test("every template is complete enough to put in the picker", () => {
  const ids = TEMPLATES.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "template ids must be unique");
  for (const t of TEMPLATES) {
    assert.match(t.id, /^[a-z0-9-]+$/);
    assert.ok(t.name.length > 0, `${t.id} needs a name`);
    assert.ok(t.description.length > 0, `${t.id} needs a description`);
    assert.ok(t.thumbnail.length > 0, `${t.id} needs a thumbnail`);
    assert.equal(typeof t.render, "function");
  }
});

test("getTemplate falls back rather than failing a send", () => {
  assert.equal(getTemplate(DEFAULT_TEMPLATE_ID).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate(null).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate(undefined).id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate("").id, DEFAULT_TEMPLATE_ID);
  assert.equal(getTemplate("a-template-we-deleted").id, DEFAULT_TEMPLATE_ID);
});

test("every template renders a complete document with the legal footer", () => {
  for (const t of TEMPLATES) {
    const html = t.render(PROPS);
    assert.equal(typeof html, "string");
    assert.match(html, /^<!DOCTYPE html/, `${t.id} should be a full document`);
    assert.match(html, /<\/html>$/, `${t.id} should close its document`);
    assert.ok(html.includes("Unsubscribe"), `${t.id} is missing the footer`);
    assert.ok(html.includes("admirate.in"), `${t.id} is missing the site link`);
  }
});

test("the subject is escaped, never interpolated raw", () => {
  for (const t of TEMPLATES) {
    const html = t.render({ subject: '<script>x</script>&"', body: "b" });
    assert.ok(!html.includes("<script>"), `${t.id} interpolates the subject raw`);
    assert.ok(html.includes("&lt;script&gt;"), `${t.id} should escape the subject`);
  }
});

test("the campaign creative is unchanged, byte for byte", () => {
  const expected = readFileSync(
    resolve(here, "fixtures/campaign-dubai.snapshot.html"),
    "utf8"
  );
  assert.equal(getTemplate("campaign-dubai").render(PROPS), expected);
});
