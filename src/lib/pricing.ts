/**
 * Every calculation the pricing page performs.
 *
 * Deliberately pure: no database client, no `next/*` import, no network. That
 * is what lets `tests/pricing-calc.test.mjs` import this file directly under
 * Node and assert the arithmetic, rather than asserting it through a rendered
 * page where a wrong figure is a string in a blob of HTML.
 *
 * The one rule that governs the whole module: a derived figure rounds **up**.
 * Cycle totals, currency conversions and tax all round up to their increment,
 * so no rounding artefact can ever publish a price below what will be invoiced.
 */

export type Currency = {
  code: string;
  symbol: string;
  countries: string[];
  /** true: prices stored per plan. false: derived from the AED base. */
  authored: boolean;
  /** Units per 1 AED. Ignored when `authored`. */
  rate: number | null;
  round_to: number;
  /** Fraction, e.g. 0.18. Null means no rate is claimed — not zero. */
  tax_rate: number | null;
  tax_label: string | null;
  active: boolean;
  sort_order: number;
};

export type BillingCycle = {
  id: "monthly" | "quarterly" | "biannual" | "annual";
  label: string;
  /** Short form for the line beneath the headline figure. */
  billedAs: string;
  months: number;
  /** Whole percent, not a fraction — see the note on `cycleAmount`. */
  discountPct: number;
};

/**
 * The four cycles.
 *
 * Universal across families and currencies, so this is a constant rather than
 * a table: there is no plausible reason for the annual discount to differ
 * between the retainer and the care plan, and making it editable would invite
 * exactly that drift.
 */
export const BILLING_CYCLES: BillingCycle[] = [
  { id: "monthly", label: "Monthly", billedAs: "billed monthly", months: 1, discountPct: 0 },
  { id: "quarterly", label: "Quarterly", billedAs: "billed quarterly", months: 3, discountPct: 5 },
  { id: "biannual", label: "6 months", billedAs: "billed every 6 months", months: 6, discountPct: 10 },
  { id: "annual", label: "Annual", billedAs: "billed annually", months: 12, discountPct: 15 },
];

/** Cycle totals resolve to the whole currency unit. See `cycleAmount`. */
export const ROUND_CYCLE_TO = 1;

/**
 * The cache tag the public page's payload is stored under.
 *
 * It lives here rather than in the API route because a route module may only
 * export request handlers and a fixed set of config keys — Next's generated
 * route types reject anything else. Both the pricing writes and the FX job
 * invalidate this tag.
 */
export const PRICING_TAG = "pricing";

/**
 * Strips binary floating-point noise before a ceiling.
 *
 * Without this, `1000 * 0.28` is 280.00000000000006, which `Math.ceil` would
 * push to the next increment and overstate the price by a whole step. Six
 * decimal places is far below any currency's precision and far above the
 * noise floor of these products.
 */
const clean = (n: number) => Number(n.toFixed(6));

const ceilTo = (n: number, step: number) =>
  step <= 0 ? clean(n) : Math.ceil(clean(n) / step) * step;

/**
 * Dirhams per US dollar. Not a market rate — the UAE central bank has pegged
 * the dirham at exactly this since 1997, and it is the constant the AED rate
 * card was authored against.
 */
export const AED_PER_USD = 3.6725;

/**
 * Turns a USD-based rate table into the AED-based one this codebase stores.
 *
 * The FX job cannot simply ask its provider for AED. Frankfurter republishes
 * European Central Bank reference rates, and the ECB publishes thirty
 * currencies of which AED is not one — `?base=AED` answers
 * `404 {"message":"not found"}`, which is what the scheduled function had been
 * logging every day since it shipped. So the job asks for the USD table, which
 * the ECB does publish, and divides through the peg above.
 *
 * USD is added explicitly because Frankfurter omits its own base from the rates
 * it returns, and USD is one of the currencies this site prices in.
 */
export function aedRatesFromUsd(
  usdRates: Record<string, unknown>,
): Record<string, number> {
  const out: Record<string, number> = {};

  for (const [code, perUsd] of Object.entries({ USD: 1, ...usdRates })) {
    /* A junk entry is dropped rather than converted. The caller guards each
       rate before writing it, but a NaN should not be built in the first
       place. */
    if (typeof perUsd !== "number" || !Number.isFinite(perUsd) || perUsd <= 0) {
      continue;
    }
    out[code] = clean(perUsd / AED_PER_USD);
  }

  return out;
}

/**
 * The total for one billing cycle, from the monthly base.
 *
 * The discount is applied as a whole percent over a division rather than as a
 * `0.95` multiplier, because `12750 * 0.95` is not exactly representable while
 * `12750 * 95 / 100` is. The figures here are prices; they should not depend on
 * which of two algebraically identical expressions was typed.
 *
 * Rounds up. `4250 x 3 x 0.95` is 12,112.50 — every quarterly figure lands on a
 * half unit, and the six-month and annual figures are all exact. See the spec's
 * "Derived cycle rounding" section for the open question about what the printed
 * rate card publishes for quarterly.
 */
export const cycleAmount = (monthly: number, cycle: BillingCycle) =>
  ceilTo((monthly * cycle.months * (100 - cycle.discountPct)) / 100, ROUND_CYCLE_TO);

/**
 * The per-month equivalent of a cycle total — the page's headline figure.
 *
 * The headline is the per-month number, not the cycle total, because showing
 * the total would compare a monthly price against an annual one and make the
 * discounted plan look more expensive. The total is stated immediately beneath.
 */
export const perMonth = (total: number, months: number) =>
  months <= 0 ? clean(total) : ceilTo(total / months, ROUND_CYCLE_TO);

/** What the cycle saves against paying the monthly rate for the same span. */
export const cycleSaving = (monthly: number, cycle: BillingCycle) =>
  monthly * cycle.months - cycleAmount(monthly, cycle);

/**
 * A derived currency's figure, from the AED base.
 *
 * Rounds up to `roundTo` so a daily rate refresh can never drop a published
 * price below where it sat yesterday by a rounding step.
 */
export const convert = (aedAmount: number, rate: number, roundTo: number) =>
  ceilTo(aedAmount * rate, roundTo);

/**
 * Tax on an amount, rounded up to the whole unit.
 *
 * A null rate means no rate is claimed for this currency, which is not the
 * same as a zero rate: both produce no tax here, but the page omits the line
 * entirely for null rather than printing "+0%". Foreign tax treatment is not
 * something this page asserts.
 */
export const taxOn = (amount: number, rate: number | null | undefined) =>
  rate ? ceilTo(amount * rate, ROUND_CYCLE_TO) : 0;

export const withTax = (amount: number, rate: number | null | undefined) =>
  amount + taxOn(amount, rate);

/**
 * The currency to render, by precedence:
 *
 *   1. the `admirate_ccy` cookie, when it names an active currency;
 *   2. the country on Netlify's `x-nf-country` header, mapped through each
 *      currency's `countries`;
 *   3. USD.
 *
 * An invalid, unknown or inactive cookie value is ignored and detection
 * proceeds as though it were absent — a stale cookie naming a currency that
 * has since been switched off must not produce a blank page.
 */
export function resolveCurrency(
  cookie: string | null | undefined,
  countryHeader: string | null | undefined,
  currencies: Currency[],
): string {
  const live = currencies.filter((c) => c.active);

  const chosen = cookie
    ? live.find((c) => c.code === cookie.trim().toUpperCase())
    : undefined;
  if (chosen) return chosen.code;

  const country = countryHeader?.trim().toUpperCase();
  if (country) {
    const byCountry = live.find((c) => c.countries.includes(country));
    if (byCountry) return byCountry.code;
  }

  return live.find((c) => c.code === "USD")?.code ?? live[0]?.code ?? "USD";
}

/**
 * A whole-unit price with the currency's own digit grouping.
 *
 * INR groups in lakhs — 1530000 is 15,30,000, not 1,530,000 — which is what an
 * Indian reader expects and what makes the figure scannable. Everything else
 * groups in thousands.
 *
 * An alphabetic symbol ("AED") takes a space; a glyph ("₹", "$") does not.
 */
export function formatPrice(
  amount: number,
  currency: Pick<Currency, "code" | "symbol">,
): string {
  const locale = currency.code === "INR" ? "en-IN" : "en-US";
  const digits = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  const gap = /[A-Za-z]/.test(currency.symbol) ? " " : "";
  return `${currency.symbol}${gap}${digits}`;
}

/**
 * The amount for one plan in one currency.
 *
 * Authored currencies read their stored row. Derived currencies have no row by
 * design and are computed from the AED base. Returns null when the figure
 * cannot be produced — a plan with no AED row, or a derived currency with no
 * rate yet — so the caller can omit the plan rather than render a zero.
 */
export function planAmount(
  planId: string,
  currency: Currency,
  amounts: { plan_id: string; currency_code: string; amount: number }[],
): number | null {
  if (currency.authored) {
    const row = amounts.find(
      (a) => a.plan_id === planId && a.currency_code === currency.code,
    );
    return row ? Number(row.amount) : null;
  }

  const base = amounts.find(
    (a) => a.plan_id === planId && a.currency_code === "AED",
  );
  if (!base || !currency.rate) return null;

  return convert(Number(base.amount), Number(currency.rate), currency.round_to);
}
