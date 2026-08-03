import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import PricingClient from "@/components/pricing/PricingClient";
import { pageMeta, SITE } from "@/lib/seo";
import { breadcrumbSchema, ld, AREA_SERVED } from "@/lib/schema";
import { planAmount, resolveCurrency, type Currency } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-data";
import { buildView } from "@/lib/pricing-view";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "ADMIRATE's published rates for digital retainers, website development and website care — shown in your own currency, with no quote request required.",
  path: "/pricing",
});

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
