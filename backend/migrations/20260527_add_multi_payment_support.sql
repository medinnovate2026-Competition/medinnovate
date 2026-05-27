ALTER TABLE payment_settings
  ADD COLUMN upi_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN paystack_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN paystack_qr_url TEXT,
  ADD COLUMN paystack_payment_link TEXT,
  ADD COLUMN paystack_instructions TEXT;

ALTER TABLE teams
ADD COLUMN payment_method ENUM('upi', 'paystack') DEFAULT 'upi';

ALTER TABLE teams
ADD COLUMN discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN final_amount DECIMAL(10,2) NULL;

UPDATE teams
SET final_amount = total_paid
WHERE final_amount IS NULL;
