-- Revisions to the Website Development and Website Care feature matrices.
--
-- The seed in 0002 transcribed the original rate card verbatim. This trims it
-- to what is actually sold, renames two rows whose labels overpromised, and
-- removes the one feature that appeared word-for-word in both the build and
-- the care column.
--
-- Row order is left with gaps rather than renumbered: the renderer sorts by
-- row_order and never displays it, so closing the gaps would be churn.

-- ---------------------------------------------------------------- removals --
-- Website Development.
DELETE FROM pricing_features
 WHERE family = 'website'
   AND label IN (
     'WhatsApp Integration',
     'API Integrations',
     'Complete Copywriting'
   );

-- Website Care.
DELETE FROM pricing_features
 WHERE family = 'care'
   AND label IN (
     'Plugin Updates',
     'Banner & Image Changes',
     'Conversion Optimisation'
   );

-- ------------------------------------------------------- de-duplication ----
-- "SEO Maintenance" was listed identically in both families. Maintenance is by
-- definition ongoing, which is the care plan's job, not the build's — so the
-- build's copy goes and care keeps it under a name that states its scope.
DELETE FROM pricing_features
 WHERE family = 'website'
   AND label = 'SEO Maintenance';

UPDATE pricing_features
   SET label = 'Minor SEO'
 WHERE family = 'care'
   AND label = 'SEO Maintenance';

-- ----------------------------------------------------------- relabelling ---
-- "Premium" was doing no work in front of a row that just counts pages.
UPDATE pricing_features
   SET label = 'Pages'
 WHERE family = 'website'
   AND label = 'Premium Pages';

-- Design revisions are capped per tier rather than unlimited, so the label no
-- longer claims otherwise and the cells carry the real numbers.
UPDATE pricing_features
   SET label  = 'Design Revisions',
       values = '{"launch":"2","growth":"3","enterprise":"5"}'::jsonb
 WHERE family = 'website'
   AND label  = 'Unlimited Design Revisions';
