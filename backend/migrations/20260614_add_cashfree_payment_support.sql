ALTER TABLE payment_settings
  ADD COLUMN cashfree_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN cashfree_qr_url TEXT,
  ADD COLUMN cashfree_instructions TEXT;

UPDATE payment_settings
SET cashfree_qr_url = COALESCE(NULLIF(cashfree_qr_url, ''), default_qr_image)
WHERE id = 1;

ALTER TABLE teams
MODIFY COLUMN payment_method ENUM('upi', 'paystack', 'cashfree') DEFAULT 'upi';
