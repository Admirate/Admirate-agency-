-- Removes the "Manage" tier from the Website Care family.
--
-- Care now runs two tiers, Care and Grow. Grow's "Everything in X, plus" line
-- is derived from `tier_order` in src/app/pricing/page.tsx, so it re-points at
-- Care on its own and its delta list recomputes against Care's feature values.
-- Nothing needs renumbering: tier_order 1 and 3 order correctly with 2 absent.
--
-- The rows this removes, kept here because the deletion is otherwise
-- unrecoverable:
--
--   pricing_plans     care/manage  "Manage"  tier_order 2  featured  recurring
--                     blurb: "Care, plus the edits you actually need."
--   pricing_amounts   AED 1450, INR 35000
--   pricing_features  the "manage" key in nine care rows — ✓ on every one
--                     except "Constant SEO", which was "—"
--
-- pricing_features is keyed by family with a jsonb `values` map rather than by
-- plan, so the tier is not a row to delete there; the key has to come out of
-- each map, which is what the `- 'manage'` operator below does.

begin;

delete from pricing_amounts
where plan_id in (
  select id from pricing_plans where family = 'care' and slug = 'manage'
);

delete from pricing_plans
where family = 'care' and slug = 'manage';

update pricing_features
set values = values - 'manage'
where family = 'care' and values ? 'manage';

commit;
