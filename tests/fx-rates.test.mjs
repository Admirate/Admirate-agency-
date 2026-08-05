import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(resolve(here, "../src/lib/pricing.ts")).href;
const routeUrl = pathToFileURL(
  resolve(here, "../src/app/api/cron/fx/route.ts")
).href;

let AED_PER_USD;
let aedRatesFromUsd;

try {
  ({ AED_PER_USD, aedRatesFromUsd } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit assertions below.
}

/** A USD-based Frankfurter reply, trimmed to the currencies this site prices. */
const USD_RATES = { EUR: 0.8684, GBP: 0.74357, INR: 87.42 };

test("the module exports what the FX job imports", () => {
  assert.equal(typeof aedRatesFromUsd, "function");
  assert.equal(AED_PER_USD, 3.6725);
});

test("USD is present even though the provider omits its own base", () => {
  /* The bug this guards: Frankfurter's `rates` object never contains the base
     currency, so a straight passthrough would silently skip USD — one of the
     three currencies the site derives. */
  const rates = aedRatesFromUsd(USD_RATES);
  assert.ok("USD" in rates, "USD must be derived from the peg");
  assert.equal(rates.USD, Number((1 / 3.6725).toFixed(6)));
});

test("rates come out per dirham, not per dollar", () => {
  const rates = aedRatesFromUsd(USD_RATES);
  // 1 AED = 1/3.6725 USD, so 1 AED = 0.8684/3.6725 EUR.
  assert.equal(rates.EUR, Number((0.8684 / 3.6725).toFixed(6)));
  assert.ok(rates.EUR > 0.23 && rates.EUR < 0.25, `got ${rates.EUR}`);
  assert.ok(rates.GBP > 0.19 && rates.GBP < 0.21, `got ${rates.GBP}`);
});

test("junk from the provider is dropped, not converted into NaN", () => {
  const rates = aedRatesFromUsd({
    EUR: 0.8684,
    GBP: null,
    JPY: "147.2",
    ZAR: 0,
    BRL: -1,
    CHF: Number.NaN,
  });
  assert.deepEqual(Object.keys(rates).sort(), ["EUR", "USD"]);
});

test("an empty reply still yields the pegged USD rate and nothing else", () => {
  assert.deepEqual(aedRatesFromUsd({}), {
    USD: Number((1 / 3.6725).toFixed(6)),
  });
});

test("the job asks for a base the ECB actually publishes", async () => {
  /* The original bug, asserted directly: Frankfurter serves ECB reference
     rates, which do not include AED, so `?base=AED` 404s on every run. */
  const source = await import("node:fs").then((fs) =>
    fs.readFileSync(fileURLToPath(routeUrl), "utf8")
  );
  /* The declaration only. The comment above it names the broken URL to explain
     why it is broken, and that mention is not a request anything will make. */
  const declared = /const RATES_URL = "([^"]+)"/.exec(source);
  assert.ok(declared, "RATES_URL should be a plain string constant");
  assert.equal(
    declared[1],
    "https://api.frankfurter.dev/v1/latest?base=USD"
  );
});
