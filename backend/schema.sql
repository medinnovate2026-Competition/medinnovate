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
  ('MED10', 10, 1.00, 9.00, 'qr9.png', TRUE),
  ('EARLY20', 20, 2.00, 8.00, 'qr8.png', TRUE),
  ('MEDIN10', 10, 1.00, 9.00, 'https://i.postimg.cc/7h71GTXp/fcrits-QR.jpg', TRUE)
ON DUPLICATE KEY UPDATE
  discount_percentage = VALUES(discount_percentage),
  saved_amount = VALUES(saved_amount),
  final_price = VALUES(final_price),
  qr_image = VALUES(qr_image),
  active = VALUES(active);

CREATE TABLE IF NOT EXISTS payment_settings (
  id INT PRIMARY KEY DEFAULT 1,
  default_qr_image VARCHAR(500) NOT NULL,
  upi_enabled BOOLEAN DEFAULT TRUE,
  paystack_enabled BOOLEAN DEFAULT FALSE,
  paystack_qr_url TEXT,
  paystack_payment_link TEXT,
  paystack_instructions TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payment_settings (id, default_qr_image, paystack_qr_url, paystack_payment_link)
VALUES (
  1,
  'https://i.postimg.cc/Hkj3MqWr/qr1000.jpg',
  'https://i.postimg.cc/BnMcnsrT/Paystack-QR.jpg',
  'https://paystack.com/buy/medinnovate-20-dhnwdw'
)
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS organising_committee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  photo_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO organising_committee (section, name, role, phone, email, photo_url, display_order)
SELECT * FROM (
  SELECT 'President', 'Abhishek Kashyap', 'GAIMS President', '', 'president@gaims.org', '', 1
  UNION ALL SELECT 'President', 'Oluwasola Victor', 'CEO of BlueOzone', '', 'blueozonehealth@gmail.com', '', 2
  UNION ALL SELECT 'Organising Secretary', 'Girik Subudhi', 'Organising Secretary GAIMS', '+918169011833', 'giriksubudhi@gmail.com', '', 1
  UNION ALL SELECT 'Organising Secretary', 'Sofiyullah Salaudeen', 'Organising Secretary NiMSA', '+2347038939481', 'sofiyullahopeyemi@gmail.com', '', 2
  UNION ALL SELECT 'Organising Secretary', 'Elton M Mahulu', 'Organising Secretary FAMSA', '+255628049726', 'mahuluelton007@gmail.com', '', 3
  UNION ALL SELECT 'Organising Secretary', 'Ogunka Favour', 'Organising Secretary BlueOzone Health', '+2348052747225', 'ogunkafavour@gmail.com', '', 4
  UNION ALL SELECT 'IT Cell', 'Sushmit Morey', 'IT Cell Lead', '+917262842562', 'itd@gaims.org', '', 1
  UNION ALL SELECT 'IT Cell', 'Laksh', 'IT Cell Member', '+917988025670', 'Laksh0360@gmail.com', '', 2
  UNION ALL SELECT 'IT Cell', 'Hardik Murari', 'IT Cell Member', '+918057596073', 'hardik.murari.md@gmail.com', '', 3
  UNION ALL SELECT 'Organising Committee', 'Collins-Ikpe Kennedy', 'Organising Committee Member', '+2349054268369', 'kennedycollinsikpe@gmail.com', '', 1
  UNION ALL SELECT 'Organising Committee', 'Wahida Ali', 'Organising Committee Member', '+255718961697', 'wahaly04@gmail.com', '', 2
  UNION ALL SELECT 'Organising Committee', 'Awogbemi Damilola', 'Organising Committee Member', '+2348148799692', 'damiloawo@gmail.com', '', 3
  UNION ALL SELECT 'Organising Committee', 'Okafor Chioma Rosemary', 'Organising Committee Member', '+2349022354168', 'bscrvo@gmail.com', '', 4
  UNION ALL SELECT 'Organising Committee', 'Toluwase O. Ogundipe', 'Organising Committee Member', '+2348068674210', 'itstoluwase@gmail.com', '', 5
  UNION ALL SELECT 'Organising Committee', 'Blessed Olaomo', 'Organising Committee Member', '+2348169123249', 'blessedolaomo@gmail.com', '', 6
  UNION ALL SELECT 'Organising Committee', 'Amrit Pundir', 'Organising Committee Member', '+918630458367', 'amritpun1317@gmail.com', '', 7
  UNION ALL SELECT 'Organising Committee', 'Manasvi Mukherjee', 'Organising Committee Member', '+917041689200', 'manasvimukherjee02@gmail.com', '', 8
  UNION ALL SELECT 'Organising Committee', 'Hadi Shaikh', 'Organising Committee Member', '+919870033700', 'hadishaikh2310@gmail.com', '', 9
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM organising_committee);

CREATE TABLE IF NOT EXISTS speakers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  institution VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  session_title VARCHAR(255),
  session_description TEXT,
  session_day VARCHAR(50),
  session_time VARCHAR(50),
  venue VARCHAR(255),
  linkedin_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS judges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  institution VARCHAR(255),
  speciality VARCHAR(255),
  bio TEXT,
  expertise TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  judge_type ENUM('faculty', 'industry', 'research', 'sponsor', 'external') DEFAULT 'faculty',
  featured BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tier ENUM('title', 'platinum', 'gold', 'silver', 'bronze', 'community', 'exhibitor', 'support') DEFAULT 'support',
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  booth_number VARCHAR(100),
  session_enabled BOOLEAN DEFAULT FALSE,
  session_title VARCHAR(255),
  session_description TEXT,
  display_order INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  section_name VARCHAR(255),
  title VARCHAR(255),
  subtitle TEXT,
  visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  background_type ENUM('default', 'light', 'dark', 'gradient', 'transparent') DEFAULT 'default',
  animation VARCHAR(100),
  custom_css_class VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO website_sections (section_key, section_name, title, subtitle, visible, display_order, background_type, animation, custom_css_class)
SELECT * FROM (
  SELECT 'hero', 'Hero', 'Medinnovate', 'International Healthcare Innovation Hackathon', TRUE, 1, 'default', 'fade', ''
  UNION ALL SELECT 'about', 'About', 'About MedInnovate', 'A global healthcare innovation platform for student teams.', TRUE, 2, 'light', 'slide-up', ''
  UNION ALL SELECT 'stats', 'Stats', 'Global participation', 'Event highlights and participation metrics.', TRUE, 3, 'default', 'fade', ''
  UNION ALL SELECT 'speakers', 'Speakers', 'Speakers', 'Meet keynote speakers and session leaders.', TRUE, 5, 'default', 'fade', ''
  UNION ALL SELECT 'judges', 'Judges', 'Judges', 'Reviewers, evaluators, and panel members.', TRUE, 6, 'light', 'fade', ''
  UNION ALL SELECT 'sponsors', 'Sponsors', 'Sponsors', 'Partners and supporting organisations.', FALSE, 7, 'default', 'fade', ''
  UNION ALL SELECT 'committee', 'Committee', 'Organising Committee', 'Meet the people coordinating MedInnovate.', TRUE, 8, 'light', 'slide-up', ''
  UNION ALL SELECT 'schedule', 'Schedule', 'Schedule', 'Event timeline and important milestones.', FALSE, 9, 'default', 'fade', ''
  UNION ALL SELECT 'faq', 'FAQ', 'Frequently Asked Questions', 'Answers to common participant questions.', TRUE, 10, 'light', 'fade', ''
  UNION ALL SELECT 'community', 'Community', 'Join the Community', 'Connect with MedInnovate for updates and announcements.', TRUE, 11, 'default', 'slide-up', ''
  UNION ALL SELECT 'footer', 'Footer', 'Footer', '', TRUE, 12, 'default', 'none', ''
  UNION ALL SELECT 'gallery', 'Gallery', 'Gallery', 'Event photos and media highlights.', FALSE, 13, 'default', 'fade', ''
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM website_sections);

CREATE TABLE IF NOT EXISTS master_cms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  setting_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO master_cms (setting_key, setting_value, setting_type)
SELECT * FROM (
  SELECT 'homepage_sections', '[]', 'json'
  UNION ALL SELECT 'site_theme', '{"mode":"default","primary_color":"#7C3AED","accent_color":"#EC4899","button_style":"rounded","animation_intensity":"normal"}', 'json'
  UNION ALL SELECT 'maintenance_mode', 'false', 'boolean'
  UNION ALL SELECT 'maintenance_message', 'MedInnovate is currently under maintenance. Please check back soon.', 'text'
  UNION ALL SELECT 'announcement_enabled', 'false', 'boolean'
  UNION ALL SELECT 'announcement_text', 'Registrations Open', 'text'
  UNION ALL SELECT 'countdown_enabled', 'false', 'boolean'
  UNION ALL SELECT 'countdown_date', '', 'text'
  UNION ALL SELECT 'registration_banner_enabled', 'false', 'boolean'
  UNION ALL SELECT 'registration_banner_text', 'Early Bird Open', 'text'
  UNION ALL SELECT 'popup_enabled', 'false', 'boolean'
  UNION ALL SELECT 'popup_title', 'Registrations Open', 'text'
  UNION ALL SELECT 'popup_content', 'Register your team and start building for public health.', 'text'
  UNION ALL SELECT 'schedule_enabled', 'false', 'boolean'
  UNION ALL SELECT 'gallery_enabled', 'false', 'boolean'
  UNION ALL SELECT 'sponsors_enabled', 'false', 'boolean'
  UNION ALL SELECT 'judges_enabled', 'true', 'boolean'
  UNION ALL SELECT 'speakers_enabled', 'true', 'boolean'
  UNION ALL SELECT 'committee_enabled', 'true', 'boolean'
  UNION ALL SELECT 'faq_enabled', 'true', 'boolean'
  UNION ALL SELECT 'community_enabled', 'true', 'boolean'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM master_cms);

CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  utr VARCHAR(255) NOT NULL,
  coupon_code VARCHAR(64) NULL,
  referral_code VARCHAR(100) NULL,
  total_paid DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  final_amount DECIMAL(10, 2) NULL,
  payment_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_amount DECIMAL(10, 2) NULL,
  verified_at TIMESTAMP NULL,
  payment_qr_type VARCHAR(50) NULL,
  payment_method ENUM('upi', 'paystack') DEFAULT 'upi',
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
  phone VARCHAR(100) NULL,
  discipline VARCHAR(255) NULL,
  study_year VARCHAR(100) NULL,
  gender VARCHAR(100) NULL,
  is_leader BOOLEAN NOT NULL DEFAULT FALSE,
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
  about_text TEXT NULL,
  stats_json JSON NULL,
  timeline_json JSON NULL,
  why_participate_json JSON NULL,
  cta_title VARCHAR(255) NULL,
  cta_description TEXT NULL,
  contact_json JSON NULL,
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
  UNION ALL SELECT 'Can I participate solo?', 'No. Participation requires a team of 3 to 5 undergraduate students.', 'Eligibility', 'Published', 2, 2, TRUE
  UNION ALL SELECT 'Who can participate?', 'Undergraduate students from Africa and India can participate.', 'Eligibility', 'Published', 3, 3, TRUE
  UNION ALL SELECT 'Can team members be from different colleges or countries?', 'Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.', 'Team', 'Published', 4, 4, TRUE
  UNION ALL SELECT 'Is there any registration fee?', 'Yes. The registration fee is $10 per team, with teams allowed to register 3 to 5 members.', 'Payment', 'Published', 5, 5, TRUE
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
