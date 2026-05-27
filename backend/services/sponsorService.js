const db = require("../config/database");

const tiers = new Set(["title", "platinum", "gold", "silver", "bronze", "community", "exhibitor", "support"]);

const sponsorFields = [
  "name",
  "tier",
  "description",
  "logo_url",
  "website_url",
  "instagram_url",
  "linkedin_url",
  "booth_number",
  "session_enabled",
  "session_title",
  "session_description",
  "display_order",
  "featured",
  "active",
];

function serializeSponsor(row) {
  return {
    id: row.id,
    name: row.name,
    tier: row.tier || "support",
    description: row.description || "",
    logo_url: row.logo_url || "",
    website_url: row.website_url || "",
    instagram_url: row.instagram_url || "",
    linkedin_url: row.linkedin_url || "",
    booth_number: row.booth_number || "",
    session_enabled: Boolean(row.session_enabled),
    session_title: row.session_title || "",
    session_description: row.session_description || "",
    display_order: Number(row.display_order || 0),
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeSponsorPayload(body) {
  const tier = String(body.tier || "support").trim().toLowerCase();
  const displayOrder = Number(body.display_order ?? 0);

  return {
    name: String(body.name || "").trim(),
    tier: tiers.has(tier) ? tier : "support",
    description: String(body.description || "").trim(),
    logo_url: String(body.logo_url || "").trim(),
    website_url: String(body.website_url || "").trim(),
    instagram_url: String(body.instagram_url || "").trim(),
    linkedin_url: String(body.linkedin_url || "").trim(),
    booth_number: String(body.booth_number || "").trim(),
    session_enabled: Boolean(body.session_enabled),
    session_title: String(body.session_title || "").trim(),
    session_description: String(body.session_description || "").trim(),
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    featured: Boolean(body.featured),
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

async function listSponsors({ publicOnly = false } = {}) {
  const where = publicOnly ? "WHERE active = TRUE" : "";
  const [rows] = await db.query(
    `SELECT * FROM sponsors ${where} ORDER BY tier ASC, featured DESC, display_order ASC, created_at DESC`,
  );
  return rows.map(serializeSponsor);
}

async function getSponsorById(id) {
  const [rows] = await db.query("SELECT * FROM sponsors WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? serializeSponsor(rows[0]) : null;
}

async function createSponsor(sponsor) {
  const values = sponsorFields.map((field) => sponsor[field]);
  const placeholders = sponsorFields.map(() => "?").join(", ");
  const [result] = await db.query(
    `INSERT INTO sponsors (${sponsorFields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
  return getSponsorById(result.insertId);
}

async function updateSponsor(id, sponsor) {
  const assignments = sponsorFields.map((field) => `${field} = ?`).join(", ");
  const values = [...sponsorFields.map((field) => sponsor[field]), id];
  const [result] = await db.query(`UPDATE sponsors SET ${assignments} WHERE id = ?`, values);

  if (result.affectedRows === 0) return null;
  return getSponsorById(id);
}

async function deleteSponsor(id) {
  const [result] = await db.query("DELETE FROM sponsors WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createSponsor,
  deleteSponsor,
  listSponsors,
  normalizeSponsorPayload,
  updateSponsor,
};
