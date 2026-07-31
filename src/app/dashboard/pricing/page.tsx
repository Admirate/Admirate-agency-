"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/dashboard/ui";

/**
 * Pricing administration.
 *
 * The point of putting prices in the database was that changing one is an
 * administrative action rather than a developer task, so this screen has to
 * cover everything a price change actually involves: the amounts, the tax
 * rates that ride on them, and enough visibility into the derived currencies
 * to tell "the rate is stale" from "the page is broken".
 *
 * Only the monthly base is editable for recurring plans. The quarterly,
 * six-month and annual figures are derived at render time and are shown here
 * read-only, so an administrator can see what a change does without being able
 * to leave the two disagreeing.
 */

type Currency = {
  code: string;
  symbol: string;
  countries: string[];
  authored: boolean;
  rate: number | null;
  rate_updated_at: string | null;
  round_to: number;
  tax_rate: number | null;
  tax_label: string | null;
  active: boolean;
  sort_order: number;
};

type Plan = {
  id: string;
  family: "retainer" | "website" | "care";
  slug: string;
  name: string;
  blurb: string;
  tier_order: number;
  featured: boolean;
  price_type: "recurring" | "one_time";
};

type Amount = { plan_id: string; currency_code: string; amount: number };

type Feature = {
  id: string;
  family: "retainer" | "website" | "care";
  label: string;
  row_order: number;
  values: Record<string, string>;
};

const FAMILY_LABELS: Record<Plan["family"], string> = {
  retainer: "Digital Retainer",
  website: "Website Development",
  care: "Website Care",
};

/* Mirrors BILLING_CYCLES in lib/pricing.ts. Duplicated rather than imported
   because this screen only needs to *show* the derived figures, and importing
   the module would pull its types into a client bundle for no gain. If the
   discounts ever change there, they change here — the public page is the one
   that matters and it reads the real thing. */
const CYCLES = [
  { id: "quarterly", label: "Quarterly", months: 3, discountPct: 5 },
  { id: "biannual", label: "6 months", months: 6, discountPct: 10 },
  { id: "annual", label: "Annual", months: 12, discountPct: 15 },
];

const derive = (monthly: number, months: number, discountPct: number) =>
  Math.ceil(Number(((monthly * months * (100 - discountPct)) / 100).toFixed(6)));

const field =
  "w-full px-3 py-2 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50";

const PricingPage = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [amounts, setAmounts] = useState<Amount[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed");
      setCurrencies(data.currencies ?? []);
      setPlans(data.plans ?? []);
      setAmounts(data.amounts ?? []);
      setFeatures(data.features ?? []);
    } catch {
      toast.error("Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const authored = useMemo(
    () => currencies.filter((c) => c.authored),
    [currencies],
  );
  const derived = useMemo(
    () => currencies.filter((c) => !c.authored),
    [currencies],
  );

  const amountFor = (planId: string, code: string) =>
    amounts.find((a) => a.plan_id === planId && a.currency_code === code)
      ?.amount ?? null;

  /* An amount row may not exist yet, so this is an upsert (POST) rather than a
     PATCH — the API treats setting a first price and correcting an existing one
     as the same gesture. */
  const saveAmount = async (planId: string, code: string, raw: string) => {
    const value = raw.trim();
    if (value === "") return;

    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error("Enter a number");
      return;
    }
    if (amountFor(planId, code) === amount) return;

    const key = `${planId}:${code}`;
    setSaving(key);

    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "amounts",
          plan_id: planId,
          currency_code: code,
          amount,
        }),
      });

      if (!res.ok) throw new Error();

      setAmounts((prev) => {
        const rest = prev.filter(
          (a) => !(a.plan_id === planId && a.currency_code === code),
        );
        return [...rest, { plan_id: planId, currency_code: code, amount }];
      });
      toast.success("Price updated");
    } catch {
      toast.error("Failed to save price");
    } finally {
      setSaving(null);
    }
  };

  const saveCurrency = async (code: string, updates: Partial<Currency>) => {
    setSaving(`ccy:${code}`);
    try {
      const res = await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "currencies", code, ...updates }),
      });
      if (!res.ok) throw new Error();

      setCurrencies((prev) =>
        prev.map((c) => (c.code === code ? { ...c, ...updates } : c)),
      );
      toast.success(`${code} updated`);
    } catch {
      toast.error(`Failed to update ${code}`);
    } finally {
      setSaving(null);
    }
  };

  const saveFeature = async (id: string, values: Record<string, string>) => {
    setSaving(`feat:${id}`);
    try {
      const res = await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "features", id, values }),
      });
      if (!res.ok) throw new Error();

      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, values } : f)),
      );
      toast.success("Feature updated");
    } catch {
      toast.error("Failed to update feature");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="text-muted">Loading...</div>;

  /* Every plan that has no figure in an authored currency. Such a plan is
     dropped from that currency's rendering rather than shown at zero, so the
     gap has to surface here or it is invisible until someone notices a missing
     card on the live page. */
  const gaps = plans.flatMap((p) =>
    authored
      .filter((c) => amountFor(p.id, c.code) === null)
      .map((c) => `${FAMILY_LABELS[p.family]} — ${p.name} (${c.code})`),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pricing"
        description="Changes go live without a deployment. Only the monthly base is editable — longer cycles are derived from it."
      />

      {gaps.length > 0 && (
        <div className="bg-brand/5 border border-brand/25 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-brand">
            {gaps.length} missing {gaps.length === 1 ? "price" : "prices"}
          </h2>
          <p className="text-xs text-brand mt-1">
            These plans are hidden from the live page in that currency rather
            than shown at zero.
          </p>
          <ul className="text-xs text-brand mt-2 space-y-0.5">
            {gaps.map((g) => (
              <li key={g}>· {g}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------------------------------------------------- plans -- */}
      {(Object.keys(FAMILY_LABELS) as Plan["family"][]).map((family) => {
        const familyPlans = plans
          .filter((p) => p.family === family)
          .sort((a, b) => a.tier_order - b.tier_order);
        if (familyPlans.length === 0) return null;

        const oneTime = familyPlans[0].price_type === "one_time";

        return (
          <section
            key={family}
            className="bg-white border border-line rounded-xl p-6"
          >
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-ink">
                {FAMILY_LABELS[family]}
              </h2>
              <span className="text-xs text-muted">
                {oneTime ? "one-time price" : "monthly base"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wide">
                    <th className="pb-2 pr-4 font-medium">Plan</th>
                    {authored.map((c) => (
                      <th key={c.code} className="pb-2 pr-4 font-medium">
                        {c.code}
                      </th>
                    ))}
                    {!oneTime &&
                      CYCLES.map((cy) => (
                        <th
                          key={cy.id}
                          className="pb-2 pr-4 font-medium text-muted"
                        >
                          {cy.label} −{cy.discountPct}%
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {familyPlans.map((plan) => {
                    const base = amountFor(plan.id, authored[0]?.code ?? "AED");

                    return (
                      <tr key={plan.id} className="border-t border-line">
                        <td className="py-3 pr-4">
                          <span className="font-medium text-ink">
                            {plan.name}
                          </span>
                          {plan.featured && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-brand/10 text-brand rounded">
                              FEATURED
                            </span>
                          )}
                          <span className="block text-xs text-muted">
                            {plan.slug}
                          </span>
                        </td>

                        {authored.map((c) => {
                          const key = `${plan.id}:${c.code}`;
                          const value = amountFor(plan.id, c.code);

                          return (
                            <td key={c.code} className="py-3 pr-4">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                defaultValue={value ?? ""}
                                disabled={saving === key}
                                aria-label={`${plan.name} price in ${c.code}`}
                                onBlur={(e) =>
                                  saveAmount(plan.id, c.code, e.target.value)
                                }
                                className={`${field} w-32 ${value === null ? "border-brand/25 bg-brand/5" : ""}`}
                                placeholder="—"
                              />
                            </td>
                          );
                        })}

                        {/* Read-only: derived from the base immediately to the
                            left, so the two can never be edited apart. */}
                        {!oneTime &&
                          CYCLES.map((cy) => (
                            <td
                              key={cy.id}
                              className="py-3 pr-4 text-muted tabular-nums"
                            >
                              {base === null
                                ? "—"
                                : derive(
                                    base,
                                    cy.months,
                                    cy.discountPct,
                                  ).toLocaleString()}
                            </td>
                          ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!oneTime && (
              <p className="text-xs text-muted mt-3">
                Derived columns shown in {authored[0]?.code ?? "AED"}, rounded
                up to the whole unit.
              </p>
            )}
          </section>
        );
      })}

      {/* ----------------------------------------------------- currencies -- */}
      <section className="bg-white border border-line rounded-xl p-6">
        <h2 className="text-lg font-semibold text-ink mb-1">Currencies</h2>
        <p className="text-sm text-muted mb-4">
          Tax is added on top of every price shown on the site. Leave both tax
          fields empty to state no rate at all — that is not the same as zero,
          and the line is omitted entirely.
        </p>

        <div className="space-y-3">
          {currencies.map((c) => (
            <div
              key={c.code}
              className="flex flex-wrap items-end gap-3 p-3 border border-line rounded-lg"
            >
              <div className="w-20">
                <span className="block text-xs text-muted mb-1">Code</span>
                <span className="font-medium text-ink">{c.code}</span>
                <span className="block text-xs text-muted">
                  {c.authored ? "authored" : "derived"}
                </span>
              </div>

              <label className="block">
                <span className="block text-xs text-muted mb-1">
                  Tax rate (%)
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  defaultValue={
                    c.tax_rate === null
                      ? ""
                      : Number((c.tax_rate * 100).toFixed(2))
                  }
                  disabled={saving === `ccy:${c.code}`}
                  onBlur={(e) => {
                    const raw = e.target.value.trim();
                    const pct = raw === "" ? null : Number(raw);
                    if (pct !== null && !Number.isFinite(pct)) return;
                    const next = pct === null ? null : pct / 100;
                    if (next === c.tax_rate) return;
                    saveCurrency(c.code, {
                      tax_rate: next,
                      /* The table's CHECK constraint requires both or
                         neither, so clearing the rate clears the label. */
                      tax_label: next === null ? null : (c.tax_label ?? "TAX"),
                    });
                  }}
                  className={`${field} w-28`}
                  placeholder="—"
                />
              </label>

              <label className="block">
                <span className="block text-xs text-muted mb-1">
                  Tax label
                </span>
                <input
                  type="text"
                  defaultValue={c.tax_label ?? ""}
                  disabled={saving === `ccy:${c.code}` || c.tax_rate === null}
                  onBlur={(e) => {
                    const label = e.target.value.trim() || null;
                    if (label === c.tax_label) return;
                    if (c.tax_rate === null) return;
                    saveCurrency(c.code, { tax_label: label ?? "TAX" });
                  }}
                  className={`${field} w-28`}
                  placeholder="GST"
                />
              </label>

              <div className="min-w-[190px]">
                <span className="block text-xs text-muted mb-1">Rate</span>
                {c.authored ? (
                  <span className="text-sm text-muted">
                    not converted — prices are set above
                  </span>
                ) : (
                  <span className="text-sm text-ink tabular-nums">
                    {c.rate ?? "—"} / AED
                    <span className="block text-xs text-muted">
                      {c.rate_updated_at
                        ? `refreshed ${new Date(c.rate_updated_at).toLocaleString()}`
                        : "never refreshed — seed value in use"}
                    </span>
                  </span>
                )}
              </div>

              <label className="flex items-center gap-2 ml-auto text-sm text-muted">
                <input
                  type="checkbox"
                  defaultChecked={c.active}
                  disabled={saving === `ccy:${c.code}`}
                  onChange={(e) =>
                    saveCurrency(c.code, { active: e.target.checked })
                  }
                  className="accent-[#E3001B]"
                />
                Shown on site
              </label>
            </div>
          ))}
        </div>

        {derived.length > 0 && (
          <p className="text-xs text-muted mt-4">
            Derived rates refresh daily from European Central Bank reference
            rates. A failed refresh leaves the previous rate in place rather
            than clearing it.
          </p>
        )}
      </section>

      {/* -------------------------------------------------------- features -- */}
      {(Object.keys(FAMILY_LABELS) as Plan["family"][]).map((family) => {
        const rows = features
          .filter((f) => f.family === family)
          .sort((a, b) => a.row_order - b.row_order);
        if (rows.length === 0) return null;

        const slugs = plans
          .filter((p) => p.family === family)
          .sort((a, b) => a.tier_order - b.tier_order)
          .map((p) => p.slug);

        return (
          <section
            key={`feat-${family}`}
            className="bg-white border border-line rounded-xl p-6"
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-lg font-semibold text-ink">
                {FAMILY_LABELS[family]} — comparison rows
              </h2>
              <span className="text-xs text-muted">{rows.length} rows</span>
            </div>
            <p className="text-sm text-muted mb-4">
              Use ✓ for included and — for not included. Anything else is shown
              as written.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wide">
                    <th className="pb-2 pr-4 font-medium">Feature</th>
                    {slugs.map((s) => (
                      <th key={s} className="pb-2 pr-4 font-medium">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="py-2 pr-4 text-ink">{row.label}</td>
                      {slugs.map((slug) => (
                        <td key={slug} className="py-2 pr-4">
                          <input
                            type="text"
                            defaultValue={row.values?.[slug] ?? ""}
                            disabled={saving === `feat:${row.id}`}
                            aria-label={`${row.label} for ${slug}`}
                            onBlur={(e) => {
                              const next = e.target.value.trim();
                              if ((row.values?.[slug] ?? "") === next) return;
                              saveFeature(row.id, {
                                ...(row.values ?? {}),
                                [slug]: next,
                              });
                            }}
                            className={`${field} w-32`}
                            placeholder="—"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default PricingPage;
