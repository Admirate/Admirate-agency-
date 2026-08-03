import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import StartClient from "@/components/start/StartClient";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, ld } from "@/lib/schema";
import { resolveCurrency, type Currency } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-data";
import { buildView } from "@/lib/pricing-view";

export const metadata: Metadata = pageMeta({
  title: "Start a Project",
  description:
    "Build your brief in a few short steps — pick a service and a plan, tell us about the project, and we reply within one working day.",
  path: "/start-project",
});

const jsonLd = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Start a Project", path: "/start-project" },
]);

/**
 * Server-rendered for the same reason /pricing is: the wizard's plan cards
 * carry real figures in the visitor's own currency, and those have to be in
 * the delivered HTML rather than fetched after paint.
 *
 * The payload is the one behind the `pricing` cache tag, so a price corrected
 * in the dashboard moves here and on /pricing together — the two pages cannot
 * quote different numbers.
 */
export default async function StartProjectPage() {
  const payload = await getPricing();

  /* Netlify supplies the visitor's country on this header at no cost. Reading
     it opts this route out of static rendering, which is accepted: the
     per-request work is header parsing and string formatting against an
     already-cached payload. */
  const country = (await headers()).get("x-nf-country");
  const cookie = (await cookies()).get("admirate_ccy")?.value ?? null;

  const currencies = payload.currencies as unknown as Currency[];
  const view = buildView(payload, resolveCurrency(cookie, country, currencies));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <StartClient view={view} />
    </>
  );
}
