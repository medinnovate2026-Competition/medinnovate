const cors = require("cors");
const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const path = require("path");

require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, ".env"), override: false });

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("REJECTION:", err);
});

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGINAL_PRICE = 10;
const DEFAULT_PAYMENT_QR_IMAGE = "https://i.postimg.cc/Hkj3MqWr/qr1000.jpg";
const DEFAULT_PAYSTACK_QR_IMAGE = "https://i.postimg.cc/BnMcnsrT/Paystack-QR.jpg";
const DEFAULT_PAYSTACK_PAYMENT_LINK = "https://paystack.com/buy/medinnovate-20-dhnwdw";
const DEFAULT_RAZORPAY_PAYMENT_LINK = "https://rzp.io/rzp/mes0HBY";
const DEFAULT_CASHFREE_QR_IMAGE = DEFAULT_PAYMENT_QR_IMAGE;
const PAYMENTS_DIR = path.join(__dirname, "public", "payments");
const MEDIA_DIR = path.join(__dirname, "public", "media");
const JSON_FIELDS = new Set(["social_links", "theme_colors", "highlights", "stats", "announcements", "metadata", "stats_json", "timeline_json", "why_participate_json", "contact_json"]);
const DEFAULT_WHATSAPP_INVITE_LINK = "https://chat.whatsapp.com/KaUGYIbIMDr2HASOrnD7vp?mode=gi_t";
const partnerCategoryConfig = require("./config/partnerCategories.json");
const Razorpay = require("razorpay");

const db = require("./config/database");
const cloudinary = require("./config/cloudinary");
const organisingCommitteeRoutes = require("./routes/admin/organisingCommittee");
const organisingCommitteeController = require("./controllers/organisingCommitteeController");
const speakerRoutes = require("./routes/admin/speakers");
const speakerController = require("./controllers/speakerController");
const judgeRoutes = require("./routes/admin/judges");
const judgeController = require("./controllers/judgeController");
const sponsorRoutes = require("./routes/admin/sponsors");
const sponsorController = require("./controllers/sponsorController");
const websiteBuilderRoutes = require("./routes/admin/websiteBuilder");
const websiteBuilderController = require("./controllers/websiteBuilderController");
const masterCmsRoutes = require("./routes/admin/masterCms");
const masterCmsController = require("./controllers/masterCmsController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const corsOptions = {
  origin: [
    "https://medinnovate2026-competition.github.io",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use("/payments", express.static(PAYMENTS_DIR));
app.use("/media", express.static(MEDIA_DIR));

app.get("/", (_req, res) => {
  res.json({
    status: "alive",
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/organising-committee", organisingCommitteeController.listMembers);
app.use("/api/admin/organising-committee", organisingCommitteeRoutes);
app.use("/api/admin/team", organisingCommitteeRoutes);
app.get("/api/speakers", speakerController.listSpeakers);
app.use("/api/admin/speakers", speakerRoutes);
app.get("/api/judges", judgeController.listJudges);
app.use("/api/admin/judges", judgeRoutes);
app.get("/api/sponsors", sponsorController.listPublicSponsors);
app.use("/api/admin/sponsors", sponsorRoutes);
app.get("/api/website-sections", websiteBuilderController.listPublicSections);
app.use("/api/admin/website-builder", websiteBuilderRoutes);
app.get("/api/master-config", masterCmsController.getPublicConfig);
app.use("/api/admin/master-cms", masterCmsRoutes);

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function toPublicQrPath(qrImage) {
  if (!qrImage) return "";
  if (/^https?:\/\//i.test(qrImage)) return qrImage;
  if (qrImage.startsWith("/payments/")) return qrImage;
  return `/payments/${qrImage}`;
}

function serializeCoupon(coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    discountPercentage: Number(coupon.discount_percentage),
    savedAmount: Number(coupon.saved_amount),
    finalPrice: Number(coupon.final_price),
    qrImage: coupon.qr_image,
    active: Boolean(coupon.active),
    razorpayPaymentLink: coupon.razorpay_payment_link || "",
  };
}

function serializePaymentSettings(row = {}) {
  return {
    default_qr_image: row.default_qr_image || "",
    defaultQrImage: toPublicQrPath(row.default_qr_image),
    upi_enabled: row.upi_enabled == null ? true : Boolean(row.upi_enabled),
    paystack_enabled: Boolean(row.paystack_enabled),
    paystack_qr_url: row.paystack_qr_url || "",
    paystackQrUrl: toPublicQrPath(row.paystack_qr_url),
    paystack_payment_link: row.paystack_payment_link || "",
    paystack_instructions: row.paystack_instructions || "",
    cashfree_enabled: Boolean(row.cashfree_enabled),
    cashfree_qr_url: row.cashfree_qr_url || "",
    cashfreeQrUrl: toPublicQrPath(row.cashfree_qr_url),
    cashfree_instructions: row.cashfree_instructions || "",
    razorpay_enabled: Boolean(row.razorpay_enabled),
    razorpay_payment_link: row.razorpay_payment_link || "",
  };
}

function parseJsonValue(value, fallback) {
  if (value == null || value === "") return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function serializeHomepageContent(row = {}) {
  const stats = parseJsonValue(row.stats_json ?? row.stats, []);
  const timeline = parseJsonValue(row.timeline_json, []);
  const whyParticipate = parseJsonValue(row.why_participate_json, []);
  const contact = parseJsonValue(row.contact_json, {});
  const defaultContact = {
    email: "medinnovate2026@gmail.com",
    instagram: "https://www.instagram.com/medinnovate_26?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    whatsapp_label: "WhatsApp support",
  };
  const defaultStats = [
    { value: "20+", label: "Countries" },
    { value: "3 to 5", label: "Members per team" },
    { value: "24/7", label: "Mentor support" },
  ];
  const defaultTimeline = [
    { title: "Registration", detail: "Sign up and form your team of three to five undergraduate students." },
    { title: "Abstract Submission", detail: "Teams submit a first abstract outlining their healthcare innovation idea." },
    { title: "Review & Selection", detail: "Expert panel reviews abstracts to shortlist the most feasible and impactful ideas." },
    { title: "Mentorship & Guidance", detail: "Selected teams receive expert guidance to refine their solutions and prepare for their pitch." },
    { title: "Grand Finale", detail: "Present your final solution in India. Hybrid format with online participation available." },
  ];
  const defaultWhyParticipate = [
    { title: "Team of 3 to 5 is mandatory", detail: "Every submission must come from a team of at least three and at most five members." },
    { title: "All members should be undergraduate students", detail: "Each participant in the team must be an undergraduate student." },
    { title: "Theme: Public Health", detail: "Ideas should address a meaningful public health challenge." },
    { title: "Original and feasible idea", detail: "The solution must be your own concept and practical enough to be implemented." },
  ];

  return {
    hero_title: row.hero_title || "Medinnovate",
    hero_subtitle: row.hero_subtitle || "International Healthcare Innovation Hackathon",
    hero_description: row.hero_description || "Build practical healthcare solutions with global mentors, clinical insight, and cross-border teams.",
    about_text: row.about_text || "Medinnovate is an international healthcare innovation hackathon that brings together students and young professionals to develop feasible, scalable, and impactful solutions to real-world healthcare challenges.",
    stats_json: Array.isArray(stats) && stats.length > 0 ? stats : defaultStats,
    timeline_json: Array.isArray(timeline) && timeline.length > 0 ? timeline : defaultTimeline,
    why_participate_json: Array.isArray(whyParticipate) && whyParticipate.length > 0 ? whyParticipate : defaultWhyParticipate,
    cta_title: row.cta_title || "Ready to build for public health?",
    cta_description: row.cta_description || "Register your team, submit your idea, and move through Phase 1 screening.",
    contact_json: contact && typeof contact === "object" && !Array.isArray(contact) && Object.keys(contact).length > 0 ? contact : defaultContact,
    primary_cta_label: row.primary_cta_label || "Submit Idea",
    primary_cta_url: row.primary_cta_url || "/registration",
    secondary_cta_label: row.secondary_cta_label || "Current Phase: PHASE 1",
    secondary_cta_url: row.secondary_cta_url || "",
    hero_media_url: row.hero_media_url || "",
    updated_at: row.updated_at,
  };
}

function serializeCommunitySection(row = {}) {
  return {
    id: row.id || 1,
    title: row.title || "Get In Contact With Us",
    description: row.description || "Stay connected with MedInnovate.\nJoin our community for updates, announcements, opportunities and event discussions.",
    image_url: row.image_url || "",
    whatsapp_link: row.whatsapp_link || DEFAULT_WHATSAPP_INVITE_LINK,
    scroll_text: row.scroll_text || "↓ Scroll down for registration",
    visible: row.visible == null ? true : Boolean(row.visible),
    updated_at: row.updated_at || null,
  };
}

async function tableExists(tableName) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName],
  );
  return Number(rows[0].count) > 0;
}

async function columnExists(tableName, columnName) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [tableName, columnName],
  );
  return Number(rows[0].count) > 0;
}

async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(64) NOT NULL UNIQUE,
      discount_percentage DECIMAL(5, 2) NOT NULL,
      saved_amount DECIMAL(10, 2) NOT NULL,
      final_price DECIMAL(10, 2) NOT NULL,
      qr_image VARCHAR(255) NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE
    )
  `);

  await db.query(`
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
      active = VALUES(active)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS payment_settings (
      id INT PRIMARY KEY DEFAULT 1,
      default_qr_image VARCHAR(500) NOT NULL,
      upi_enabled BOOLEAN DEFAULT TRUE,
      paystack_enabled BOOLEAN DEFAULT FALSE,
      paystack_qr_url TEXT,
      paystack_payment_link TEXT,
      paystack_instructions TEXT,
      cashfree_enabled BOOLEAN DEFAULT FALSE,
      cashfree_qr_url TEXT,
      cashfree_instructions TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("coupons", "razorpay_payment_link"))) {
    await db.query("ALTER TABLE coupons ADD COLUMN razorpay_payment_link VARCHAR(500) NULL");
  }

  const paymentSettingsColumns = [
    ["upi_enabled", "BOOLEAN DEFAULT TRUE"],
    ["paystack_enabled", "BOOLEAN DEFAULT FALSE"],
    ["paystack_qr_url", "TEXT"],
    ["paystack_payment_link", "TEXT"],
    ["paystack_instructions", "TEXT"],
    ["cashfree_enabled", "BOOLEAN DEFAULT FALSE"],
    ["cashfree_qr_url", "TEXT"],
    ["cashfree_instructions", "TEXT"],
    ["razorpay_enabled", "BOOLEAN DEFAULT FALSE"],
    ["razorpay_payment_link", "TEXT"],
  ];

  for (const [column, definition] of paymentSettingsColumns) {
    if (!(await columnExists("payment_settings", column))) {
      await db.query(`ALTER TABLE payment_settings ADD COLUMN ${column} ${definition}`);
    }
  }

  await db.query(`
    INSERT INTO payment_settings (id, default_qr_image, paystack_qr_url, paystack_payment_link, cashfree_qr_url)
    VALUES (1, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE id = id
  `, [DEFAULT_PAYMENT_QR_IMAGE, DEFAULT_PAYSTACK_QR_IMAGE, DEFAULT_PAYSTACK_PAYMENT_LINK, DEFAULT_CASHFREE_QR_IMAGE]);

  await db.query(
    `UPDATE payment_settings
     SET default_qr_image = ?,
         paystack_qr_url = ?,
         paystack_payment_link = ?,
         cashfree_qr_url = COALESCE(NULLIF(cashfree_qr_url, ''), ?),
         razorpay_payment_link = COALESCE(NULLIF(razorpay_payment_link, ''), ?)
     WHERE id = 1`,
    [DEFAULT_PAYMENT_QR_IMAGE, DEFAULT_PAYSTACK_QR_IMAGE, DEFAULT_PAYSTACK_PAYMENT_LINK, DEFAULT_CASHFREE_QR_IMAGE, DEFAULT_RAZORPAY_PAYMENT_LINK],
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      team_name VARCHAR(255) NOT NULL,
      utr VARCHAR(255) NOT NULL,
      coupon_code VARCHAR(64) NULL,
      referral_code VARCHAR(100) NULL,
      total_paid DECIMAL(10, 2) NOT NULL,
      discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      final_amount DECIMAL(10, 2) NULL,
      team_size INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("teams", "utr"))) {
    await db.query("ALTER TABLE teams ADD COLUMN utr VARCHAR(255) NULL AFTER team_name");
  }

  if (!(await columnExists("teams", "coupon_code"))) {
    await db.query("ALTER TABLE teams ADD COLUMN coupon_code VARCHAR(64) NULL AFTER utr");
  }

  if (!(await columnExists("teams", "referral_code"))) {
    await db.query("ALTER TABLE teams ADD COLUMN referral_code VARCHAR(100) NULL AFTER coupon_code");
  }

  if (!(await columnExists("teams", "payment_verified"))) {
    await db.query("ALTER TABLE teams ADD COLUMN payment_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER total_paid");
  }

  if (!(await columnExists("teams", "discount_amount"))) {
    await db.query("ALTER TABLE teams ADD COLUMN discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER total_paid");
  }

  if (!(await columnExists("teams", "final_amount"))) {
    await db.query("ALTER TABLE teams ADD COLUMN final_amount DECIMAL(10, 2) NULL AFTER discount_amount");
    await db.query("UPDATE teams SET final_amount = total_paid WHERE final_amount IS NULL");
  }

  if (!(await columnExists("teams", "verified_amount"))) {
    await db.query("ALTER TABLE teams ADD COLUMN verified_amount DECIMAL(10, 2) NULL AFTER payment_verified");
  }

  if (!(await columnExists("teams", "verified_at"))) {
    await db.query("ALTER TABLE teams ADD COLUMN verified_at TIMESTAMP NULL AFTER verified_amount");
  }

  if (!(await columnExists("teams", "payment_qr_type"))) {
    await db.query("ALTER TABLE teams ADD COLUMN payment_qr_type VARCHAR(50) NULL AFTER verified_at");
  }

  if (!(await columnExists("teams", "payment_method"))) {
    await db.query("ALTER TABLE teams ADD COLUMN payment_method ENUM('upi', 'paystack', 'cashfree', 'razorpay') DEFAULT 'upi' AFTER payment_qr_type");
  } else {
    await db.query("ALTER TABLE teams MODIFY COLUMN payment_method ENUM('upi', 'paystack', 'cashfree', 'razorpay') DEFAULT 'upi'");
  }

  if (!(await columnExists("teams", "razorpay_order_id"))) {
    await db.query("ALTER TABLE teams ADD COLUMN razorpay_order_id VARCHAR(255) NULL");
  }

  if ((await columnExists("teams", "transaction_ref"))) {
    await db.query("UPDATE teams SET utr = transaction_ref WHERE (utr IS NULL OR utr = '') AND transaction_ref IS NOT NULL");
  }

  if ((await tableExists("team_members")) && (await columnExists("team_members", "team_id")) && !(await tableExists("registration_members"))) {
    await db.query("RENAME TABLE team_members TO registration_members");
  }

  await db.query(`
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
    )
  `);

  if (!(await columnExists("registration_members", "phone"))) {
    await db.query("ALTER TABLE registration_members ADD COLUMN phone VARCHAR(100) NULL AFTER country");
  }

  if (!(await columnExists("registration_members", "discipline"))) {
    await db.query("ALTER TABLE registration_members ADD COLUMN discipline VARCHAR(255) NULL AFTER phone");
  }

  if (!(await columnExists("registration_members", "study_year"))) {
    await db.query("ALTER TABLE registration_members ADD COLUMN study_year VARCHAR(100) NULL AFTER discipline");
  }

  if (!(await columnExists("registration_members", "gender"))) {
    await db.query("ALTER TABLE registration_members ADD COLUMN gender VARCHAR(100) NULL AFTER study_year");
  }

  if (!(await columnExists("registration_members", "is_leader"))) {
    await db.query("ALTER TABLE registration_members ADD COLUMN is_leader BOOLEAN NOT NULL DEFAULT FALSE AFTER gender");
    await db.query(`
      UPDATE registration_members rm
      JOIN (
        SELECT team_id, MIN(id) AS leader_member_id
        FROM registration_members
        GROUP BY team_id
      ) leaders ON leaders.leader_member_id = rm.id
      SET rm.is_leader = TRUE
    `);
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY DEFAULT 1,
      website_name VARCHAR(255) NOT NULL DEFAULT 'Medinnovate',
      tagline VARCHAR(255) NULL,
      logo_url VARCHAR(500) NULL,
      favicon_url VARCHAR(500) NULL,
      seo_title VARCHAR(255) NULL,
      seo_description TEXT NULL,
      contact_email VARCHAR(255) NULL,
      contact_phone VARCHAR(100) NULL,
      social_links JSON NULL,
      footer_content TEXT NULL,
      copyright_text VARCHAR(255) NULL,
      announcement_bar TEXT NULL,
      theme_colors JSON NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("site_settings", "footer_text"))) {
    await db.query("ALTER TABLE site_settings ADD COLUMN footer_text TEXT NULL");
  }

  if (!(await columnExists("site_settings", "instagram_url"))) {
    await db.query("ALTER TABLE site_settings ADD COLUMN instagram_url VARCHAR(500) NULL");
  }

  if (!(await columnExists("site_settings", "linkedin_url"))) {
    await db.query("ALTER TABLE site_settings ADD COLUMN linkedin_url VARCHAR(500) NULL");
  }

  if (!(await columnExists("site_settings", "announcement"))) {
    await db.query("ALTER TABLE site_settings ADD COLUMN announcement TEXT NULL");
  }

  await db.query(`
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
    ON DUPLICATE KEY UPDATE id = id
  `);

  await db.query(`
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
    )
  `);

  const homepageColumns = [
    ["about_text", "TEXT NULL AFTER hero_description"],
    ["stats_json", "JSON NULL AFTER about_text"],
    ["timeline_json", "JSON NULL AFTER stats_json"],
    ["why_participate_json", "JSON NULL AFTER timeline_json"],
    ["cta_title", "VARCHAR(255) NULL AFTER why_participate_json"],
    ["cta_description", "TEXT NULL AFTER cta_title"],
    ["contact_json", "JSON NULL AFTER cta_description"],
  ];

  for (const [column, definition] of homepageColumns) {
    if (!(await columnExists("homepage_content", column))) {
      await db.query(`ALTER TABLE homepage_content ADD COLUMN ${column} ${definition}`);
    }
  }

  await db.query(`
    INSERT INTO homepage_content (
      id,
      hero_title,
      hero_subtitle,
      hero_description,
      about_text,
      stats_json,
      timeline_json,
      why_participate_json,
      cta_title,
      cta_description,
      contact_json,
      primary_cta_label,
      primary_cta_url
    )
    VALUES (
      1,
      'Medinnovate',
      'International Healthcare Innovation Hackathon',
      'Build practical healthcare solutions with global mentors, clinical insight, and cross-border teams.',
      'Medinnovate is an international healthcare innovation hackathon that brings together students and young professionals from diverse disciplines, medicine, public health, engineering, design, and social sciences, to collaboratively develop feasible, scalable, and impactful solutions to real-world healthcare challenges.',
      JSON_ARRAY(JSON_OBJECT('value', '20+', 'label', 'Countries'), JSON_OBJECT('value', '3 to 5', 'label', 'Members per team'), JSON_OBJECT('value', '24/7', 'label', 'Mentor support')),
      JSON_ARRAY(JSON_OBJECT('title', 'Registration', 'detail', 'Sign up and form your team of three to five undergraduate students.'), JSON_OBJECT('title', 'Abstract Submission', 'detail', 'Teams submit a first abstract outlining their healthcare innovation idea.'), JSON_OBJECT('title', 'Review & Selection', 'detail', 'Expert panel reviews abstracts to shortlist the most feasible and impactful ideas.'), JSON_OBJECT('title', 'Mentorship & Guidance', 'detail', 'Selected teams receive expert guidance to refine their solutions and prepare for their pitch.'), JSON_OBJECT('title', 'Grand Finale', 'detail', 'Present your final solution in India. Hybrid format with online participation available.')),
      JSON_ARRAY(JSON_OBJECT('title', 'Team of 3 to 5 is mandatory', 'detail', 'Every submission must come from a team of at least three and at most five members.'), JSON_OBJECT('title', 'All members should be undergraduate students', 'detail', 'Each participant in the team must be an undergraduate student.'), JSON_OBJECT('title', 'Theme: Public Health', 'detail', 'Ideas should address a meaningful public health challenge.'), JSON_OBJECT('title', 'Original and feasible idea', 'detail', 'The solution must be your own concept and practical enough to be implemented.')),
      'Ready to build for public health?',
      'Register your team, submit your idea, and move through Phase 1 screening.',
      JSON_OBJECT('email', 'medinnovate2026@gmail.com', 'instagram', 'https://www.instagram.com/medinnovate_26?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', 'whatsapp_label', 'WhatsApp support'),
      'Submit Idea',
      '/registration'
    )
    ON DUPLICATE KEY UPDATE id = id
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS community_section (
      id INT PRIMARY KEY DEFAULT 1,
      title VARCHAR(255) NULL,
      description TEXT NULL,
      image_url VARCHAR(500) NULL,
      whatsapp_link VARCHAR(500) NULL,
      scroll_text VARCHAR(255) NULL,
      visible BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
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
      '${DEFAULT_WHATSAPP_INVITE_LINK}',
      '↓ Scroll down for registration',
      TRUE
    )
    ON DUPLICATE KEY UPDATE
      whatsapp_link = IF(whatsapp_link IS NULL OR whatsapp_link = '', VALUES(whatsapp_link), whatsapp_link)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS navigation (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      location VARCHAR(100) NOT NULL DEFAULT 'navbar',
      parent_id INT NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_external BOOLEAN NOT NULL DEFAULT FALSE,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("navigation", "path"))) {
    await db.query("ALTER TABLE navigation ADD COLUMN path VARCHAR(500) NULL");
  }

  if (!(await columnExists("navigation", "order_index"))) {
    await db.query("ALTER TABLE navigation ADD COLUMN order_index INT NOT NULL DEFAULT 0");
  }

  if (!(await columnExists("navigation", "visible"))) {
    await db.query("ALTER TABLE navigation ADD COLUMN visible BOOLEAN NOT NULL DEFAULT TRUE");
  }

  if (!(await columnExists("navigation", "target"))) {
    await db.query("ALTER TABLE navigation ADD COLUMN target VARCHAR(100) NOT NULL DEFAULT '_self'");
  }

  await db.query("UPDATE navigation SET path = url WHERE path IS NULL OR path = ''");
  await db.query("UPDATE navigation SET order_index = display_order WHERE order_index = 0 AND display_order <> 0");
  await db.query("UPDATE navigation SET visible = is_published WHERE is_published IS NOT NULL");

  const [[navigationCount]] = await db.query("SELECT COUNT(*) AS count FROM navigation");
  if (Number(navigationCount.count) === 0) {
    await db.query(
      `INSERT INTO navigation (label, url, path, location, parent_id, display_order, order_index, is_external, is_published, visible, target)
       VALUES ?`,
      [[
        ["About", "#about", "#about", "navbar", null, 1, 1, false, true, true, "_self"],
        ["Why Attend", "#why-attend", "#why-attend", "navbar", null, 2, 2, false, true, true, "_self"],
        ["Who Can Join", "#participants", "#participants", "navbar", null, 3, 3, false, true, true, "_self"],
        ["Judges", "#judges", "#judges", "navbar", null, 4, 4, false, true, true, "_self"],
        ["Organising Committee", "/organising-committee", "/organising-committee", "navbar", null, 5, 5, false, true, true, "_self"],
        ["Register", "/registration", "/registration", "navbar", null, 6, 6, false, true, true, "_self"],
      ]],
    );
  }

  await db.query(`
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
    )
  `);

  await db.query(`
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
    )
  `);

  if (!(await columnExists("academic_partners", "partner_type"))) {
    await db.query("ALTER TABLE academic_partners ADD COLUMN partner_type VARCHAR(100) NOT NULL DEFAULT 'academic'");
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS faq (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(255) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("faq", "status"))) {
    await db.query("ALTER TABLE faq ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Published'");
  }

  if (!(await columnExists("faq", "order_index"))) {
    await db.query("ALTER TABLE faq ADD COLUMN order_index INT NOT NULL DEFAULT 0");
  }

  await db.query("UPDATE faq SET status = IF(is_published = TRUE, 'Published', 'Draft') WHERE status IS NULL OR status = ''");
  await db.query("UPDATE faq SET order_index = display_order WHERE order_index = 0 AND display_order <> 0");
  await db.query(
    "UPDATE faq SET answer = ? WHERE question = ? AND (answer LIKE ? OR answer LIKE ?)",
    [
      "Yes. The registration fee is $10 per team, with teams allowed to register 3 to 5 members.",
      "Is there any registration fee?",
      "%$3 per participant%",
      "%$15 per team%",
    ],
  );
  await db.query(
    "UPDATE faq SET answer = ? WHERE question = ? AND answer LIKE ?",
    [
      "No. Participation requires a team of 3 to 5 undergraduate students.",
      "Can I participate solo?",
      "%exactly 5%",
    ],
  );

  const [[faqCount]] = await db.query("SELECT COUNT(*) AS count FROM faq");
  if (Number(faqCount.count) === 0) {
    await db.query(
      `INSERT INTO faq (question, answer, category, display_order, order_index, is_published, status)
       VALUES ?`,
      [[
        ["Is Medinnovate an online or offline event?", "Medinnovate will follow a hybrid format. Phase 1 will be conducted online, and the Grand Finale will be held offline in India with a virtual presentation option for eligible participants who cannot attend in person.", "Format", 1, 1, true, "Published"],
        ["Can I participate solo?", "No. Participation requires a team of 3 to 5 undergraduate students.", "Eligibility", 2, 2, true, "Published"],
        ["Who can participate?", "Undergraduate students from Africa and India can participate.", "Eligibility", 3, 3, true, "Published"],
        ["Can team members be from different colleges or countries?", "Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.", "Team", 4, 4, true, "Published"],
        ["Is there any registration fee?", "Yes. The registration fee is $10 per team, with teams allowed to register 3 to 5 members.", "Payment", 5, 5, true, "Published"],
        ["Will certificates be provided?", "Yes. Certificates will be provided based on participation and completion criteria.", "Benefits", 6, 6, true, "Published"],
        ["What is the selection process?", "The selection process follows registration, submission, screening, mentorship, and final pitch.", "Selection", 7, 7, true, "Published"],
        ["What happens if I cannot attend the final round in person?", "A virtual option will be available for participants who cannot attend the final round in person.", "Finale", 8, 8, true, "Published"],
        ["What kind of ideas can we submit?", "You can submit healthcare innovation ideas that address meaningful real-world healthcare challenges.", "Ideas", 9, 9, true, "Published"],
        ["How can I contact the team for support?", "You can contact the team through email, Instagram, or WhatsApp.", "Support", 10, 10, true, "Published"],
      ]],
    );
  }

  await db.query(`
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
    )
  `);

  const [[committeeCount]] = await db.query("SELECT COUNT(*) AS count FROM organising_committee");
  if (Number(committeeCount.count) === 0) {
    await db.query(
      `INSERT INTO organising_committee (section, name, role, phone, email, photo_url, display_order)
       VALUES ?`,
      [[
        ["President", "Abhishek Kashyap", "GAIMS President", "", "president@gaims.org", "", 1],
        ["President", "Oluwasola Victor", "CEO of BlueOzone", "", "blueozonehealth@gmail.com", "", 2],
        ["Organising Secretary", "Girik Subudhi", "Organising Secretary GAIMS", "+918169011833", "giriksubudhi@gmail.com", "", 1],
        ["Organising Secretary", "Sofiyullah Salaudeen", "Organising Secretary NiMSA", "+2347038939481", "sofiyullahopeyemi@gmail.com", "", 2],
        ["Organising Secretary", "Elton M Mahulu", "Organising Secretary FAMSA", "+255628049726", "mahuluelton007@gmail.com", "", 3],
        ["Organising Secretary", "Ogunka Favour", "Organising Secretary BlueOzone Health", "+2348052747225", "ogunkafavour@gmail.com", "", 4],
        ["IT Cell", "Sushmit Morey", "IT Cell Lead", "+917262842562", "itd@gaims.org", "", 1],
        ["IT Cell", "Laksh", "IT Cell Member", "+917988025670", "Laksh0360@gmail.com", "", 2],
        ["IT Cell", "Hardik Murari", "IT Cell Member", "+918057596073", "hardik.murari.md@gmail.com", "", 3],
        ["Organising Committee", "Collins-Ikpe Kennedy", "Organising Committee Member", "+2349054268369", "kennedycollinsikpe@gmail.com", "", 1],
        ["Organising Committee", "Wahida Ali", "Organising Committee Member", "+255718961697", "wahaly04@gmail.com", "", 2],
        ["Organising Committee", "Awogbemi Damilola", "Organising Committee Member", "+2348148799692", "damiloawo@gmail.com", "", 3],
        ["Organising Committee", "Okafor Chioma Rosemary", "Organising Committee Member", "+2349022354168", "bscrvo@gmail.com", "", 4],
        ["Organising Committee", "Toluwase O. Ogundipe", "Organising Committee Member", "+2348068674210", "itstoluwase@gmail.com", "", 5],
        ["Organising Committee", "Blessed Olaomo", "Organising Committee Member", "+2348169123249", "blessedolaomo@gmail.com", "", 6],
        ["Organising Committee", "Amrit Pundir", "Organising Committee Member", "+918630458367", "amritpun1317@gmail.com", "", 7],
        ["Organising Committee", "Manasvi Mukherjee", "Organising Committee Member", "+917041689200", "manasvimukherjee02@gmail.com", "", 8],
        ["Organising Committee", "Hadi Shaikh", "Organising Committee Member", "+919870033700", "hadishaikh2310@gmail.com", "", 9],
      ]],
    );
  }

  await db.query(`
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
    )
  `);

  await db.query(`
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
    )
  `);

  await db.query(`
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
    )
  `);

  await db.query(`
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
    )
  `);

  const [[websiteSectionCount]] = await db.query("SELECT COUNT(*) AS count FROM website_sections");
  if (Number(websiteSectionCount.count) === 0) {
    await db.query(
      `INSERT INTO website_sections (section_key, section_name, title, subtitle, visible, display_order, background_type, animation, custom_css_class)
       VALUES ?`,
      [[
        ["hero", "Hero", "Medinnovate", "International Healthcare Innovation Hackathon", true, 1, "default", "fade", ""],
        ["about", "About", "About MedInnovate", "A global healthcare innovation platform for student teams.", true, 2, "light", "slide-up", ""],
        ["stats", "Stats", "Global participation", "Event highlights and participation metrics.", true, 3, "default", "fade", ""],
        ["speakers", "Speakers", "Speakers", "Meet keynote speakers and session leaders.", true, 5, "default", "fade", ""],
        ["judges", "Judges", "Judges", "Reviewers, evaluators, and panel members.", true, 6, "light", "fade", ""],
        ["sponsors", "Sponsors", "Sponsors", "Partners and supporting organisations.", false, 7, "default", "fade", ""],
        ["committee", "Committee", "Organising Committee", "Meet the people coordinating MedInnovate.", true, 8, "light", "slide-up", ""],
        ["schedule", "Schedule", "Schedule", "Event timeline and important milestones.", false, 9, "default", "fade", ""],
        ["faq", "FAQ", "Frequently Asked Questions", "Answers to common participant questions.", true, 10, "light", "fade", ""],
        ["community", "Community", "Join the Community", "Connect with MedInnovate for updates and announcements.", true, 11, "default", "slide-up", ""],
        ["footer", "Footer", "Footer", "", true, 12, "default", "none", ""],
        ["gallery", "Gallery", "Gallery", "Event photos and media highlights.", false, 13, "default", "fade", ""],
      ]],
    );
  }

  await db.query("DELETE FROM website_sections WHERE section_key = 'competition'");
  await db.query("DROP TABLE IF EXISTS competition_tracks");

  await db.query(
    `INSERT INTO website_sections (section_key, section_name, title, subtitle, visible, display_order, background_type, animation, custom_css_class)
     VALUES ('gallery', 'Gallery', 'Gallery', 'Event photos and media highlights.', FALSE, 13, 'default', 'fade', '')
     ON DUPLICATE KEY UPDATE section_key = section_key`,
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS master_cms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(255) UNIQUE NOT NULL,
      setting_value LONGTEXT,
      setting_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [[masterCmsCount]] = await db.query("SELECT COUNT(*) AS count FROM master_cms");
  if (Number(masterCmsCount.count) === 0) {
    await db.query(
      `INSERT INTO master_cms (setting_key, setting_value, setting_type)
       VALUES ?`,
      [[
        ["homepage_sections", "[]", "json"],
        ["site_theme", JSON.stringify({ mode: "default", primary_color: "#7C3AED", accent_color: "#EC4899", button_style: "rounded", animation_intensity: "normal" }), "json"],
        ["maintenance_mode", "false", "boolean"],
        ["maintenance_message", "MedInnovate is currently under maintenance. Please check back soon.", "text"],
        ["announcement_enabled", "false", "boolean"],
        ["announcement_text", "Registrations Open", "text"],
        ["countdown_enabled", "false", "boolean"],
        ["countdown_date", "", "text"],
        ["registration_banner_enabled", "false", "boolean"],
        ["registration_banner_text", "Early Bird Open", "text"],
        ["popup_enabled", "false", "boolean"],
        ["popup_title", "Registrations Open", "text"],
        ["popup_content", "Register your team and start building for public health.", "text"],
        ["schedule_enabled", "false", "boolean"],
        ["gallery_enabled", "false", "boolean"],
        ["sponsors_enabled", "false", "boolean"],
        ["judges_enabled", "true", "boolean"],
        ["speakers_enabled", "true", "boolean"],
        ["committee_enabled", "true", "boolean"],
        ["faq_enabled", "true", "boolean"],
        ["community_enabled", "true", "boolean"],
      ]],
    );
  }

  await db.query("DELETE FROM master_cms WHERE setting_key = 'competition_enabled'");

  await db.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NULL,
      group_name VARCHAR(255) NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(100) NULL,
      bio TEXT NULL,
      image_url VARCHAR(500) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("team_members", "organization"))) {
    await db.query("ALTER TABLE team_members ADD COLUMN organization VARCHAR(255) NULL");
  }

  if (!(await columnExists("team_members", "photo_url"))) {
    await db.query("ALTER TABLE team_members ADD COLUMN photo_url VARCHAR(500) NULL");
  }

  if (!(await columnExists("team_members", "instagram"))) {
    await db.query("ALTER TABLE team_members ADD COLUMN instagram VARCHAR(500) NULL");
  }

  if (!(await columnExists("team_members", "linkedin"))) {
    await db.query("ALTER TABLE team_members ADD COLUMN linkedin VARCHAR(500) NULL");
  }

  if (!(await columnExists("team_members", "status"))) {
    await db.query("ALTER TABLE team_members ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Published'");
  }

  await db.query("UPDATE team_members SET organization = group_name WHERE (organization IS NULL OR organization = '') AND group_name IS NOT NULL");
  await db.query("UPDATE team_members SET photo_url = image_url WHERE (photo_url IS NULL OR photo_url = '') AND image_url IS NOT NULL");
  await db.query("UPDATE team_members SET status = IF(is_published = TRUE, 'Published', 'Draft') WHERE status IS NULL OR status = ''");

  const [[teamMemberCount]] = await db.query("SELECT COUNT(*) AS count FROM team_members");
  if (Number(teamMemberCount.count) === 0) {
    await db.query(
      `INSERT INTO team_members (name, role, organization, group_name, photo_url, image_url, email, instagram, linkedin, display_order, is_published, status)
       VALUES ?`,
      [[
        ["Abhishek Kashyap", "GAIMS President", "GAIMS", "Leadership", "", "", "", "", "", 1, true, "Published"],
        ["Oluwasola Victor", "CEO of BlueOzone", "Blue Ozone Health", "Leadership", "", "", "", "", "", 2, true, "Published"],
        ["Girik Subudhi", "Organising Secretary GAIMS", "GAIMS", "Program Leads", "", "", "giriksubudhi@gmail.com", "", "", 3, true, "Published"],
        ["Sofiyullah Salaudeen", "Organising Secretary NiMSA", "NIMSA", "Program Leads", "", "", "sofiyullahopeyemi@gmail.com", "", "", 4, true, "Published"],
        ["Elton M Mahulu", "Organising Secretary FAMSA", "FAMSA", "Program Leads", "", "", "mahuluelton007@gmail.com", "", "", 5, true, "Published"],
        ["Ogunka Favour", "Organising Secretary BlueOzone Health", "Blue Ozone Health", "Program Leads", "", "", "ogunkafavour@gmail.com", "", "", 6, true, "Published"],
        ["Sushmit Morey", "IT Cell Lead", "MedInnovate", "Digital Operations", "", "", "", "", "", 7, true, "Published"],
      ]],
    );
  }
}

function assertCloudinaryConfigured() {
  const hasCloudinaryUrl = Boolean(process.env.CLOUDINARY_URL);
  const hasSplitConfig = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

  if (!hasCloudinaryUrl && !hasSplitConfig) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }
}

function sanitizeCloudinarySegment(value, fallback = "asset") {
  const cleaned = String(value || fallback)
    .trim()
    .replace(path.extname(String(value || "")), "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned || fallback;
}

function cloudinaryFolder(folder) {
  const segment = sanitizeCloudinarySegment(folder, "media");
  return `medinnovate/${segment}`;
}

function parseDataUrl(fileDataUrl, label = "Media upload") {
  if (!fileDataUrl) return null;

  const match = String(fileDataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error(`${label} must be a valid base64 data URL.`);
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

async function uploadToCloudinary({ fileDataUrl, fileBuffer, mimeType, originalName, folder = "media", publicId, label = "Media upload" }) {
  assertCloudinaryConfigured();

  let uploadBuffer = fileBuffer;
  let uploadMimeType = mimeType;

  if (!uploadBuffer) {
    const parsed = parseDataUrl(fileDataUrl, label);
    if (!parsed) return null;
    uploadBuffer = parsed.buffer;
    uploadMimeType = parsed.mimeType;
  }

  const baseName = sanitizeCloudinarySegment(originalName || publicId || "media", "media");
  const result = await uploadBufferToCloudinary(uploadBuffer, {
    folder: cloudinaryFolder(folder),
    public_id: publicId ? sanitizeCloudinarySegment(publicId, baseName) : `${baseName}-${Date.now()}`,
    resource_type: "auto",
    overwrite: false,
  });

  return {
    success: true,
    fileName: result.original_filename || path.basename(originalName || result.public_id),
    url: result.secure_url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    mimeType: uploadMimeType || result.resource_type || "",
    sizeBytes: Number(result.bytes || uploadBuffer.length || 0),
  };
}

async function saveQrUpload({ code, qrImageDataUrl, qrImageName }) {
  if (!qrImageDataUrl) return "";

  if (!String(qrImageDataUrl).startsWith("data:image/")) {
    throw new Error("QR image upload must be an image file.");
  }

  const uploadResult = await uploadToCloudinary({
    fileDataUrl: qrImageDataUrl,
    originalName: qrImageName || `${normalizeCode(code).toLowerCase()}-qr.png`,
    folder: "payments",
    publicId: `${normalizeCode(code).toLowerCase()}-${Date.now()}`,
    label: "QR image upload",
  });

  return uploadResult?.secure_url || "";
}

async function saveMediaUpload({ fileDataUrl, fileBuffer, mimeType, originalName, folder }) {
  return uploadToCloudinary({
    fileDataUrl,
    fileBuffer,
    mimeType,
    originalName,
    folder: folder || "media",
    label: "Media upload",
  });
}

function mergeMetadata(metadata, uploadResult) {
  const parsed = parseJsonValue(metadata, {});
  return JSON.stringify({
    ...(parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}),
    cloudinary_public_id: uploadResult.public_id,
  });
}

function pickFields(body, fields) {
  return fields.reduce((values, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      const value = body[field];
      if (JSON_FIELDS.has(field)) {
        values[field] = value === "" || value == null ? null : typeof value === "string" ? value : JSON.stringify(value);
      } else {
        values[field] = value;
      }
    }
    return values;
  }, {});
}

function toDbBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function makeUuid() {
  return crypto.randomUUID();
}

async function updateSingleRecord(table, fields, body) {
  const values = pickFields(body, fields);
  const keys = Object.keys(values);

  if (keys.length === 0) return;

  const assignments = keys.map((key) => `${key} = ?`).join(", ");
  await db.query(`UPDATE ${table} SET ${assignments} WHERE id = 1`, keys.map((key) => values[key]));
}

function createCollectionRoutes({ route, table, fields, orderBy = "display_order ASC, id DESC", booleanFields = [] }) {
  app.get(route, async (req, res) => {
    const search = String(req.query.search || "").trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
    const offset = (page - 1) * limit;
    const searchFields = fields.filter((field) => !booleanFields.includes(field));

    let where = "";
    let params = [];

    if (search && searchFields.length > 0) {
      where = `WHERE ${searchFields.map((field) => `${field} LIKE ?`).join(" OR ")}`;
      params = searchFields.map(() => `%${search}%`);
    }

    const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM ${table} ${where}`, params);
    const [items] = await db.query(
      `SELECT * FROM ${table} ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({ items, total: Number(countRows[0].total), page, limit });
  });

  app.post(route, async (req, res) => {
    const values = pickFields(req.body, fields);
    booleanFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(values, field)) values[field] = toDbBoolean(values[field]);
    });

    const keys = Object.keys(values);
    if (keys.length === 0) {
      return res.status(400).json({ message: "No fields provided." });
    }

    const placeholders = keys.map(() => "?").join(", ");
    const [result] = await db.query(
      `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
      keys.map((key) => values[key]),
    );
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);

    return res.status(201).json({ item: rows[0] });
  });

  app.put(`${route}/:id`, async (req, res) => {
    const values = pickFields(req.body, fields);
    booleanFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(values, field)) values[field] = toDbBoolean(values[field]);
    });

    const keys = Object.keys(values);
    if (keys.length === 0) {
      return res.status(400).json({ message: "No fields provided." });
    }

    const assignments = keys.map((key) => `${key} = ?`).join(", ");
    const [result] = await db.query(
      `UPDATE ${table} SET ${assignments} WHERE id = ?`,
      [...keys.map((key) => values[key]), req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    return res.json({ item: rows[0] });
  });

  app.delete(`${route}/:id`, async (req, res) => {
    const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }
    return res.json({ success: true });
  });
}

app.post("/api/coupons/validate", async (req, res) => {
  const code = normalizeCode(req.body.code);
  const [coupons] = await db.query(
    "SELECT * FROM coupons WHERE code = ? AND active = TRUE LIMIT 1",
    [code],
  );
  const coupon = coupons[0];

  if (!coupon) {
    return res.status(404).json({
      valid: false,
      message: "Invalid or expired coupon",
    });
  }

  return res.json({
    valid: true,
    discount: Number(coupon.discount_percentage),
    savedAmount: Number(coupon.saved_amount),
    finalAmount: Number(coupon.final_price),
    qrImage: toPublicQrPath(coupon.qr_image),
    message: `Congratulations! You saved $${Number(coupon.saved_amount).toFixed(2)}`,
  });
});

app.get("/api/payment-settings", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM payment_settings WHERE id = 1");
  res.json(serializePaymentSettings(rows[0]));
});

app.get("/api/admin/payment-settings", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM payment_settings WHERE id = 1");
  res.json({ settings: serializePaymentSettings(rows[0]) });
});

app.put("/api/admin/payment-settings", async (req, res) => {
  const defaultQrImage = String(req.body.defaultQrImage ?? req.body.default_qr_image ?? "").trim();
  const upiEnabled = req.body.upi_enabled === undefined ? true : Boolean(req.body.upi_enabled);
  const paystackEnabled = Boolean(req.body.paystack_enabled);
  const paystackQrUrl = String(req.body.paystack_qr_url || "").trim();
  const paystackPaymentLink = String(req.body.paystack_payment_link || "").trim();
  const paystackInstructions = String(req.body.paystack_instructions || "").trim();
  const cashfreeEnabled = Boolean(req.body.cashfree_enabled);
  const cashfreeQrUrl = String(req.body.cashfree_qr_url || "").trim();
  const cashfreeInstructions = String(req.body.cashfree_instructions || "").trim();
  const razorpayEnabled = Boolean(req.body.razorpay_enabled);
  const razorpayPaymentLink = String(req.body.razorpay_payment_link || "").trim();

  if (!defaultQrImage) {
    return res.status(400).json({ message: "Default QR image URL is required." });
  }

  if (!upiEnabled && !paystackEnabled && !cashfreeEnabled && !razorpayEnabled) {
    return res.status(400).json({ message: "At least one payment method must be enabled." });
  }

  await db.query(
    `UPDATE payment_settings
     SET default_qr_image = ?,
         upi_enabled = ?,
         paystack_enabled = ?,
         paystack_qr_url = ?,
         paystack_payment_link = ?,
         paystack_instructions = ?,
         cashfree_enabled = ?,
         cashfree_qr_url = ?,
         cashfree_instructions = ?,
         razorpay_enabled = ?,
         razorpay_payment_link = ?
     WHERE id = 1`,
    [defaultQrImage, upiEnabled, paystackEnabled, paystackQrUrl, paystackPaymentLink, paystackInstructions, cashfreeEnabled, cashfreeQrUrl, cashfreeInstructions, razorpayEnabled, razorpayPaymentLink],
  );

  const [rows] = await db.query("SELECT * FROM payment_settings WHERE id = 1");
  res.json({ settings: serializePaymentSettings(rows[0]) });
});

app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay is not configured on the server." });
    }

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount." });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 8500),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to create Razorpay order." });
  }
});

app.get("/api/admin/coupons", async (_req, res) => {
  const [coupons] = await db.query("SELECT * FROM coupons ORDER BY code ASC");
  res.json({ coupons: coupons.map(serializeCoupon) });
});

app.post("/api/admin/coupons", async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);
    const discountPercentage = Number(req.body.discountPercentage);
    const finalPrice = Number(req.body.finalPrice);

    if (!code || Number.isNaN(discountPercentage) || Number.isNaN(finalPrice)) {
      return res.status(400).json({ message: "Code, discount %, and final price are required." });
    }

    const uploadedQrImage = await saveQrUpload({
      code,
      qrImageDataUrl: req.body.qrImageDataUrl,
      qrImageName: req.body.qrImageName,
    });
    const qrImageUrl = String(req.body.qrImageUrl || "").trim();
    const qrImage = uploadedQrImage || qrImageUrl;

    if (!qrImage) {
      return res.status(400).json({ message: "Upload a static QR image or provide a QR image URL for this coupon." });
    }

    const savedAmount = Math.max(0, ORIGINAL_PRICE - finalPrice);
    const razorpayPaymentLink = String(req.body.razorpayPaymentLink || "").trim();

    await db.query(
      `INSERT INTO coupons (code, discount_percentage, saved_amount, final_price, qr_image, active, razorpay_payment_link)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         discount_percentage = VALUES(discount_percentage),
         saved_amount = VALUES(saved_amount),
         final_price = VALUES(final_price),
         qr_image = VALUES(qr_image),
         active = VALUES(active),
         razorpay_payment_link = VALUES(razorpay_payment_link)`,
      [code, discountPercentage, savedAmount, finalPrice, qrImage, Boolean(req.body.active), razorpayPaymentLink || null],
    );

    const [savedCoupons] = await db.query("SELECT * FROM coupons WHERE code = ? LIMIT 1", [code]);
    const [coupons] = await db.query("SELECT * FROM coupons ORDER BY code ASC");

    return res.status(201).json({
      message: "Coupon saved successfully.",
      coupon: serializeCoupon(savedCoupons[0]),
      coupons: coupons.map(serializeCoupon),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to save coupon." });
  }
});

app.patch("/api/admin/coupons/:id", async (req, res) => {
  const [result] = await db.query(
    "UPDATE coupons SET active = ? WHERE id = ?",
    [Boolean(req.body.active), req.params.id],
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Coupon not found." });
  }

  const [updatedCoupon] = await db.query("SELECT * FROM coupons WHERE id = ? LIMIT 1", [req.params.id]);
  const [coupons] = await db.query("SELECT * FROM coupons ORDER BY code ASC");

  return res.json({
    message: "Coupon updated successfully.",
    coupon: serializeCoupon(updatedCoupon[0]),
    coupons: coupons.map(serializeCoupon),
  });
});

app.delete("/api/admin/coupons/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM coupons WHERE id = ?", [req.params.id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Coupon not found." });
  }

  const [coupons] = await db.query("SELECT * FROM coupons ORDER BY code ASC");

  return res.json({
    message: "Coupon removed successfully.",
    coupons: coupons.map(serializeCoupon),
  });
});

app.post("/api/register-upi", async (req, res) => {
  const teamName = String(req.body.team_name || "").trim();
  const utr = String(req.body.utr || "").trim();
  const members = Array.isArray(req.body.members) ? req.body.members : [];
  const couponCode = normalizeCode(req.body.coupon_code);
  const referralCode = normalizeCode(req.body.referral_code);
  const amountPaid = Number(req.body.amount_paid);
  const discountAmount = Math.max(0, Number(req.body.discount_amount || 0));
  const finalAmount = req.body.final_amount === undefined || req.body.final_amount === null || req.body.final_amount === ""
    ? amountPaid
    : Number(req.body.final_amount);
  const paymentMethod = String(req.body.payment_method || "upi").trim().toLowerCase();
  const razorpayOrderId = String(req.body.razorpay_order_id || "").trim();
  const razorpaySignature = String(req.body.razorpay_signature || "").trim();

  if (!teamName || !utr || members.length === 0 || Number.isNaN(amountPaid)) {
    return res.status(400).json({ error: "Team name, members, UTR, and amount paid are required." });
  }

  if (Number.isNaN(finalAmount) || finalAmount < 0) {
    return res.status(400).json({ error: "Final amount must be zero or higher." });
  }

  if (Number.isNaN(discountAmount) || discountAmount < 0) {
    return res.status(400).json({ error: "Discount amount must be zero or higher." });
  }

  if (!["upi", "paystack", "cashfree", "razorpay"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Choose a valid payment method." });
  }

  const [paymentSettingsRows] = await db.query("SELECT * FROM payment_settings WHERE id = 1");
  const paymentSettings = serializePaymentSettings(paymentSettingsRows[0]);
  if (paymentMethod === "upi" && !paymentSettings.upi_enabled) {
    return res.status(400).json({ error: "UPI payments are currently disabled." });
  }
  if (paymentMethod === "paystack" && !paymentSettings.paystack_enabled) {
    return res.status(400).json({ error: "Paystack payments are currently disabled." });
  }
  if (paymentMethod === "cashfree" && !paymentSettings.cashfree_enabled) {
    return res.status(400).json({ error: "Cashfree payments are currently disabled." });
  }
  if (paymentMethod === "razorpay" && !paymentSettings.razorpay_enabled) {
    return res.status(400).json({ error: "Razorpay payments are currently disabled." });
  }

  if (paymentMethod === "razorpay") {
    if (!razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ error: "Razorpay order ID and signature are required." });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay is not configured on the server." });
    }
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${utr}`)
      .digest("hex");
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
    }
  }

  if (members.length < 3 || members.length > 5) {
    return res.status(400).json({ error: "Teams must include a minimum of 3 and a maximum of 5 members." });
  }

  if (couponCode) {
    const [coupons] = await db.query(
      "SELECT code, saved_amount, final_price FROM coupons WHERE code = ? AND active = TRUE LIMIT 1",
      [couponCode],
    );

    if (!coupons[0]) {
      return res.status(400).json({ error: "Invalid or expired coupon." });
    }

    const expectedFinal = Number(coupons[0].final_price || 0);
    if (Math.abs(finalAmount - expectedFinal) > 0.01) {
      return res.status(400).json({ error: "Coupon amount changed. Please apply the coupon again before submitting." });
    }

    const expectedDiscount = Number(coupons[0].saved_amount || 0);
    if (Math.abs(discountAmount - expectedDiscount) > 0.01) {
      return res.status(400).json({ error: "Coupon discount changed. Please apply the coupon again before submitting." });
    }
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const isRazorpay = paymentMethod === "razorpay";
    const [teamResult] = await connection.query(
      `INSERT INTO teams (team_name, utr, coupon_code, referral_code, total_paid, discount_amount, final_amount, payment_method, team_size, razorpay_order_id, payment_verified, verified_amount, verified_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [teamName, utr, couponCode || null, referralCode || null, finalAmount, discountAmount, finalAmount, paymentMethod, members.length, razorpayOrderId || null, isRazorpay, isRazorpay ? finalAmount : null, isRazorpay ? new Date() : null],
    );

    const teamId = teamResult.insertId;
    const memberRows = members.map((member, index) => [
      teamId,
      String(member.name || "").trim(),
      String(member.email || "").trim(),
      String(member.college || "").trim() || null,
      String(member.country || "").trim() || null,
      String(member.phone || "").trim() || null,
      String(member.discipline || "").trim() || null,
      String(member.year || member.study_year || "").trim() || null,
      String(member.gender || "").trim() || null,
      index === 0,
    ]);

    if (memberRows.some((member) => !member[1] || !member[2])) {
      throw new Error("Every team member must include a name and email.");
    }

    await connection.query(
      "INSERT INTO registration_members (team_id, name, email, college, country, phone, discipline, study_year, gender, is_leader) VALUES ?",
      [memberRows],
    );

    await connection.commit();

    return res.status(201).json({
      message: "Registration successful.",
      teamId,
    });
  } catch (error) {
    await connection.rollback();
    return res.status(400).json({ error: error.message || "Registration failed." });
  } finally {
    connection.release();
  }
});

app.get("/api/admin/teams", async (_req, res) => {
  const [teams] = await db.query("SELECT * FROM teams ORDER BY created_at DESC");
  const [members] = await db.query("SELECT * FROM registration_members ORDER BY id ASC");
  const membersByTeam = members.reduce((groups, member) => {
    groups[member.team_id] = groups[member.team_id] || [];
    groups[member.team_id].push(member);
    return groups;
  }, {});

  return res.json({
    teams: teams.map((team) => ({
      ...team,
      members: membersByTeam[team.id] || [],
    })),
  });
});

function serializeRegistration(team, members = []) {
  const leader = members.find((member) => Boolean(member.is_leader)) || members[0] || {};
  const paymentVerified = Boolean(team.payment_verified);
  const finalAmount = team.final_amount === null || team.final_amount === undefined
    ? Number(team.total_paid || 0)
    : Number(team.final_amount || 0);
  const discountAmount = Number(team.discount_amount || 0);

  return {
    id: team.id,
    team_id: team.id,
    team_name: team.team_name,
    leader: leader.name || team.team_name,
    leader_email: leader.email || "",
    leader_phone: leader.phone || "",
    leader_college: leader.college || "",
    leader_discipline: leader.discipline || "",
    leader_year: leader.study_year || "",
    leader_gender: leader.gender || "",
    members,
    member_count: members.length || Number(team.team_size || 0),
    country: leader.country || "",
    coupon: team.coupon_code || "",
    referral_code: team.referral_code || "",
    payment_status: paymentVerified ? "Verified" : "Not verified",
    payment_verified: paymentVerified,
    amount: finalAmount,
    expected_amount: finalAmount,
    discount_amount: discountAmount,
    final_amount: finalAmount,
    verified_amount: team.verified_amount === null || team.verified_amount === undefined ? null : Number(team.verified_amount),
    verified_at: team.verified_at,
    payment_qr_type: team.payment_qr_type || (team.coupon_code ? "Coupon QR" : "Main QR"),
    payment_method: team.payment_method || "upi",
    utr: team.utr || "",
    date: team.created_at,
    stage: "Registered",
  };
}

async function resolveVerifiedPayment(team) {
  const paymentMethodLabels = {
    paystack: "Paystack",
    cashfree: "Cashfree",
    upi: "UPI",
  };
  const methodLabel = paymentMethodLabels[team.payment_method] || "UPI";
  const submittedAmount = team.final_amount === null || team.final_amount === undefined
    ? Number(team.total_paid || ORIGINAL_PRICE)
    : Number(team.final_amount || 0);
  if (team.coupon_code) {
    const [coupons] = await db.query("SELECT final_price FROM coupons WHERE code = ? LIMIT 1", [team.coupon_code]);

    if (coupons[0]) {
      return {
        amount: submittedAmount || Number(coupons[0].final_price || 0),
        qrType: `${methodLabel} Coupon QR`,
      };
    }

    return {
      amount: submittedAmount,
      qrType: `${methodLabel} Coupon QR`,
    };
  }

  return {
    amount: submittedAmount,
    qrType: methodLabel,
  };
}

async function loadRegistrationMembers(teamIds) {
  if (teamIds.length === 0) return {};

  const memberTables = [];
  if (await tableExists("registration_members")) memberTables.push("registration_members");
  if (await tableExists("participants")) memberTables.push("participants");

  const membersByTeam = {};

  for (const table of memberTables) {
    if (!(await columnExists(table, "team_id"))) continue;

    const [members] = await db.query(
      `SELECT * FROM ${table} WHERE team_id IN (${teamIds.map(() => "?").join(", ")}) ORDER BY id ASC`,
      teamIds,
    );

    members.forEach((member) => {
      membersByTeam[member.team_id] = membersByTeam[member.team_id] || [];
      membersByTeam[member.team_id].push(member);
    });
  }

  return membersByTeam;
}

async function loadRegistrations({ id, search = "", page = 1, limit = 10 } = {}) {
  const params = [];
  const where = [];

  if (id) {
    where.push("t.id = ?");
    params.push(id);
  }

  if (search) {
    const memberSearchTables = [];
    if (await tableExists("registration_members")) memberSearchTables.push("registration_members");
    if (await tableExists("participants")) memberSearchTables.push("participants");
    const memberSearch = memberSearchTables
      .map((table) => `EXISTS (
        SELECT 1 FROM ${table} rm
        WHERE rm.team_id = t.id
          AND (
            rm.name LIKE ?
            OR rm.email LIKE ?
            OR rm.country LIKE ?
            OR rm.college LIKE ?
          )
      )`)
      .join(" OR ");

    where.push(`(
      t.team_name LIKE ?
      OR t.coupon_code LIKE ?
      OR t.referral_code LIKE ?
      OR t.utr LIKE ?
      OR t.payment_method LIKE ?
      ${memberSearch ? `OR ${memberSearch}` : ""}
    )`);
    params.push(...Array(5 + memberSearchTables.length * 4).fill(`%${search}%`));
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (page - 1) * limit;
  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM teams t ${whereClause}`, params);
  const [teams] = await db.query(
    `SELECT t.* FROM teams t ${whereClause} ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const ids = teams.map((team) => team.id);
  const membersByTeam = await loadRegistrationMembers(ids);

  return {
    registrations: teams.map((team) => serializeRegistration(team, membersByTeam[team.id] || [])),
    total: Number(countRows[0].total),
    page,
    limit,
  };
}

async function loadRecentVerifiedPayments(limit = 5) {
  const [teams] = await db.query(
    "SELECT * FROM teams WHERE payment_verified = TRUE ORDER BY verified_at DESC, created_at DESC LIMIT ?",
    [limit],
  );
  const ids = teams.map((team) => team.id);
  const membersByTeam = await loadRegistrationMembers(ids);

  return teams.map((team) => serializeRegistration(team, membersByTeam[team.id] || []));
}

async function loadParticipantTotal() {
  const [[teamSizeRows]] = await db.query("SELECT COALESCE(SUM(team_size), 0) AS total FROM teams WHERE team_size IS NOT NULL AND team_size > 0");
  let total = Number(teamSizeRows.total || 0);

  for (const table of ["registration_members", "participants"]) {
    if (!(await tableExists(table)) || !(await columnExists(table, "team_id"))) continue;

    const [[memberRows]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM ${table} m
      JOIN teams t ON t.id = m.team_id
      WHERE t.team_size IS NULL OR t.team_size = 0
    `);
    total += Number(memberRows.total || 0);
  }

  return total;
}

app.get("/api/admin/dashboard", async (_req, res) => {
  console.log("Dashboard hit");

  try {
    console.log("Before DB query");
    const [[registrations]] = await db.query("SELECT COUNT(*) AS count FROM teams");
    console.log("After DB query");

    console.log("Before DB query");
    const [[payments]] = await db.query("SELECT COUNT(*) AS count, COALESCE(SUM(verified_amount), 0) AS revenue FROM teams WHERE payment_verified = TRUE");
    console.log("After DB query");

    console.log("Before DB query");
    const [[coupons]] = await db.query("SELECT COUNT(*) AS count FROM teams WHERE coupon_code IS NOT NULL AND coupon_code <> ''");
    console.log("After DB query");

    console.log("Before DB query");
    const recent = await loadRegistrations({ page: 1, limit: 5 });
    console.log("After DB query");

    console.log("Before DB query");
    const verifiedPayments = await loadRecentVerifiedPayments(5);
    console.log("After DB query");

    const recentPayments = verifiedPayments
      .map((registration) => ({
        id: registration.id,
        team_id: registration.team_id,
        team_name: registration.team_name,
        leader: registration.leader,
        amount: registration.verified_amount ?? registration.amount,
        utr: registration.utr,
        date: registration.verified_at || registration.date,
      }));

    return res.json({
      registrations_count: Number(registrations.count),
      team_count: Number(registrations.count),
      payment_count: Number(payments.count),
      revenue: Number(payments.revenue || 0),
      coupon_count: Number(coupons.count),
      recent_registrations: recent.registrations,
      recent_payments: recentPayments,
      recent_activity: recent.registrations.map((registration) => ({
        id: `registration-${registration.id}`,
        label: `New registration: ${registration.team_name}`,
        date: registration.date,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      message: "Unable to load dashboard.",
      error: error.message,
    });
  }
});

app.get("/api/admin/analytics", async (_req, res) => {
  try {
    const [[summary]] = await db.query(`
      SELECT
        COUNT(*) AS registrations,
        SUM(CASE WHEN t.payment_verified = TRUE THEN 1 ELSE 0 END) AS verified_payments,
        SUM(CASE WHEN t.payment_verified = FALSE THEN 1 ELSE 0 END) AS not_verified_payments,
        SUM(CASE WHEN t.coupon_code IS NOT NULL AND t.coupon_code <> '' THEN 1 ELSE 0 END) AS coupon_registrations,
        SUM(CASE WHEN t.coupon_code IS NULL OR t.coupon_code = '' THEN 1 ELSE 0 END) AS main_qr_registrations,
        COALESCE(SUM(CASE WHEN t.payment_verified = TRUE THEN t.verified_amount ELSE 0 END), 0) AS verified_revenue,
        COALESCE(SUM(t.total_paid), 0) AS submitted_revenue,
        COALESCE(SUM(CASE WHEN t.payment_verified = TRUE AND t.coupon_code IS NOT NULL AND t.coupon_code <> '' THEN t.verified_amount ELSE 0 END), 0) AS coupon_revenue,
        COALESCE(SUM(CASE WHEN t.payment_verified = TRUE AND (t.coupon_code IS NULL OR t.coupon_code = '') THEN t.verified_amount ELSE 0 END), 0) AS main_qr_revenue
      FROM teams t
      LEFT JOIN (
        SELECT team_id, COUNT(*) AS member_count
        FROM registration_members
        GROUP BY team_id
      ) member_counts ON member_counts.team_id = t.id
    `);
    const participantTotal = await loadParticipantTotal();

    const [couponRows] = await db.query(`
      SELECT
        COALESCE(NULLIF(coupon_code, ''), 'No coupon') AS coupon,
        COUNT(*) AS registrations,
        SUM(CASE WHEN payment_verified = TRUE THEN 1 ELSE 0 END) AS verified_payments,
        COALESCE(SUM(CASE WHEN payment_verified = TRUE THEN verified_amount ELSE 0 END), 0) AS revenue
      FROM teams
      GROUP BY COALESCE(NULLIF(coupon_code, ''), 'No coupon')
      ORDER BY registrations DESC, coupon ASC
    `);

    const [recentRows] = await db.query(`
      SELECT *
      FROM teams
      WHERE payment_verified = TRUE
      ORDER BY verified_at DESC, created_at DESC
      LIMIT 10
    `);
    const recentIds = recentRows.map((team) => team.id);
    const recentMembers = await loadRegistrationMembers(recentIds);
    const recentPayments = recentRows.map((team) => serializeRegistration(team, recentMembers[team.id] || []));

    return res.json({
      summary: {
        registrations: Number(summary.registrations || 0),
        participants: participantTotal,
        verified_payments: Number(summary.verified_payments || 0),
        not_verified_payments: Number(summary.not_verified_payments || 0),
        coupon_registrations: Number(summary.coupon_registrations || 0),
        main_qr_registrations: Number(summary.main_qr_registrations || 0),
        verified_revenue: Number(summary.verified_revenue || 0),
        submitted_revenue: Number(summary.submitted_revenue || 0),
        coupon_revenue: Number(summary.coupon_revenue || 0),
        main_qr_revenue: Number(summary.main_qr_revenue || 0),
      },
      coupon_breakdown: couponRows.map((row) => ({
        coupon: row.coupon,
        registrations: Number(row.registrations || 0),
        verified_payments: Number(row.verified_payments || 0),
        revenue: Number(row.revenue || 0),
      })),
      recent_payments: recentPayments.map((registration) => ({
        id: registration.id,
        team_id: registration.team_id,
        team_name: registration.team_name,
        leader: registration.leader,
        coupon: registration.coupon || "No coupon",
        amount: registration.verified_amount ?? registration.amount,
        utr: registration.utr,
        date: registration.verified_at || registration.date,
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      message: "Unable to load analytics.",
      error: error.message,
    });
  }
});

app.get("/api/admin/registrations", async (req, res) => {
  const search = String(req.query.search || "").trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
  const data = await loadRegistrations({ search, page, limit });

  res.json(data);
});

app.get("/api/admin/registrations/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ message: "Invalid registration id." });

  const data = await loadRegistrations({ id, page: 1, limit: 1 });

  if (data.registrations.length === 0) {
    return res.status(404).json({ message: "Registration not found." });
  }

  return res.json({ registration: data.registrations[0] });
});

app.post("/api/admin/registrations/:id/verify-payment", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ message: "Invalid registration id." });

  const [teams] = await db.query("SELECT * FROM teams WHERE id = ? LIMIT 1", [id]);
  const team = teams[0];

  if (!team) return res.status(404).json({ message: "Registration not found." });
  if (!team.utr) return res.status(400).json({ message: "A transaction ID is required before payment can be verified." });

  const payment = await resolveVerifiedPayment(team);

  await db.query(
    "UPDATE teams SET payment_verified = TRUE, verified_amount = ?, verified_at = NOW(), payment_qr_type = ? WHERE id = ?",
    [payment.amount, payment.qrType, id],
  );

  const data = await loadRegistrations({ id, page: 1, limit: 1 });

  return res.json({
    message: `Payment verified. ${payment.qrType} amount added.`,
    registration: data.registrations[0],
  });
});

app.get("/api/admin/site-settings", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM site_settings WHERE id = 1");
  res.json({ settings: rows[0] });
});

app.put("/api/admin/site-settings", async (req, res) => {
  await updateSingleRecord("site_settings", [
    "website_name",
    "tagline",
    "logo_url",
    "favicon_url",
    "seo_title",
    "seo_description",
    "footer_text",
    "contact_email",
    "instagram_url",
    "linkedin_url",
    "theme_colors",
    "announcement",
  ], req.body);
  const [rows] = await db.query("SELECT * FROM site_settings WHERE id = 1");
  res.json({ settings: rows[0] });
});

app.get("/api/homepage", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM homepage_content WHERE id = 1");
  res.json({ content: serializeHomepageContent(rows[0]) });
});

app.get("/api/admin/homepage", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM homepage_content WHERE id = 1");
  res.json({ content: serializeHomepageContent(rows[0]) });
});

app.get("/api/admin/homepage-content", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM homepage_content WHERE id = 1");
  res.json({ content: serializeHomepageContent(rows[0]) });
});

app.put("/api/admin/homepage", async (req, res) => {
  await updateSingleRecord("homepage_content", [
    "hero_title",
    "hero_subtitle",
    "hero_description",
    "about_text",
    "stats_json",
    "timeline_json",
    "why_participate_json",
    "cta_title",
    "cta_description",
    "contact_json",
    "primary_cta_label",
    "primary_cta_url",
    "secondary_cta_label",
    "secondary_cta_url",
    "hero_media_url",
    "highlights",
    "stats",
    "announcements",
  ], req.body);
  const [rows] = await db.query("SELECT * FROM homepage_content WHERE id = 1");
  res.json({ content: serializeHomepageContent(rows[0]) });
});

app.put("/api/admin/homepage-content", async (req, res) => {
  await updateSingleRecord("homepage_content", [
    "hero_title",
    "hero_subtitle",
    "hero_description",
    "about_text",
    "stats_json",
    "timeline_json",
    "why_participate_json",
    "cta_title",
    "cta_description",
    "contact_json",
    "primary_cta_label",
    "primary_cta_url",
    "secondary_cta_label",
    "secondary_cta_url",
    "hero_media_url",
    "highlights",
    "stats",
    "announcements",
  ], req.body);
  const [rows] = await db.query("SELECT * FROM homepage_content WHERE id = 1");
  res.json({ content: serializeHomepageContent(rows[0]) });
});

app.get("/api/community-section", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM community_section WHERE id = 1");
  res.json({ section: serializeCommunitySection(rows[0]) });
});

app.get("/api/admin/community-section", async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM community_section WHERE id = 1");
  res.json({ section: serializeCommunitySection(rows[0]) });
});

app.put("/api/admin/community-section", async (req, res) => {
  await db.query(
    `UPDATE community_section
     SET title = ?, description = ?, image_url = ?, whatsapp_link = ?, scroll_text = ?, visible = ?
     WHERE id = 1`,
    [
      String(req.body.title || "").trim(),
      String(req.body.description || "").trim(),
      String(req.body.image_url || "").trim(),
      String(req.body.whatsapp_link || "").trim(),
      String(req.body.scroll_text || "").trim(),
      toDbBoolean(req.body.visible),
    ],
  );
  const [rows] = await db.query("SELECT * FROM community_section WHERE id = 1");
  res.json({ section: serializeCommunitySection(rows[0]) });
});

function normalizeStatus(status, fallback = "Draft") {
  const normalized = String(status || fallback).trim();
  return normalized || fallback;
}

function serializeFaq(row) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category || "",
    status: row.status || (row.is_published ? "Published" : "Draft"),
    order_index: Number(row.order_index ?? row.display_order ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function listFaqs({ search = "", category = "", page = 1, limit = 10 } = {}) {
  const where = [];
  const params = [];

  if (search) {
    where.push("(question LIKE ? OR answer LIKE ? OR category LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (category && category !== "All") {
    where.push("category = ?");
    params.push(category);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (page - 1) * limit;
  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM faq ${whereClause}`, params);
  const [rows] = await db.query(
    `SELECT * FROM faq ${whereClause} ORDER BY order_index ASC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return {
    items: rows.map(serializeFaq),
    total: Number(countRows[0].total),
    page,
    limit,
  };
}

app.get("/api/admin/faq", async (req, res) => {
  const data = await listFaqs({
    search: String(req.query.search || "").trim(),
    category: String(req.query.category || "").trim(),
    page: Math.max(1, Number(req.query.page || 1)),
    limit: Math.min(100, Math.max(1, Number(req.query.limit || 10))),
  });
  const [categories] = await db.query("SELECT DISTINCT category FROM faq WHERE category IS NOT NULL AND category <> '' ORDER BY category ASC");

  res.json({ ...data, categories: categories.map((row) => row.category) });
});

app.get("/api/faq", async (_req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM faq WHERE status = 'Published' OR is_published = TRUE ORDER BY order_index ASC, id DESC",
  );

  res.json({ items: rows.map(serializeFaq), total: rows.length });
});

app.post("/api/admin/faq", async (req, res) => {
  const question = String(req.body.question || "").trim();
  const answer = String(req.body.answer || "").trim();
  const category = String(req.body.category || "").trim();
  const status = normalizeStatus(req.body.status, "Draft");
  const orderIndex = Number(req.body.order_index || 0);

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required." });
  }

  const [result] = await db.query(
    `INSERT INTO faq (question, answer, category, status, order_index, display_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [question, answer, category, status, orderIndex, orderIndex, status === "Published"],
  );
  const [rows] = await db.query("SELECT * FROM faq WHERE id = ?", [result.insertId]);

  return res.status(201).json({ item: serializeFaq(rows[0]) });
});

app.put("/api/admin/faq/:id", async (req, res) => {
  const status = normalizeStatus(req.body.status, "Draft");
  const orderIndex = Number(req.body.order_index || 0);
  const [result] = await db.query(
    `UPDATE faq
     SET question = ?, answer = ?, category = ?, status = ?, order_index = ?, display_order = ?, is_published = ?
     WHERE id = ?`,
    [
      String(req.body.question || "").trim(),
      String(req.body.answer || "").trim(),
      String(req.body.category || "").trim(),
      status,
      orderIndex,
      orderIndex,
      status === "Published",
      req.params.id,
    ],
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "FAQ not found." });
  const [rows] = await db.query("SELECT * FROM faq WHERE id = ?", [req.params.id]);
  return res.json({ item: serializeFaq(rows[0]) });
});

app.delete("/api/admin/faq/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM faq WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "FAQ not found." });
  return res.json({ success: true });
});

function serializeNavigationItem(row) {
  return {
    id: row.id,
    label: row.label,
    path: row.path || row.url,
    parent_id: row.parent_id,
    order_index: Number(row.order_index ?? row.display_order ?? 0),
    visible: Boolean(row.visible ?? row.is_published),
    target: row.target || "_self",
    location: row.location || "navbar",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

app.get("/api/admin/navigation", async (req, res) => {
  const location = String(req.query.location || "").trim();
  const where = location && location !== "All" ? "WHERE location = ?" : "";
  const params = where ? [location] : [];
  const [rows] = await db.query(`SELECT * FROM navigation ${where} ORDER BY location ASC, parent_id ASC, order_index ASC, id DESC`, params);

  res.json({ items: rows.map(serializeNavigationItem) });
});

app.post("/api/admin/navigation", async (req, res) => {
  const label = String(req.body.label || "").trim();
  const pathValue = String(req.body.path || "").trim();

  if (!label || !pathValue) return res.status(400).json({ message: "Label and path are required." });

  const [result] = await db.query(
    `INSERT INTO navigation (label, url, path, location, parent_id, display_order, order_index, is_external, is_published, visible, target)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      label,
      pathValue,
      pathValue,
      String(req.body.location || "navbar").trim(),
      req.body.parent_id || null,
      Number(req.body.order_index || 0),
      Number(req.body.order_index || 0),
      pathValue.startsWith("http"),
      Boolean(req.body.visible ?? true),
      Boolean(req.body.visible ?? true),
      String(req.body.target || "_self").trim(),
    ],
  );
  const [rows] = await db.query("SELECT * FROM navigation WHERE id = ?", [result.insertId]);

  res.status(201).json({ item: serializeNavigationItem(rows[0]) });
});

app.put("/api/admin/navigation/:id", async (req, res) => {
  const pathValue = String(req.body.path || "").trim();
  const visible = Boolean(req.body.visible);
  const orderIndex = Number(req.body.order_index || 0);
  const [result] = await db.query(
    `UPDATE navigation
     SET label = ?, url = ?, path = ?, location = ?, parent_id = ?, display_order = ?, order_index = ?, is_external = ?, is_published = ?, visible = ?, target = ?
     WHERE id = ?`,
    [
      String(req.body.label || "").trim(),
      pathValue,
      pathValue,
      String(req.body.location || "navbar").trim(),
      req.body.parent_id || null,
      orderIndex,
      orderIndex,
      pathValue.startsWith("http"),
      visible,
      visible,
      String(req.body.target || "_self").trim(),
      req.params.id,
    ],
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Navigation item not found." });
  const [rows] = await db.query("SELECT * FROM navigation WHERE id = ?", [req.params.id]);
  return res.json({ item: serializeNavigationItem(rows[0]) });
});

app.delete("/api/admin/navigation/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM navigation WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Navigation item not found." });
  return res.json({ success: true });
});

const DEFAULT_PARTNER_TYPE = partnerCategoryConfig.defaultType;
const PARTNER_TYPE_ALIASES = new Map(
  partnerCategoryConfig.categories.flatMap((category) => [
    [category.value, category.value],
    ...(category.aliases || []).map((alias) => [alias, category.value]),
  ]),
);

function normalizePartnerType(type) {
  const normalized = String(type || DEFAULT_PARTNER_TYPE).trim().toLowerCase();
  return PARTNER_TYPE_ALIASES.get(normalized) || DEFAULT_PARTNER_TYPE;
}

function serializeAcademicPartner(row) {
  return {
    id: row.id,
    name: row.name || "",
    country: row.country || "",
    description: row.description || "",
    logo_url: row.logo_url || "",
    website: row.website || "",
    partner_type: normalizePartnerType(row.partner_type),
    display_order: Number(row.display_order || 0),
    is_visible: Boolean(row.is_visible),
    created_at: row.created_at,
  };
}

app.get("/api/academic-partners", async (_req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM academic_partners WHERE is_visible = TRUE ORDER BY partner_type ASC, display_order ASC, created_at DESC",
  );

  res.json({ items: rows.map(serializeAcademicPartner) });
});

app.get("/api/admin/academic-partners", async (req, res) => {
  const search = String(req.query.search || "").trim();
  const where = [];
  const params = [];

  if (search) {
    where.push("(name LIKE ? OR country LIKE ? OR description LIKE ? OR partner_type LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM academic_partners ${whereClause}`, params);
  const [rows] = await db.query(
    `SELECT * FROM academic_partners ${whereClause} ORDER BY partner_type ASC, display_order ASC, created_at DESC`,
    params,
  );

  res.json({ items: rows.map(serializeAcademicPartner), total: Number(countRows[0].total) });
});

app.post("/api/admin/academic-partners", async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Institution name is required." });

  const id = makeUuid();
  await db.query(
    `INSERT INTO academic_partners (id, name, country, description, logo_url, website, partner_type, display_order, is_visible)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name,
      String(req.body.country || "").trim(),
      String(req.body.description || "").trim(),
      String(req.body.logo_url || req.body.logo || "").trim(),
      String(req.body.website || "").trim(),
      normalizePartnerType(req.body.partner_type),
      Number(req.body.display_order || 0),
      toDbBoolean(req.body.is_visible ?? true),
    ],
  );
  const [rows] = await db.query("SELECT * FROM academic_partners WHERE id = ?", [id]);

  res.status(201).json({ item: serializeAcademicPartner(rows[0]) });
});

app.put("/api/admin/academic-partners/:id", async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Institution name is required." });

  const [result] = await db.query(
    `UPDATE academic_partners
     SET name = ?, country = ?, description = ?, logo_url = ?, website = ?, partner_type = ?, display_order = ?, is_visible = ?
     WHERE id = ?`,
    [
      name,
      String(req.body.country || "").trim(),
      String(req.body.description || "").trim(),
      String(req.body.logo_url || req.body.logo || "").trim(),
      String(req.body.website || "").trim(),
      normalizePartnerType(req.body.partner_type),
      Number(req.body.display_order || 0),
      toDbBoolean(req.body.is_visible ?? true),
      req.params.id,
    ],
  );

  if (result.affectedRows === 0) return res.status(404).json({ message: "Academic partner not found." });
  const [rows] = await db.query("SELECT * FROM academic_partners WHERE id = ?", [req.params.id]);
  return res.json({ item: serializeAcademicPartner(rows[0]) });
});

app.delete("/api/admin/academic-partners/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM academic_partners WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Academic partner not found." });
  return res.json({ success: true });
});

app.post("/api/admin/media/upload", upload.single("file"), async (req, res) => {
  try {
    const uploadResult = await saveMediaUpload({
      fileDataUrl: req.body.fileDataUrl,
      fileBuffer: req.file?.buffer,
      mimeType: req.file?.mimetype,
      originalName: req.body.originalName || req.file?.originalname,
      folder: req.body.folder,
    });

    if (!uploadResult) {
      return res.status(400).json({ message: "Upload a media file." });
    }

    const [result] = await db.query(
      `INSERT INTO media (file_name, original_name, url, mime_type, folder, alt_text, size_bytes, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uploadResult.fileName,
        req.body.originalName || req.file?.originalname || uploadResult.fileName,
        uploadResult.secure_url,
        uploadResult.mimeType,
        req.body.folder || null,
        req.body.alt_text || null,
        uploadResult.sizeBytes,
        mergeMetadata(req.body.metadata, uploadResult),
      ],
    );
    const [rows] = await db.query("SELECT * FROM media WHERE id = ?", [result.insertId]);

    return res.status(201).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      item: rows[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to upload media." });
  }
});

createCollectionRoutes({
  route: "/api/admin/media",
  table: "media",
  fields: ["file_name", "original_name", "url", "mime_type", "folder", "alt_text", "size_bytes", "metadata"],
  orderBy: "created_at DESC, id DESC",
});

async function startServer() {
  try {
    await db.verifyDatabaseConnection();
    await ensureSchema();
    console.log("Database schema initialized");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize MedInnovate backend:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

startServer();
