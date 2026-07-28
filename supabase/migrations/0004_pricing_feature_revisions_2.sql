-- Second pass over the Website Development and Website Care matrices.
--
-- Development loses four rows that were table stakes rather than selling
-- points. Care pushes three edit-type rows down into the entry tier and
-- promotes the monthly report into Manage.

-- --------------------------------------------------- website development ---
DELETE FROM pricing_features
 WHERE family = 'website'
   AND label IN (
     'Contact Forms',
     'Google Analytics',
     'Mobile Optimisation',
     'Lead Management'
   );

-- ------------------------------------------------------------ website care --
-- The three edit-type rows now start at Care rather than at Manage. Grow keeps
-- its richer values ("Unlimited", "New Pages"), so jsonb_set touches only the
-- care key and leaves the rest of each row alone.
UPDATE pricing_features
   SET values = jsonb_set(values, '{care}', '"✓"')
 WHERE family = 'care'
   AND label IN ('Content Updates', 'Minor Design Updates', 'Landing Page Updates');

-- The report moves into Manage. Grow already has it.
UPDATE pricing_features
   SET values = jsonb_set(values, '{manage}', '"✓"')
 WHERE family = 'care'
   AND label = 'Monthly Website Report';

-- SEO on a care plan is continuous, not occasional — the label now says so.
UPDATE pricing_features
   SET label = 'Constant SEO'
 WHERE family = 'care'
   AND label = 'Minor SEO';
