-- Sync DB schema with API expectations

-- Researches: add optional profile columns and fix payment_status + delivery_method options
ALTER TABLE researches
  ADD COLUMN IF NOT EXISTS researchgate_id VARCHAR(255) NULL AFTER delivery_method,
  ADD COLUMN IF NOT EXISTS orcid VARCHAR(50) NULL AFTER researchgate_id,
  CHANGE COLUMN paymnet_status payment_status ENUM('paid','unpaid') NULL,
  MODIFY COLUMN delivery_method ENUM('online','face-to-face','online-&-face-to-face') NOT NULL;

-- Trainings: fix payment_status name and allow hybrid delivery
ALTER TABLE trainings
  CHANGE COLUMN paymnet_status payment_status ENUM('paid','unpaid') NULL,
  MODIFY COLUMN delivery_method ENUM('online','face-to-face','online-&-face-to-face') NOT NULL;

-- Tutees: add payment_status and allow hybrid delivery
ALTER TABLE tutees
  ADD COLUMN IF NOT EXISTS payment_status ENUM('paid','unpaid') NULL AFTER delivery_method,
  MODIFY COLUMN delivery_method ENUM('online','face-to-face','online-&-face-to-face') NOT NULL;

-- Entrepreneurships: add instructor and delivery, fix payment_status name
ALTER TABLE entrepreneurships
  ADD COLUMN IF NOT EXISTS instructor_id CHAR(36) NULL AFTER gender,
  ADD COLUMN IF NOT EXISTS delivery_method ENUM('online','face-to-face','online-&-face-to-face') NULL AFTER instructor_id,
  CHANGE COLUMN paymnet_status payment_status ENUM('paid','unpaid') NULL;


