import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/pricing.ts")).href;

let BILLING_CYCLES;
let cycleAmount;
let perMonth;
let cycleSaving;
let convert;
let taxOn;
let withTax;
let resolveCurrency;
let formatPrice;

try {
  ({
    BILLING_CYCLES,
    cycleAmount,
    perMonth,
    cycleSaving,
    convert,
    taxOn,
    withTax,
    resolveCurrency,
    formatPrice,
  } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

/** The nine authored monthly bases, AED then INR, from the seed. */
const AED_MONTHLY = {
  "retainer/launch": 4250,
  "retainer/growth": 6250,
  "retainer/scale": 10250,
  "care/care": 750,
  "care/manage": 1450,
  "care/grow": 2750,
};

const cycle = (id) => BILLING_CYCLES.find((c) => c.id === id);

const CURRENCIES = [
  {
    code: "AED",
    symbol: "AED",
    countries: ["AE", "SA", "QA", "KW", "OM", "BH"],
    authored: true,
    rate: null,
    round_to: 50,
    tax_rate: 0.05,
    tax_label: "VAT",
    active: true,
    sort_order: 1,
  },
  {
    code: "INR",
    symbol: "₹",
    countries: ["IN"],
    authored: true,
    rate: null,
    round_to: 500,
    tax_rate: 0.18,
    tax_label: "GST",
    active: true,
    sort_order: 2,
  },
  {
    code: "USD",
    symbol: "$",
    countries: ["US", "CA", "AU", "SG", "NZ"],
    authored: false,
    rate: 0.2723,
    round_to: 10,
    tax_rate: null,
    tax_label: null,
    active: true,
    sort_order: 3,
  },
  {
    code: "GBP",
    symbol: "£",
    countries: ["GB", "IE"],
    authored: false,
    rate: 0.214,
    round_to: 10,
    tax_rate: null,
    tax_label: null,
    active: false,
    sort_order: 4,
  },
];

test("billing cycles carry the documented months and discounts", () => {
  assert.ok(Array.isArray(BILLING_CYCLES), "BILLING_CYCLES is missing");

  assert.deepEqual(
    BILLING_CYCLES.map((c) => [c.id, c.months, c.discountPct]),
    [
      ["monthly", 1, 0],
      ["quarterly", 3, 5],
      ["biannual", 6, 10],
      ["annual", 12, 15],
    ],
  );
});

test("cycle totals derive from the monthly base and round up", () => {
  assert.equal(typeof cycleAmount, "function", "cycleAmount is missing");

  // Monthly is the base, untouched.
  for (const monthly of Object.values(AED_MONTHLY)) {
    assert.equal(cycleAmount(monthly, cycle("monthly")), monthly);
  }

  // Quarterly is the only cycle whose exact product lands on a half unit.
  // 4250 x 3 x 0.95 = 12,112.50 -> 12,113. Rounding up, never down, so a
  // rounding artefact can never undercut the published price.
  assert.equal(cycleAmount(4250, cycle("quarterly")), 12113);
  assert.equal(cycleAmount(6250, cycle("quarterly")), 17813);
  assert.equal(cycleAmount(10250, cycle("quarterly")), 29213);
  assert.equal(cycleAmount(750, cycle("quarterly")), 2138);
  assert.equal(cycleAmount(1450, cycle("quarterly")), 4133);
  assert.equal(cycleAmount(2750, cycle("quarterly")), 7838);

  // Six-month and annual are exact integers for every base.
  assert.equal(cycleAmount(4250, cycle("biannual")), 22950);
  assert.equal(cycleAmount(6250, cycle("biannual")), 33750);
  assert.equal(cycleAmount(10250, cycle("biannual")), 55350);
  assert.equal(cycleAmount(750, cycle("biannual")), 4050);
  assert.equal(cycleAmount(1450, cycle("biannual")), 7830);
  assert.equal(cycleAmount(2750, cycle("biannual")), 14850);

  assert.equal(cycleAmount(4250, cycle("annual")), 43350);
  assert.equal(cycleAmount(6250, cycle("annual")), 63750);
  assert.equal(cycleAmount(10250, cycle("annual")), 104550);
  assert.equal(cycleAmount(750, cycle("annual")), 7650);
  assert.equal(cycleAmount(1450, cycle("annual")), 14790);
  assert.equal(cycleAmount(2750, cycle("annual")), 28050);

  // The INR bases are multiples of 1,000, so every cycle is already exact.
  assert.equal(cycleAmount(150000, cycle("quarterly")), 427500);
  assert.equal(cycleAmount(150000, cycle("biannual")), 810000);
  assert.equal(cycleAmount(150000, cycle("annual")), 1530000);
});

test("per-month equivalent and saving agree with the cycle total", () => {
  assert.equal(typeof perMonth, "function", "perMonth is missing");
  assert.equal(typeof cycleSaving, "function", "cycleSaving is missing");

  // The spec's worked example, end to end: Growth retainer, annual, INR.
  const annual = cycle("annual");
  const total = cycleAmount(150000, annual);

  assert.equal(total, 1530000);
  assert.equal(perMonth(total, annual.months), 127500);
  assert.equal(cycleSaving(150000, annual), 270000);

  // The saving is always the undiscounted run rate minus the cycle total.
  for (const monthly of Object.values(AED_MONTHLY)) {
    for (const c of BILLING_CYCLES) {
      assert.equal(
        cycleSaving(monthly, c),
        monthly * c.months - cycleAmount(monthly, c),
      );
    }
  }

  // Monthly billing has nothing to save.
  assert.equal(cycleSaving(4250, cycle("monthly")), 0);
});

test("conversion rounds up to the currency increment, never down", () => {
  assert.equal(typeof convert, "function", "convert is missing");

  // 100 x 0.2723 = 27.23, which must reach 30 rather than fall to 20.
  assert.equal(convert(100, 0.2723, 10), 30);
  assert.equal(convert(4250, 0.2723, 10), 1160); // 1157.275 -> 1160
  assert.equal(convert(6250, 0.2723, 10), 1710); // 1701.875 -> 1710

  // A product that lands exactly on the increment stays put — float noise in
  // 1000 x 0.28 must not push it to the next step.
  assert.equal(convert(1000, 0.28, 10), 280);
  assert.equal(convert(1000, 0.25, 50), 250);
});

test("tax rounds up and the inclusive total agrees", () => {
  assert.equal(typeof taxOn, "function", "taxOn is missing");
  assert.equal(typeof withTax, "function", "withTax is missing");

  // The case that prompted showing tax at all: a client seeing 1,50,000 is
  // invoiced 1,77,000.
  assert.equal(taxOn(150000, 0.18), 27000);
  assert.equal(withTax(150000, 0.18), 177000);

  // UAE VAT on a half-dirham base rounds up.
  assert.equal(taxOn(4250, 0.05), 213); // 212.50 -> 213
  assert.equal(withTax(4250, 0.05), 4463);
  assert.equal(taxOn(12113, 0.05), 606); // 605.65 -> 606

  // No claimed rate is not the same as a zero rate: both yield no tax, but
  // the page distinguishes them by omitting the line when the rate is null.
  assert.equal(taxOn(150000, null), 0);
  assert.equal(withTax(150000, null), 150000);
  assert.equal(taxOn(150000, 0), 0);
});

test("currency resolves by cookie, then country, then USD", () => {
  assert.equal(typeof resolveCurrency, "function", "resolveCurrency is missing");

  // A valid cookie wins over the detected country.
  assert.equal(resolveCurrency("AED", "IN", CURRENCIES), "AED");
  assert.equal(resolveCurrency("INR", "US", CURRENCIES), "INR");

  // An unknown cookie is ignored and detection proceeds as if absent.
  assert.equal(resolveCurrency("XYZ", "IN", CURRENCIES), "INR");
  assert.equal(resolveCurrency("", "AE", CURRENCIES), "AED");
  assert.equal(resolveCurrency(null, "AE", CURRENCIES), "AED");

  // A cookie naming an inactive currency is ignored too.
  assert.equal(resolveCurrency("GBP", "IN", CURRENCIES), "INR");

  // Country mapping, including a Gulf country routed to AED.
  assert.equal(resolveCurrency(null, "QA", CURRENCIES), "AED");
  assert.equal(resolveCurrency(null, "SG", CURRENCIES), "USD");
  assert.equal(resolveCurrency(null, "in", CURRENCIES), "INR"); // case-insensitive

  // No header, and an unmapped country, both fall back to USD.
  assert.equal(resolveCurrency(null, null, CURRENCIES), "USD");
  assert.equal(resolveCurrency(null, "BR", CURRENCIES), "USD");

  // An inactive currency's countries do not route to it.
  assert.equal(resolveCurrency(null, "GB", CURRENCIES), "USD");
});

test("prices format with the currency's own digit grouping", () => {
  assert.equal(typeof formatPrice, "function", "formatPrice is missing");

  const inr = CURRENCIES.find((c) => c.code === "INR");
  const aed = CURRENCIES.find((c) => c.code === "AED");
  const usd = CURRENCIES.find((c) => c.code === "USD");

  // Indian grouping: lakhs and crores, not thousands.
  assert.equal(formatPrice(1530000, inr), "₹15,30,000");
  assert.equal(formatPrice(177000, inr), "₹1,77,000");
  assert.equal(formatPrice(150000, inr), "₹1,50,000");

  // An alphabetic symbol takes a space; a glyph does not.
  assert.equal(formatPrice(12113, aed), "AED 12,113");
  assert.equal(formatPrice(4460, usd), "$4,460");

  // No stray decimals on whole amounts.
  assert.equal(formatPrice(750, aed), "AED 750");
});
