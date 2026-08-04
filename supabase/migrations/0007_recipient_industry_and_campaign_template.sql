-- Industry on a recipient, and the template plus audience on a campaign.
--
-- All three are additive and nullable-or-defaulted, in the same shape as
-- 0006_wizard_fields.sql, so every existing row keeps sending exactly as it
-- does now and no backfill is required. The empty value is today's behaviour
-- in each case: a null industry is still sendable, a null template_id is the
-- default template, and an empty industries array is everyone active.
--
-- No CHECK constraint on industry. The set of industries is a code constant
-- (src/lib/industries.ts) and the API coerces anything it does not recognise
-- to null; a constraint would instead make retiring an industry a migration,
-- and would fail a 5,000-row import mid-flight over one optional field of one
-- row.

ALTER TABLE email_recipients
  ADD COLUMN IF NOT EXISTS industry TEXT;

ALTER TABLE email_drafts
  ADD COLUMN IF NOT EXISTS template_id TEXT,
  ADD COLUMN IF NOT EXISTS industries  TEXT[] NOT NULL DEFAULT '{}';

-- Every send filters on active, and an aimed campaign also filters on
-- industry. 77 rows do not need this; a list that grows will.
CREATE INDEX IF NOT EXISTS email_recipients_active_industry_idx
  ON email_recipients (active, industry);
