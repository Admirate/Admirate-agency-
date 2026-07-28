import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import PricingClient from "@/components/pricing/PricingClient";
import type {
  PriceCell,
  PricingFamilyView,
  PricingPlanView,
  PricingView,
} from "@/components/pricing/content";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld, AREA_SERVED } from "@/lib/schema";
import {
  BILLING_CYCLES,
  cycleAmount,
  cycleSaving,
  formatPrice,
  perMonth,
  planAmount,
  resolveCurrency,
  taxOn,
  withTax,
  type Currency,
} from "@/lib/pricing";
import type { Database } from "@/types/database";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "ADMIRATE's published rates for digital retainers, website development and website care — shown in your own currency, with no quote request required.",
  path: "/pricing",
});

/* ---------------------------------------------------------------- data ---- */

type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

type Payload = {
  currencies: Row<"pricing_currencies">[];
  plans: Row<"pricing_plans">[];
  amounts: Row<"pricing_amounts">[];
  features: Row<"pricing_features">[];
};

/**
 * Reads the rate card behind the `pricing` cache tag.
 *
 * An anonymous client, not the cookie-bound one from `lib/supabase/server`:
 * this is public data under a public-SELECT policy, and `cookies()` cannot be
 * called inside `unstable_cache` anyway. The database is queried when an
 * administrative write invalidates the tag, not on every page view — so the
 * per-request work is header parsing and string formatting, nothing more.
 */
const getPricing = unstable_cache(
  async (): Promise<Payload> => {
    const supabase = createClient<Database>(
      process.env.SB_URL!,
      process.env.SB_KEY!,
    );

    const [currencies, plans, amounts, features] = await Promise.all([
      supabase
        .from("pricing_currencies")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_plans")
        .select("*")
        .order("tier_order", { ascending: true }),
      supabase.from("pricing_amounts").select("*"),
      supabase
        .from("pricing_features")
        .select("*")
        .order("row_order", { ascending: true }),
    ]);

    /* A failure throws rather than returning empty. The framework error
       boundary is a better answer than a pricing page showing blank prices. */
    const failed = [currencies, plans, amounts, features].find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    return {
      currencies: currencies.data ?? [],
      plans: plans.data ?? [],
      amounts: amounts.data ?? [],
      features: features.data ?? [],
    };
  },
  ["pricing-payload"],
  { tags: ["pricing"], revalidate: 3600 },
);

/* ---------------------------------------------------------------- copy ---- */

const FAMILIES = [
  {
    id: "retainer" as const,
    /* The eyebrow states how you are charged rather than counting sections.
       Three products are not a sequence, so "01 / 02 / 03" was decorating the
       page; the billing model is information you need before reading a figure. */
    eyebrow: "DIGITAL RETAINER — BILLED MONTHLY",
    title: "The month, <em>handled</em>.",
    lead: "Planned, written, designed, published, reported. The same rhythm every month, so your presence stops depending on who remembers to post.",
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
    eyebrow: "WEBSITE DEVELOPMENT — ONE PAYMENT",
    title: "Built once. Built <em>right</em>.",
    lead: "Design, copy, structure and the integrations that turn a visit into an enquiry. There is no monthly fee on the site itself.",
    bg: "#FAFAF8",
    cycles: false,
    service: "Digital",
  },
  {
    id: "care" as const,
    eyebrow: "WEBSITE CARE — BILLED MONTHLY",
    title: "Kept fast, safe and <em>current</em>.",
    lead: "Updates, backups, monitoring and the edits you actually ask for — so the site you paid for is still the site you have in two years.",
    bg: "#0B0B0C",
    dark: true,
    cycles: true,
    service: "Digital",
  },
];

/* --------------------------------------------------------------- build ---- */

/** Every cycle's rendered figures for one plan in one currency. */
function cellsFor(
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

function buildView(payload: Payload, active: string): PricingView {
  const currencies = payload.currencies as unknown as Currency[];
  const currency =
    currencies.find((c) => c.code === active) ?? currencies[0];

  const families: PricingFamilyView[] = FAMILIES.map((meta) => {
    const plans: PricingPlanView[] = payload.plans
      .filter((p) => p.family === meta.id)
      .map((p) => {
        const amount = planAmount(p.id, currency, payload.amounts);
        if (amount === null) return null;

        const oneTime = p.price_type === "one_time";

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          blurb: p.blurb,
          featured: p.featured,
          oneTime,
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

/* ---------------------------------------------------------------- page ---- */

export default async function PricingPage() {
  const payload = await getPricing();

  /* Netlify supplies the visitor's country on this header at no cost, so the
     correct currency is in the delivered HTML. Reading it opts this route out
     of static rendering, which is accepted: the per-request work is header
     parsing and string formatting against an already-cached payload. */
  const country = (await headers()).get("x-nf-country");
  const cookie = (await cookies()).get("admirate_ccy")?.value ?? null;

  const currencies = payload.currencies as unknown as Currency[];
  const active = resolveCurrency(cookie, country, currencies);

  const view = buildView(payload, active);

  /* Offers are always quoted in INR regardless of who is reading, so the
     machine-readable price does not vary with the crawler's location. */
  const inr = currencies.find((c) => c.code === "INR");
  const offers = inr
    ? view.families.flatMap((family) =>
        family.plans.flatMap((plan) => {
          const cell = plan.cells.INR?.monthly;
          if (!cell) return [];
          const amount = planAmount(plan.id, inr, payload.amounts);
          if (amount === null) return [];

          return [
            {
              "@type": "Offer",
              name: `${family.title.replace(/<[^>]+>/g, "")} — ${plan.name}`,
              price: String(amount),
              priceCurrency: "INR",
              /* Stated so the figure is not read as tax-inclusive. */
              valueAddedTaxIncluded: false,
              url: `${SITE.url}/pricing`,
              availability: "https://schema.org/InStock",
            },
          ];
        }),
      )
    : [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE.url}/pricing#service`,
      name: "Design and marketing retainers, websites and website care",
      description:
        "ADMIRATE's published rates for digital retainers, website development and website care.",
      url: `${SITE.url}/pricing`,
      provider: { "@id": `${SITE.url}/#organization` },
      areaServed: AREA_SERVED,
      ...(offers.length ? { offers } : {}),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <PricingClient view={view} />
    </>
  );
}
