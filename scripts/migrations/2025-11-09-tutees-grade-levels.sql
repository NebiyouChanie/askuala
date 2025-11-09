-- Add JSON grade_levels to tutees and migrate existing values
ALTER TABLE tutees
  ADD COLUMN IF NOT EXISTS grade_levels JSON NULL AFTER gender;

-- Migrate single grade_level into grade_levels array where present
UPDATE tutees
SET grade_levels = JSON_ARRAY(grade_level)
WHERE grade_level IS NOT NULL AND (grade_levels IS NULL OR JSON_TYPE(grade_levels) IS NULL);

-- (Optional) keep grade_level for backward compatibility, or drop it after verifying all code paths:
-- ALTER TABLE tutees DROP COLUMN grade_level;


