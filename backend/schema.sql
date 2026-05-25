CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  discount_percentage DECIMAL(5, 2) NOT NULL,
  saved_amount DECIMAL(10, 2) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  qr_image VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO coupons (code, discount_percentage, saved_amount, final_price, qr_image, active)
VALUES
  ('MED10', 10, 1.50, 13.50, 'qr13_5.png', TRUE),
  ('EARLY20', 20, 3.00, 12.00, 'qr12.png', TRUE)
ON DUPLICATE KEY UPDATE
  discount_percentage = VALUES(discount_percentage),
  saved_amount = VALUES(saved_amount),
  final_price = VALUES(final_price),
  qr_image = VALUES(qr_image),
  active = VALUES(active);
