-- Pricing tables for the public /pricing page.
--
-- Four tables, all public-readable and admin-writable. Reads are open because
-- the marketing page renders from them; writes go through the service-role
-- client behind requireAdmin(), exactly as portfolio_projects does. No write
-- policy is granted to anon or authenticated, so an open POST cannot put an
-- attacker-chosen price on a public page.
--
-- Only the MONTHLY base is stored for recurring plans. Quarterly, six-month and
-- annual figures are derived at render time in src/lib/pricing.ts. Storing them
-- would let an administrator change a monthly price and leave the annual price
-- stale, which is the one failure mode a pricing page cannot survive.

-- ---------------------------------------------------------------- currencies
CREATE TABLE IF NOT EXISTS pricing_currencies (
  code            TEXT PRIMARY KEY,
  symbol          TEXT        NOT NULL,
  countries       TEXT[]      NOT NULL DEFAULT '{}',
  -- authored: prices are stored per plan in pricing_amounts.
  -- derived:  prices are computed from the AED base times `rate`.
  authored        BOOLEAN     NOT NULL DEFAULT false,
  rate            NUMERIC,
  rate_updated_at TIMESTAMPTZ,
  -- Rounding increment for derived currencies. Never applied when authored.
  round_to        INTEGER     NOT NULL DEFAULT 10,
  -- Tax is data, not a constant, so a rate change is an administrative action.
  -- NULL means "we make no claim", which is not the same as zero — the page
  -- omits the line entirely rather than asserting a foreign rate it cannot
  -- stand behind.
  tax_rate        NUMERIC,
  tax_label       TEXT,
  active          BOOLEAN     NOT NULL DEFAULT true,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  CONSTRAINT pricing_currencies_tax_pair CHECK (
    (tax_rate IS NULL AND tax_label IS NULL)
    OR (tax_rate IS NOT NULL AND tax_label IS NOT NULL)
  )
);

-- --------------------------------------------------------------------- plans
CREATE TABLE IF NOT EXISTS pricing_plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family     TEXT    NOT NULL CHECK (family IN ('retainer', 'website', 'care')),
  slug       TEXT    NOT NULL,
  name       TEXT    NOT NULL,
  blurb      TEXT    NOT NULL DEFAULT '',
  tier_order INTEGER NOT NULL DEFAULT 0,
  featured   BOOLEAN NOT NULL DEFAULT false,
  price_type TEXT    NOT NULL CHECK (price_type IN ('recurring', 'one_time')),
  UNIQUE (family, slug)
);

-- ------------------------------------------------------------------- amounts
-- Rows exist only for authored currencies. A derived currency has no row here
-- by design; its figure is computed from the AED base at render time.
CREATE TABLE IF NOT EXISTS pricing_amounts (
  plan_id       UUID    NOT NULL REFERENCES pricing_plans (id) ON DELETE CASCADE,
  currency_code TEXT    NOT NULL REFERENCES pricing_currencies (code) ON DELETE CASCADE,
  -- Monthly base for recurring plans; the single price for one-time plans.
  amount        NUMERIC NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (plan_id, currency_code)
);

-- ------------------------------------------------------------------ features
-- `values` maps plan slug to cell value. The renderer treats '✓' and '—' as
-- symbols needing accessible labels, and anything else as literal text.
CREATE TABLE IF NOT EXISTS pricing_features (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family    TEXT    NOT NULL CHECK (family IN ('retainer', 'website', 'care')),
  label     TEXT    NOT NULL,
  row_order INTEGER NOT NULL DEFAULT 0,
  values    JSONB   NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS pricing_plans_family_idx    ON pricing_plans (family, tier_order);
CREATE INDEX IF NOT EXISTS pricing_features_family_idx ON pricing_features (family, row_order);

-- ------------------------------------------------------------------------ RLS
ALTER TABLE pricing_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_amounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_features   ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pricing_currencies' AND policyname = 'pricing_currencies_public_read') THEN
    CREATE POLICY pricing_currencies_public_read ON pricing_currencies FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pricing_plans' AND policyname = 'pricing_plans_public_read') THEN
    CREATE POLICY pricing_plans_public_read ON pricing_plans FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pricing_amounts' AND policyname = 'pricing_amounts_public_read') THEN
    CREATE POLICY pricing_amounts_public_read ON pricing_amounts FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pricing_features' AND policyname = 'pricing_features_public_read') THEN
    CREATE POLICY pricing_features_public_read ON pricing_features FOR SELECT TO anon, authenticated USING (true);
  END IF;
END
$$;

-- ===========================================================================
-- SEED
-- ===========================================================================

-- AED is the base currency: it is what the rate card was authored in, and its
-- USD peg at 3.6725 makes it a stable base for derived rates.
--
-- INR is authored rather than derived on purpose. Its seed values are AED at
-- ₹24.00 per dirham rounded to ₹500, but they are then fixed — a derived INR
-- would drift by hundreds of rupees on every daily rate refresh, which is not
-- acceptable for the primary market. Only the secondary currencies float.
--
-- `rate` for the derived currencies is a plausible starting value only. The
-- daily FX job overwrites all three; these exist so the page renders before the
-- job has ever run.
INSERT INTO pricing_currencies
  (code, symbol, countries, authored, rate, round_to, tax_rate, tax_label, active, sort_order)
VALUES
  ('AED', 'AED', ARRAY['AE','SA','QA','KW','OM','BH'],          true,  NULL,   50, 0.05, 'VAT', true, 1),
  ('INR', '₹',   ARRAY['IN'],                                    true,  NULL,  500, 0.18, 'GST', true, 2),
  ('USD', '$',   ARRAY['US','CA','AU','SG','NZ'],                false, 0.2723, 10, NULL, NULL,  true, 3),
  ('GBP', '£',   ARRAY['GB','IE'],                               false, 0.2140, 10, NULL, NULL,  true, 4),
  ('EUR', '€',   ARRAY['DE','FR','NL','ES','IT','BE','PT','AT'], false, 0.2500, 10, NULL, NULL,  true, 5)
ON CONFLICT (code) DO NOTHING;

-- Digital Retainer and Website Care are monthly. Website Development is
-- one-time.
INSERT INTO pricing_plans (family, slug, name, blurb, tier_order, featured, price_type)
VALUES
  ('retainer', 'launch',     'Launch',     'Consistent presence, handled properly.',        1, false, 'recurring'),
  ('retainer', 'growth',     'Growth',     'More output, more channels, more pressure.',    2, true,  'recurring'),
  ('retainer', 'scale',      'Scale',      'Everything on, everything unlimited.',          3, false, 'recurring'),
  ('website',  'launch',     'Launch',     'A fast, credible site that converts.',          1, false, 'one_time'),
  ('website',  'growth',     'Growth',     'Bookings, payments and a customer dashboard.',  2, true,  'one_time'),
  ('website',  'enterprise', 'Enterprise', 'Custom build, CMS and integrations.',           3, false, 'one_time'),
  ('care',     'care',       'Care',       'Kept secure, backed up and monitored.',         1, false, 'recurring'),
  ('care',     'manage',     'Manage',     'Care, plus the edits you actually need.',       2, true,  'recurring'),
  ('care',     'grow',       'Grow',       'Managed, optimised and reported on monthly.',   3, false, 'recurring')
ON CONFLICT (family, slug) DO NOTHING;

-- Monthly base (retainer, care) or one-time price (website).
INSERT INTO pricing_amounts (plan_id, currency_code, amount)
SELECT p.id, v.currency_code, v.amount
FROM pricing_plans p
JOIN (VALUES
  ('retainer', 'launch',     'AED',   4250),
  ('retainer', 'growth',     'AED',   6250),
  ('retainer', 'scale',      'AED',  10250),
  ('website',  'launch',     'AED',   5750),
  ('website',  'growth',     'AED',   8950),
  ('website',  'enterprise', 'AED',  14950),
  ('care',     'care',       'AED',    750),
  ('care',     'manage',     'AED',   1450),
  ('care',     'grow',       'AED',   2750),
  ('retainer', 'launch',     'INR', 102000),
  ('retainer', 'growth',     'INR', 150000),
  ('retainer', 'scale',      'INR', 246000),
  ('website',  'launch',     'INR', 138000),
  ('website',  'growth',     'INR', 215000),
  ('website',  'enterprise', 'INR', 359000),
  ('care',     'care',       'INR',  18000),
  ('care',     'manage',     'INR',  35000),
  ('care',     'grow',       'INR',  66000)
) AS v (family, slug, currency_code, amount)
  ON v.family = p.family AND v.slug = p.slug
ON CONFLICT (plan_id, currency_code) DO NOTHING;

-- Feature matrix, transcribed from the source rate card: fifteen rows for the
-- retainer, twenty-one for website development, twelve for care.
INSERT INTO pricing_features (family, label, row_order, values)
VALUES
  ('retainer', 'Posts',                      1,  '{"launch":"8","growth":"12","scale":"16"}'),
  ('retainer', 'Reels',                      2,  '{"launch":"4","growth":"6","scale":"8"}'),
  ('retainer', 'Social Media Management',    3,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Social Media Publishing',    4,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Professional Copywriting',   5,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Monthly Content Planning',   6,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Meta Ads Support',           7,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Google Ads Support',         8,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Website Maintenance',        9,  '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Monthly Report',             10, '{"launch":"✓","growth":"✓","scale":"✓"}'),
  ('retainer', 'Landing Page Updates',       11, '{"launch":"—","growth":"—","scale":"✓"}'),
  ('retainer', 'Email Marketing Creatives',  12, '{"launch":"—","growth":"✓","scale":"✓"}'),
  ('retainer', 'Festive Creatives',          13, '{"launch":"Included","growth":"Unlimited","scale":"Unlimited"}'),
  ('retainer', 'Business Card Designs',      14, '{"launch":"—","growth":"4 One-Time","scale":"Unlimited"}'),
  ('retainer', 'Outdoor Hoarding Designs',   15, '{"launch":"1/Quarter","growth":"2/Quarter","scale":"Unlimited"}'),

  ('website',  'Premium Pages',              1,  '{"launch":"Up to 5","growth":"Up to 5 + Booking","enterprise":"Unlimited"}'),
  ('website',  'Premium UI/UX',              2,  '{"launch":"✓","growth":"✓","enterprise":"Custom"}'),
  ('website',  'Responsive Design',          3,  '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'Unlimited Design Revisions', 4,  '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'Unlimited Content Revisions',5,  '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'WhatsApp Integration',       6,  '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'Contact Forms',              7,  '{"launch":"✓","growth":"✓","enterprise":"Custom"}'),
  ('website',  'SEO Maintenance',            8,  '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'Google Analytics',           9,  '{"launch":"✓","growth":"✓","enterprise":"Dashboard"}'),
  ('website',  'Mobile Optimisation',        10, '{"launch":"✓","growth":"✓","enterprise":"✓"}'),
  ('website',  'Booking System',             11, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Appointment Scheduling',     12, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Calendar Integration',       13, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Payment Gateway',            14, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Customer Dashboard',         15, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Admin Dashboard',            16, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'Lead Management',            17, '{"launch":"—","growth":"✓","enterprise":"✓"}'),
  ('website',  'CRM Integration',            18, '{"launch":"—","growth":"—","enterprise":"✓"}'),
  ('website',  'API Integrations',           19, '{"launch":"—","growth":"—","enterprise":"✓"}'),
  ('website',  'Blog & CMS',                 20, '{"launch":"—","growth":"—","enterprise":"✓"}'),
  ('website',  'Complete Copywriting',       21, '{"launch":"—","growth":"—","enterprise":"✓"}'),

  ('care',     'Security Updates',           1,  '{"care":"✓","manage":"✓","grow":"✓"}'),
  ('care',     'Plugin Updates',             2,  '{"care":"✓","manage":"✓","grow":"✓"}'),
  ('care',     'Website Backups',            3,  '{"care":"✓","manage":"✓","grow":"✓"}'),
  ('care',     'Performance Monitoring',     4,  '{"care":"✓","manage":"✓","grow":"✓"}'),
  ('care',     'Technical Support',          5,  '{"care":"✓","manage":"✓","grow":"Priority"}'),
  ('care',     'Content Updates',            6,  '{"care":"—","manage":"✓","grow":"Unlimited"}'),
  ('care',     'Banner & Image Changes',     7,  '{"care":"—","manage":"✓","grow":"✓"}'),
  ('care',     'Minor Design Updates',       8,  '{"care":"—","manage":"✓","grow":"✓"}'),
  ('care',     'Landing Page Updates',       9,  '{"care":"—","manage":"✓","grow":"New Pages"}'),
  ('care',     'SEO Maintenance',            10, '{"care":"—","manage":"—","grow":"✓"}'),
  ('care',     'Conversion Optimisation',    11, '{"care":"—","manage":"—","grow":"✓"}'),
  ('care',     'Monthly Website Report',     12, '{"care":"—","manage":"—","grow":"✓"}')
ON CONFLICT DO NOTHING;
