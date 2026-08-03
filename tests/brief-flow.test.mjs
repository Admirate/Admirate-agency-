import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/brief.ts")).href;

let TOTAL_STEPS;
let emptyBrief;
let step4Kind;
let validateStep;
let resolveEntry;
let composeMessage;
let submissionFrom;

try {
  ({
    TOTAL_STEPS,
    emptyBrief,
    step4Kind,
    validateStep,
    resolveEntry,
    composeMessage,
    submissionFrom,
  } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

/** A state that clears every step, so a test can invalidate one thing at a time. */
const complete = () => ({
  ...emptyBrief(),
  brand: "Admirate",
  industry: "Real Estate",
  service: "retainer",
  plan: "growth",
  cycle: "annual",
  notes: "Looking to generate leads in Dubai.",
  timeline: "ASAP",
  name: "Priya Nair",
  email: "priya@admirate.in",
});

/** The label bundle the caller resolves out of the rendered view. */
const LABELS = {
  serviceLabel: "Digital Retainer",
  planLabel: "Growth",
  priceLabel: "₹1,50,000/month",
  cycleLabel: "billed annually",
};

/* ------------------------------------------------------------------ shape -- */

test("the module exports its surface", () => {
  assert.equal(typeof emptyBrief, "function", "emptyBrief must be exported");
  assert.equal(typeof step4Kind, "function", "step4Kind must be exported");
  assert.equal(typeof validateStep, "function", "validateStep must be exported");
  assert.equal(typeof resolveEntry, "function", "resolveEntry must be exported");
  assert.equal(typeof composeMessage, "function", "composeMessage must be exported");
  assert.equal(typeof submissionFrom, "function", "submissionFrom must be exported");
  assert.equal(TOTAL_STEPS, 7, "the wizard is seven steps");
});

test("an empty brief has every field blank", () => {
  const s = emptyBrief();
  assert.equal(s.brand, "");
  assert.equal(s.service, "");
  assert.equal(s.plan, "");
  assert.deepEqual(s.scope, []);
});

/* ------------------------------------------------------------ step 4 kind -- */

test("step 4 asks for a plan on each packaged service", () => {
  for (const service of ["retainer", "website", "care"]) {
    assert.equal(step4Kind({ ...emptyBrief(), service }), "plan", service);
  }
});

test("step 4 asks for scope when the service is Something Else", () => {
  assert.equal(step4Kind({ ...emptyBrief(), service: "other" }), "scope");
});

/* ------------------------------------------------------------- validation -- */

test("step 1 rejects a brand name under 2 characters", () => {
  const p = validateStep(1, { ...complete(), brand: "A" });
  assert.equal(p?.field, "brand");
  assert.match(p.message, /2 CHARACTERS/);
});

test("step 1 rejects a brand name over 120 characters", () => {
  const p = validateStep(1, { ...complete(), brand: "x".repeat(121) });
  assert.equal(p?.field, "brand");
  assert.match(p.message, /120/);
});

test("step 1 accepts a brand name at both bounds", () => {
  assert.equal(validateStep(1, { ...complete(), brand: "Ad" }), null);
  assert.equal(validateStep(1, { ...complete(), brand: "x".repeat(120) }), null);
});

test("step 2 requires an industry", () => {
  const p = validateStep(2, { ...complete(), industry: "" });
  assert.equal(p?.field, "industry");
});

test("step 2 requires the free text when the industry is Other", () => {
  const p = validateStep(2, { ...complete(), industry: "Other", industryOther: "" });
  assert.equal(p?.field, "industryOther");
});

test("step 2 accepts Other once the free text is filled", () => {
  assert.equal(
    validateStep(2, { ...complete(), industry: "Other", industryOther: "Logistics" }),
    null,
  );
});

test("step 3 requires a service", () => {
  const p = validateStep(3, { ...complete(), service: "" });
  assert.equal(p?.field, "service");
});

test("step 4 requires a plan on the packaged path", () => {
  const p = validateStep(4, { ...complete(), plan: "" });
  assert.equal(p?.field, "plan");
});

test("step 4 requires at least one scope chip on the Something Else path", () => {
  const p = validateStep(4, {
    ...complete(),
    service: "other",
    plan: "",
    scope: [],
    budget: "₹50K–1.5L",
  });
  assert.equal(p?.field, "scope");
});

test("step 4 requires a budget band on the Something Else path", () => {
  const p = validateStep(4, {
    ...complete(),
    service: "other",
    plan: "",
    scope: ["Logo design"],
    budget: "",
  });
  assert.equal(p?.field, "budget");
});

test("step 4 accepts a filled Something Else path and ignores the empty plan", () => {
  assert.equal(
    validateStep(4, {
      ...complete(),
      service: "other",
      plan: "",
      scope: ["Logo design"],
      budget: "₹50K–1.5L",
    }),
    null,
  );
});

test("step 5 accepts empty notes", () => {
  assert.equal(validateStep(5, { ...complete(), notes: "" }), null);
});

test("step 5 rejects notes over 2000 characters", () => {
  const p = validateStep(5, { ...complete(), notes: "x".repeat(2001) });
  assert.equal(p?.field, "notes");
  assert.match(p.message, /2000/);
});

test("step 6 rejects a name under 2 characters", () => {
  const p = validateStep(6, { ...complete(), name: "P" });
  assert.equal(p?.field, "name");
});

test("step 6 rejects a name over 100 characters", () => {
  const p = validateStep(6, { ...complete(), name: "x".repeat(101) });
  assert.equal(p?.field, "name");
});

test("step 6 rejects a malformed email", () => {
  for (const email of ["priya", "priya@", "priya@admirate", "a b@c.in", ""]) {
    const p = validateStep(6, { ...complete(), email });
    assert.equal(p?.field, "email", `expected ${JSON.stringify(email)} to fail`);
  }
});

test("step 6 accepts an absent phone but validates a filled one", () => {
  assert.equal(validateStep(6, { ...complete(), phone: "" }), null);
  assert.equal(validateStep(6, { ...complete(), phone: "+91 83744 94954" }), null);

  const p = validateStep(6, { ...complete(), phone: "asdf" });
  assert.equal(p?.field, "phone");
});

test("step 6 rejects a phone over 20 characters", () => {
  const p = validateStep(6, { ...complete(), phone: "+9".repeat(11) });
  assert.equal(p?.field, "phone");
});

test("a complete brief clears every step", () => {
  for (let step = 1; step <= TOTAL_STEPS; step += 1) {
    assert.equal(validateStep(step, complete()), null, `step ${step} should pass`);
  }
});

/* ------------------------------------------------------------ deep links -- */

test("a pricing tier link preselects its service, plan and cycle", () => {
  const { patch } = resolveEntry("?service=Social+Media&plan=growth&cycle=annual");
  assert.equal(patch.service, "retainer");
  assert.equal(patch.plan, "growth");
  assert.equal(patch.cycle, "annual");
});

test("a pricing tier link states what it carried in", () => {
  const { context } = resolveEntry("?service=Social+Media&plan=growth&cycle=annual");
  assert.match(context, /Growth/);
  assert.match(context, /Digital Retainer/);
  assert.match(context, /annually/);
});

test("a website build link resolves to the website family", () => {
  const { patch } = resolveEntry("?service=Digital&plan=enterprise");
  assert.equal(patch.service, "website");
  assert.equal(patch.plan, "enterprise");
});

test("a care slug beats a conflicting service parameter", () => {
  // /pricing sends "Digital" for both the build and the care plans. Mapping it
  // blindly ticks Website Build on a care enquiry.
  const { patch } = resolveEntry("?service=Digital&plan=grow&cycle=monthly");
  assert.equal(patch.service, "care");
  assert.equal(patch.plan, "grow");
});

test("a services page link resolves to Something Else with its chips", () => {
  const { patch } = resolveEntry("?service=identity");
  assert.equal(patch.service, "other");
  assert.deepEqual(patch.scope, ["Branding", "Logo design"]);
});

test("a services page link also states what it carried in", () => {
  // Without this the preselection is silent: the visitor is dropped on a
  // landing screen with no sign that anything was carried over.
  const { context } = resolveEntry("?service=identity");
  assert.match(context, /Branding/);
  assert.match(context, /Logo design/);
});

test("an unknown service selects nothing", () => {
  const { patch } = resolveEntry("?service=nonsense");
  assert.equal(patch.service, undefined);
  assert.equal(patch.plan, undefined);
});

test("an unknown plan slug selects no plan", () => {
  const { patch } = resolveEntry("?service=Social+Media&plan=nonsense");
  assert.equal(patch.plan, undefined);
});

test("a malformed query string resolves to no patch rather than throwing", () => {
  const { patch, context } = resolveEntry("?%E0%A4%A");
  assert.deepEqual(patch, {});
  assert.equal(context, "");
});

test("an absent query string resolves to no patch", () => {
  const { patch, context } = resolveEntry("");
  assert.deepEqual(patch, {});
  assert.equal(context, "");
});

/* --------------------------------------------------------------- message -- */

test("the composed message carries the structured answers", () => {
  const msg = composeMessage(complete(), LABELS);
  assert.match(msg, /Industry: Real Estate/);
  assert.match(msg, /Service: Digital Retainer/);
  assert.match(msg, /Plan: Growth/);
  assert.match(msg, /Looking to generate leads in Dubai\./);
});

test("the composed message clears the API's 10 character minimum with empty notes", () => {
  const msg = composeMessage({ ...complete(), notes: "" }, LABELS);
  assert.ok(msg.length >= 10, `expected >= 10 characters, got ${msg.length}`);
});

test("the composed message omits the separator when there are no notes", () => {
  const msg = composeMessage({ ...complete(), notes: "" }, LABELS);
  assert.ok(!msg.includes("———"), "a dangling separator should not be emitted");
  assert.ok(!msg.trimEnd().endsWith("—"), msg);
});

test("the composed message lists scope chips on the Something Else path", () => {
  const msg = composeMessage(
    { ...complete(), service: "other", plan: "", scope: ["Logo design", "Packaging"] },
    { ...LABELS, serviceLabel: "Something else", planLabel: "", priceLabel: "" },
  );
  assert.match(msg, /Logo design/);
  assert.match(msg, /Packaging/);
  assert.ok(!msg.includes("Plan:"), "there is no plan on this path");
});

/* ------------------------------------------------------------ submission -- */

test("a packaged submission maps every column", () => {
  const body = submissionFrom(complete(), LABELS);
  assert.equal(body.name, "Priya Nair");
  assert.equal(body.email, "priya@admirate.in");
  assert.equal(body.company, "Admirate");
  assert.equal(body.industry, "Real Estate");
  assert.deepEqual(body.services, ["Digital Retainer"]);
  assert.equal(body.plan, "Growth");
  assert.equal(body.billing_cycle, "annual");
  assert.equal(body.budget, "₹1,50,000/month");
  assert.equal(body.timeline, "ASAP");
});

test("a Something Else submission carries chips and no plan", () => {
  const body = submissionFrom(
    {
      ...complete(),
      service: "other",
      plan: "",
      cycle: "",
      scope: ["Logo design", "Packaging"],
      budget: "₹50K–1.5L",
    },
    { ...LABELS, serviceLabel: "Something else", planLabel: "", priceLabel: "" },
  );
  assert.deepEqual(body.services, ["Logo design", "Packaging"]);
  assert.equal(body.plan, "");
  assert.equal(body.billing_cycle, "");
  assert.equal(body.budget, "₹50K–1.5L");
});

test("a one-time website submission carries no billing cycle", () => {
  const body = submissionFrom(
    { ...complete(), service: "website", plan: "enterprise", cycle: "" },
    { ...LABELS, serviceLabel: "Website Development", planLabel: "Enterprise" },
  );
  assert.equal(body.billing_cycle, "");
});

test("the industry free text is submitted when the industry is Other", () => {
  const body = submissionFrom(
    { ...complete(), industry: "Other", industryOther: "Logistics" },
    LABELS,
  );
  assert.equal(body.industry, "Logistics");
});

test("submitted text is trimmed", () => {
  const body = submissionFrom(
    { ...complete(), brand: "  Admirate  ", name: "  Priya Nair  ", email: " priya@admirate.in " },
    LABELS,
  );
  assert.equal(body.company, "Admirate");
  assert.equal(body.name, "Priya Nair");
  assert.equal(body.email, "priya@admirate.in");
});
