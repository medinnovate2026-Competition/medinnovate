CREATE TABLE IF NOT EXISTS community_section (
  id INT PRIMARY KEY DEFAULT 1,
  title VARCHAR(255) NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  whatsapp_link VARCHAR(500) NULL,
  scroll_text VARCHAR(255) NULL,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO community_section (
  id,
  title,
  description,
  image_url,
  whatsapp_link,
  scroll_text,
  visible
)
VALUES (
  1,
  'Get In Contact With Us',
  'Stay connected with MedInnovate.\nJoin our community for updates, announcements, opportunities and event discussions.',
  '',
  'https://chat.whatsapp.com/KaUGYIbIMDr2HASOrnD7vp?mode=gi_t',
  '↓ Scroll down for registration',
  TRUE
)
ON DUPLICATE KEY UPDATE
  whatsapp_link = IF(whatsapp_link IS NULL OR whatsapp_link = '', VALUES(whatsapp_link), whatsapp_link);
