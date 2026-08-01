import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// The module builds a Resend client at import time, and that constructor throws
// without a key. Nothing here reaches the network, so a placeholder is enough.
process.env.RESEND_API_KEY ||= "re_test_key";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/resend.ts")).href;

let campaignBatches;
let RESEND_BATCH_LIMIT;

try {
  ({ campaignBatches, RESEND_BATCH_LIMIT } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

const addresses = (n) =>
  Array.from({ length: n }, (_, i) => `person${i}@example.com`);

const batch = (n) =>
  campaignBatches({ to: addresses(n), subject: "Hello", html: "<p>Hi</p>" });

test("resend exports the batching helper and the limit", () => {
  assert.equal(typeof campaignBatches, "function");
  assert.equal(RESEND_BATCH_LIMIT, 100);
});

test("each recipient gets an email addressed only to them", () => {
  // The whole point of individual sends: no prospect can see who else is on
  // the list, so no `to` may ever hold more than the one address.
  const emails = batch(51).flat();
  assert.equal(emails.length, 51);
  for (const [i, email] of emails.entries()) {
    assert.deepEqual(email.to, [`person${i}@example.com`]);
  }
});

test("every email carries the campaign's from, replyTo, subject and html", () => {
  const [email] = batch(3).flat();
  assert.equal(email.from, "ADMIRATE <info@admirate.in>");
  assert.equal(email.replyTo, "start@admirate.in");
  assert.equal(email.subject, "Hello");
  assert.equal(email.html, "<p>Hi</p>");
});

test("a list that fits the batch limit is one API call", () => {
  // 51 active recipients is the size that was failing before individual sends;
  // it now goes out in a single batch call.
  assert.equal(batch(51).length, 1);
  assert.equal(batch(100).length, 1);
});

test("a list past the batch limit splits into further calls", () => {
  assert.deepEqual(batch(101).map((b) => b.length), [100, 1]);
  assert.deepEqual(batch(250).map((b) => b.length), [100, 100, 50]);
});

test("no batch ever exceeds the limit, and none is lost", () => {
  for (const size of [1, 51, 99, 100, 101, 237]) {
    const out = batch(size);
    assert.ok(out.every((b) => b.length <= 100), `size ${size} overflowed`);
    assert.equal(out.flat().length, size, `size ${size} lost recipients`);
  }
});

test("recipients keep their order across batches", () => {
  const flat = batch(101).flat();
  assert.deepEqual(flat.map((e) => e.to[0]), addresses(101));
});

test("an empty list produces no calls", () => {
  assert.deepEqual(campaignBatches({ to: [], subject: "x", html: "y" }), []);
});
