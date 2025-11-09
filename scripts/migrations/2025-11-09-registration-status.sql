-- Add status to all registration tables
-- Values: pending | accepted | rejected

ALTER TABLE tutors
  ADD COLUMN IF NOT EXISTS status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER payment_status;

ALTER TABLE tutees
  ADD COLUMN IF NOT EXISTS status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER payment_status;

ALTER TABLE trainings
  ADD COLUMN IF NOT EXISTS status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER payment_status;

ALTER TABLE researches
  ADD COLUMN IF NOT EXISTS status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER payment_status;

ALTER TABLE entrepreneurships
  ADD COLUMN IF NOT EXISTS status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER payment_status;


