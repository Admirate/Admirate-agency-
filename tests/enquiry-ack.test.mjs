import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/email/enquiry-ack.ts")
).href;

let renderEnquiryAck;
let renderEnquiryAckText;
let enquiryAckSubject;

try {
  ({ renderEnquiryAck, renderEnquiryAckText, enquiryAckSubject } = await import(
    moduleUrl
  ));
} catch {
  // The RED run reaches the explicit assertions below.
}

/** A brief as `composeMessage` builds it: label lines, a rule, then notes. */
const MESSAGE = [
  "Industry: Fashion & Apparel",
  "Service: Monthly Retainer",
  "Timeline: THIS MONTH",
  "———",
  "Two new stores opening — we want social running before the launch.",
].join("\n");

const render = (over = {}) =>
  renderEnquiryAck({
    name: "Priya Sharma",
    company: "Kanchi Weaves",
    message: MESSAGE,
    ...over,
  });

test("the module exports what the contact route imports", () => {
  assert.equal(typeof renderEnquiryAck, "function");
  assert.equal(typeof renderEnquiryAckText, "function");
  assert.equal(typeof enquiryAckSubject, "function");
});

test("the logo is an opaque PNG on our own domain, not the site's WebP", () => {
  const html = render();
  assert.match(html, /https:\/\/admirate\.in\/email\/admirate-logo\.png/);
  /* WebP renders as nothing in Outlook desktop and Apple Mail, and this file
     carries an alpha channel that Gmail's image proxy flattens onto black. */
  assert.doesNotMatch(html, /\.webp/i);
});

test("the plain-text part carries the same message as the HTML", () => {
  const text = renderEnquiryAckText({
    name: "Priya Sharma",
    company: "Kanchi Weaves",
    message: MESSAGE,
  });
  assert.match(text, /Hi Priya,/);
  assert.match(text, /Kanchi Weaves/);
  assert.match(text, /within one working day/);
  assert.match(text, /Fashion & Apparel/);
  assert.match(text, /Two new stores opening/);
  /* A text part is only worth sending if it is genuinely text. */
  assert.doesNotMatch(text, /<[a-z]/i);
  assert.doesNotMatch(text, /&amp;|&mdash;/);
});

test("the subject names the brand, and survives a submission without one", () => {
  assert.match(enquiryAckSubject("Kanchi Weaves"), /Kanchi Weaves/);
  assert.ok(enquiryAckSubject("").length > 0);
  assert.ok(enquiryAckSubject(undefined).length > 0);
});

test("it greets by first name, not the whole name", () => {
  const html = render();
  assert.match(html, /Hi Priya,/);
  assert.doesNotMatch(html, /Hi Priya Sharma,/);
});

test("a one-word name is greeted unchanged, and a blank one still greets", () => {
  assert.match(render({ name: "Priya" }), /Hi Priya,/);
  assert.match(render({ name: "   " }), /Hi there,/);
});

test("the brief comes back to the sender, label lines and notes alike", () => {
  const html = render();
  assert.match(html, /Fashion &amp; Apparel/);
  assert.match(html, /Monthly Retainer/);
  assert.match(html, /THIS MONTH/);
  assert.match(html, /Two new stores opening/);
  // The rule is a separator in the source string, not content to reprint.
  assert.doesNotMatch(html, /———/);
});

test("a submission with no company drops the brand clause rather than printing an empty one", () => {
  const html = render({ company: "" });
  assert.match(html, /Your enquiry has reached us/);
  assert.doesNotMatch(html, /brief for <strong/);
});

test("submitted text cannot inject markup", () => {
  const html = render({
    company: '</td><script>alert(1)</script>',
    message: "Notes: <img src=x onerror=alert(1)>",
  });
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img src=x/);
});

test("it carries no unsubscribe link — this is transactional, not bulk", () => {
  /* Comments are stripped first: the template explains in a comment why the
     link is absent, and the word there is not a link. */
  const html = render().replace(/<!--[\s\S]*?-->/g, "");
  assert.doesNotMatch(html, /nsubscribe/i);
  // The postal address stays: it is what a receipt should carry.
  assert.match(html, /Hyderabad/);
});

test("it is a complete document the send route can hand straight to Resend", () => {
  const html = render();
  assert.match(html, /^<!DOCTYPE html/);
  assert.match(html, /<\/html>$/);
});
