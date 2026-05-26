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
  ('EARLY20', 20, 3.00, 12.00, 'qr12.png', TRUE),
  ('MEDIN10', 10, 1.50, 13.50, 'https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg', TRUE)
ON DUPLICATE KEY UPDATE
  discount_percentage = VALUES(discount_percentage),
  saved_amount = VALUES(saved_amount),
  final_price = VALUES(final_price),
  qr_image = VALUES(qr_image),
  active = VALUES(active);

CREATE TABLE IF NOT EXISTS payment_settings (
  id INT PRIMARY KEY DEFAULT 1,
  default_qr_image VARCHAR(500) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payment_settings (id, default_qr_image)
VALUES (1, 'https://i.postimg.cc/sg82803c/1500QR.jpg')
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  utr VARCHAR(255) NOT NULL,
  coupon_code VARCHAR(64) NULL,
  total_paid DECIMAL(10, 2) NOT NULL,
  team_size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registration_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  college VARCHAR(255) NULL,
  country VARCHAR(255) NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  website_name VARCHAR(255) NOT NULL DEFAULT 'Medinnovate',
  tagline VARCHAR(255) NULL,
  logo_url VARCHAR(500) NULL,
  favicon_url VARCHAR(500) NULL,
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  footer_text TEXT NULL,
  contact_email VARCHAR(255) NULL,
  instagram_url VARCHAR(500) NULL,
  linkedin_url VARCHAR(500) NULL,
  theme_colors JSON NULL,
  announcement TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (
  id,
  website_name,
  tagline,
  seo_title,
  seo_description,
  footer_text,
  contact_email,
  instagram_url,
  linkedin_url,
  theme_colors,
  announcement
)
VALUES (
  1,
  'Medinnovate',
  'International Healthcare Innovation Hackathon',
  'Medinnovate',
  'International healthcare innovation hackathon',
  'A global platform bringing together future healthcare leaders and innovators to solve real-world challenges.',
  'medinnovate2026@gmail.com',
  '',
  '',
  JSON_OBJECT('primary', '#7C3AED', 'accent', '#EC4899', 'background', '#F7F3FF'),
  'Registration is open for MedInnovate 2026.'
)
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS homepage_content (
  id INT PRIMARY KEY DEFAULT 1,
  hero_title VARCHAR(255) NULL,
  hero_subtitle VARCHAR(255) NULL,
  hero_description TEXT NULL,
  primary_cta_label VARCHAR(100) NULL,
  primary_cta_url VARCHAR(500) NULL,
  secondary_cta_label VARCHAR(100) NULL,
  secondary_cta_url VARCHAR(500) NULL,
  hero_media_url VARCHAR(500) NULL,
  highlights JSON NULL,
  stats JSON NULL,
  announcements JSON NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS navigation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  path VARCHAR(500) NULL,
  location VARCHAR(100) NOT NULL DEFAULT 'navbar',
  parent_id INT NULL,
  display_order INT NOT NULL DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  is_external BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  target VARCHAR(100) NOT NULL DEFAULT '_self',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO navigation (label, url, path, location, parent_id, display_order, order_index, is_external, is_published, visible, target)
SELECT * FROM (
  SELECT 'About', '#about', '#about', 'navbar', NULL, 1, 1, FALSE, TRUE, TRUE, '_self'
  UNION ALL SELECT 'Why Attend', '#why-attend', '#why-attend', 'navbar', NULL, 2, 2, FALSE, TRUE, TRUE, '_self'
  UNION ALL SELECT 'Who Can Join', '#participants', '#participants', 'navbar', NULL, 3, 3, FALSE, TRUE, TRUE, '_self'
  UNION ALL SELECT 'Judges', '#judges', '#judges', 'navbar', NULL, 4, 4, FALSE, TRUE, TRUE, '_self'
  UNION ALL SELECT 'Organising Committee', '/organising-committee', '/organising-committee', 'navbar', NULL, 5, 5, FALSE, TRUE, TRUE, '_self'
  UNION ALL SELECT 'Register', '/registration', '/registration', 'navbar', NULL, 6, 6, FALSE, TRUE, TRUE, '_self'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM navigation);

CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NULL,
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NULL,
  folder VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  size_bytes INT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_partners (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NULL,
  description TEXT NULL,
  logo_url TEXT NULL,
  website TEXT NULL,
  partner_type VARCHAR(100) NOT NULL DEFAULT 'academic',
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(255) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Published',
  display_order INT NOT NULL DEFAULT 0,
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO faq (question, answer, category, status, display_order, order_index, is_published)
SELECT * FROM (
  SELECT 'Is Medinnovate an online or offline event?', 'Medinnovate will follow a hybrid format. Phase 1 will be conducted online, and the Grand Finale will be held offline in India with a virtual presentation option for eligible participants who cannot attend in person.', 'Format', 'Published', 1, 1, TRUE
  UNION ALL SELECT 'Can I participate solo?', 'No. Participation requires a team of exactly 5 undergraduate students.', 'Eligibility', 'Published', 2, 2, TRUE
  UNION ALL SELECT 'Who can participate?', 'Undergraduate students from Africa and India can participate.', 'Eligibility', 'Published', 3, 3, TRUE
  UNION ALL SELECT 'Can team members be from different colleges or countries?', 'Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.', 'Team', 'Published', 4, 4, TRUE
  UNION ALL SELECT 'Is there any registration fee?', 'Yes. The registration fee is $3 per participant or $15 per team of 5 members.', 'Payment', 'Published', 5, 5, TRUE
  UNION ALL SELECT 'Will certificates be provided?', 'Yes. Certificates will be provided based on participation and completion criteria.', 'Benefits', 'Published', 6, 6, TRUE
  UNION ALL SELECT 'What is the selection process?', 'The selection process follows registration, submission, screening, mentorship, and final pitch.', 'Selection', 'Published', 7, 7, TRUE
  UNION ALL SELECT 'What happens if I cannot attend the final round in person?', 'A virtual option will be available for participants who cannot attend the final round in person.', 'Finale', 'Published', 8, 8, TRUE
  UNION ALL SELECT 'What kind of ideas can we submit?', 'You can submit healthcare innovation ideas that address meaningful real-world healthcare challenges.', 'Ideas', 'Published', 9, 9, TRUE
  UNION ALL SELECT 'How can I contact the team for support?', 'You can contact the team through email, Instagram, or WhatsApp.', 'Support', 'Published', 10, 10, TRUE
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM faq);

CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NULL,
  organization VARCHAR(255) NULL,
  group_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(100) NULL,
  bio TEXT NULL,
  photo_url VARCHAR(500) NULL,
  image_url VARCHAR(500) NULL,
  instagram VARCHAR(500) NULL,
  linkedin VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Published',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO team_members (name, role, organization, group_name, photo_url, image_url, email, instagram, linkedin, display_order, status, is_published)
SELECT * FROM (
  SELECT 'Abhishek Kashyap', 'GAIMS President', 'GAIMS', 'Leadership', '', '', '', '', '', 1, 'Published', TRUE
  UNION ALL SELECT 'Oluwasola Victor', 'CEO of BlueOzone', 'Blue Ozone Health', 'Leadership', '', '', '', '', '', 2, 'Published', TRUE
  UNION ALL SELECT 'Girik Subudhi', 'Organising Secretary GAIMS', 'GAIMS', 'Program Leads', '', '', 'giriksubudhi@gmail.com', '', '', 3, 'Published', TRUE
  UNION ALL SELECT 'Sofiyullah Salaudeen', 'Organising Secretary NiMSA', 'NIMSA', 'Program Leads', '', '', 'sofiyullahopeyemi@gmail.com', '', '', 4, 'Published', TRUE
  UNION ALL SELECT 'Elton M Mahulu', 'Organising Secretary FAMSA', 'FAMSA', 'Program Leads', '', '', 'mahuluelton007@gmail.com', '', '', 5, 'Published', TRUE
  UNION ALL SELECT 'Ogunka Favour', 'Organising Secretary BlueOzone Health', 'Blue Ozone Health', 'Program Leads', '', '', 'ogunkafavour@gmail.com', '', '', 6, 'Published', TRUE
  UNION ALL SELECT 'Sushmit Morey', 'IT Cell Lead', 'MedInnovate', 'Digital Operations', '', '', '', '', '', 7, 'Published', TRUE
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM team_members);
