-- Fields collected by the /start-project wizard. All nullable so the plain
-- contact path — which never sends them — and every existing row keep working
-- untouched. Same shape as 0001_brief_fields.sql.
--
-- These are columns rather than prose inside `message` so an enquiry can be
-- counted and routed: "how many Real Estate leads chose Growth" is a query,
-- not a read-through.
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS industry      TEXT,
  ADD COLUMN IF NOT EXISTS plan          TEXT,
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT;
