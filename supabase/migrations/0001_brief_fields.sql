-- Fields collected by the /start-project brief. All nullable/defaulted so the
-- existing contact path and every existing row keep working untouched.
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS company  TEXT,
  ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS budget   TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT;
