-- Add JSON column for multiple training types and migrate existing single value
ALTER TABLE trainings
  ADD COLUMN IF NOT EXISTS training_types JSON NULL AFTER training_type;

UPDATE trainings
SET training_types = JSON_ARRAY(training_type)
WHERE training_type IS NOT NULL AND (training_types IS NULL OR JSON_TYPE(training_types) IS NULL);

-- Optional: drop old column after verifying all code paths
-- ALTER TABLE trainings DROP COLUMN training_type;


