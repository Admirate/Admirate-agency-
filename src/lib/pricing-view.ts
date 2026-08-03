import {
  BILLING_CYCLES,
  cycleAmount,
  cycleSaving,
  formatPrice,
  perMonth,
  planAmount,
  taxOn,
  withTax,
  type Currency,
} from "@/lib/pricing";
import type { PricingPayload } from "@/lib/pricing-data";
import type {
  PriceCell,
  PricingFamilyView,
  PricingPlanView,
  PricingView,
} from "@/components/pricing/content";

/**
 * Turns the stored rate card into the shape a page renders.
 *
 * Extracted from `app/pricing/page.tsx` so /start-project's plan cards and
 * their detail panels are built from the same figures, by the same code, as
 * the pricing page. The wizard reads `id`, `cycles` and `service` off
 * `FAMILIES` and supplies its own card copy; `title`, `bg` and `dark` exist
 * for the pricing page's section treatment and are ignored there.
 */
export const FAMILIES = [
  {
    id: "retainer" as const,
    title: "DIGITAL <em>RETAINER</em>",
    note: "Website maintenance is included at every tier.",
    bg: "#FFFFFF",
    cycles: true,
    /* "Digital" would tick the Websites chip on the enquiry form, which is the
       wrong brief for a social-and-ads retainer. "Social Media" is an option
       the form already recognises and is the closer fit. */
    service: "Social Media",
  },
  {
    id: "website" as const,
    title: "WEBSITE <em>DEVELOPMENT</em>",
    bg: "#FAFAF8",
    cycles: false,
    service: "Digital",
  },
  {
    id: "care" as const,
    title: "WEBSITE <em>CARE</em>",
    bg: "#0B0B0C",
    dark: true,
    cycles: true,
    service: "Digital",
  },
];

/** Every cycle's rendered figures for one plan in one currency. */
export function cellsFor(
  monthly: number,
  currency: Currency,
  oneTime: boolean,
): Record<string, PriceCell> {
  const money = (n: number) => formatPrice(n, currency);

  const taxLine = (base: number) =>
    currency.tax_rate && currency.tax_label
      ? `+${Number((currency.tax_rate * 100).toFixed(2))}% ${currency.tax_label} · ${money(withTax(base, currency.tax_rate))} incl.`
      : "";

  /* A one-time price has no cycles to derive. It is stored under the monthly
     key so the client has one lookup shape for both kinds of plan. */
  if (oneTime) {
    return {
      monthly: {
        fig: money(monthly),
        per: "one-time",
        billTotal: "",
        billSaving: "",
        tax: taxLine(monthly),
      },
    };
  }

  return Object.fromEntries(
    BILLING_CYCLES.map((cycle) => {
      const total = cycleAmount(monthly, cycle);
      const each = perMonth(total, cycle.months);
      const saved = cycleSaving(monthly, cycle);

      return [
        cycle.id,
        {
          /* The headline is always the per-month equivalent. Leading with the
             cycle total would compare a monthly figure against an annual one
             and make the discounted plan look like the expensive one. */
          fig: money(each),
          per: "/month",
          /* Monthly billing says nothing here: "₹1,50,000 billed monthly"
             under a headline of "₹1,50,000/month" is the same fact twice. */
          billTotal:
            cycle.months === 1 ? "" : `${money(total)} ${cycle.billedAs}`,
          billSaving: saved > 0 ? `save ${money(saved)}` : "",
          /* Tax is quoted on what is actually invoiced — the cycle total, not
             the per-month equivalent. */
          tax: taxLine(total),
        },
      ];
    }),
  );
}

export function buildView(payload: PricingPayload, active: string): PricingView {
  const currencies = payload.currencies as unknown as Currency[];
  const currency = currencies.find((c) => c.code === active) ?? currencies[0];

  const families: PricingFamilyView[] = FAMILIES.map((meta) => {
    const familyFeatures = payload.features.filter((f) => f.family === meta.id);
    const ordered = payload.plans
      .filter((p) => p.family === meta.id)
      .sort((a, b) => a.tier_order - b.tier_order);

    /** What one tier actually has: label -> cell value, absences dropped. */
    const heldBy = (slug: string) =>
      new Map(
        familyFeatures
          .map((f) => [f.label, (f.values ?? {})[slug] ?? "—"] as const)
          .filter(([, v]) => v !== "—" && v !== ""),
      );

    const plans: PricingPlanView[] = ordered
      .map((p, tier): PricingPlanView | null => {
        const amount = planAmount(p.id, currency, payload.amounts);
        if (amount === null) return null;

        const oneTime = p.price_type === "one_time";

        /* The card lists what this tier ADDS over the one below it, under an
           "Everything in X, plus" line. Repeating all seventeen rows on all
           three cards made them unreadable and buried the actual difference,
           which is the only thing a visitor comparing tiers is looking for.

           A row carries over when it is present at the same value, and is
           listed when it is new OR when its value moved — "Technical Support"
           going from a tick to "Priority" is an upgrade and has to show. */
        const mine = heldBy(p.slug);
        const below = tier > 0 ? heldBy(ordered[tier - 1].slug) : new Map();

        const includes = [...mine]
          .filter(([label, value]) => below.get(label) !== value)
          .map(([label, value]) =>
            value === "✓" ? { label } : { label, note: value },
          );

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          blurb: p.blurb,
          featured: p.featured,
          oneTime,
          includes,
          inheritsFrom: tier > 0 ? ordered[tier - 1].name : undefined,
          /* Every currency, not just the active one, so a switch is a lookup
             rather than a fetch. */
          cells: Object.fromEntries(
            currencies
              .map((c) => {
                const a = planAmount(p.id, c, payload.amounts);
                return a === null ? null : [c.code, cellsFor(a, c, oneTime)];
              })
              .filter(Boolean) as [string, Record<string, PriceCell>][],
          ),
        };
      })
      /* A plan with no figure in this currency is dropped rather than shown at
         zero. The dashboard flags the gap. */
      .filter((p): p is PricingPlanView => p !== null);

    return {
      ...meta,
      plans,
      features: payload.features
        .filter((f) => f.family === meta.id)
        .map((f) => ({ label: f.label, values: f.values ?? {} })),
    };
  });

  return {
    active: currency?.code ?? "USD",
    currencies: currencies.map((c) => ({
      code: c.code,
      symbol: c.symbol,
      /* Dirhams have no glyph, so symbol and code are the same string and
         "AED (AED)" is what a naive label produces. */
      label: c.symbol === c.code ? c.code : `${c.code} (${c.symbol})`,
      derived: !c.authored,
    })),
    families,
  };
}
