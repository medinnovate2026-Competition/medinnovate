const db = require("../config/database");

const categories = new Set(["research", "poster", "innovation", "case", "oral", "other"]);

const competitionFields = [
  "title",
  "slug",
  "short_description",
  "full_description",
  "category",
  "eligibility",
  "rules",
  "judging_criteria",
  "prizes",
  "submission_deadline",
  "max_participants",
  "registration_fee",
  "display_order",
  "featured",
  "active",
];

function serializeTrack(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || "",
    short_description: row.short_description || "",
    full_description: row.full_description || "",
    category: row.category || "research",
    eligibility: row.eligibility || "",
    rules: row.rules || "",
    judging_criteria: row.judging_criteria || "",
    prizes: row.prizes || "",
    submission_deadline: row.submission_deadline,
    max_participants: row.max_participants === null || row.max_participants === undefined ? "" : Number(row.max_participants),
    registration_fee: row.registration_fee === null || row.registration_fee === undefined ? "" : Number(row.registration_fee),
    display_order: Number(row.display_order || 0),
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDateTime(value) {
  if (!value) return null;
  const normalized = String(value).replace("T", " ").trim();
  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

function normalizeTrackPayload(body) {
  const displayOrder = Number(body.display_order ?? 0);
  const maxParticipants = Number(body.max_participants);
  const registrationFee = Number(body.registration_fee);
  const category = String(body.category || "research").trim().toLowerCase();
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim() || slugify(title);

  return {
    title,
    slug,
    short_description: String(body.short_description || "").trim(),
    full_description: String(body.full_description || "").trim(),
    category: categories.has(category) ? category : "research",
    eligibility: String(body.eligibility || "").trim(),
    rules: String(body.rules || "").trim(),
    judging_criteria: String(body.judging_criteria || "").trim(),
    prizes: String(body.prizes || "").trim(),
    submission_deadline: normalizeDateTime(body.submission_deadline),
    max_participants: Number.isFinite(maxParticipants) ? maxParticipants : null,
    registration_fee: Number.isFinite(registrationFee) ? registrationFee : null,
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    featured: Boolean(body.featured),
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

async function listTracks({ publicOnly = false } = {}) {
  const where = publicOnly ? "WHERE active = TRUE" : "";
  const [rows] = await db.query(
    `SELECT * FROM competition_tracks ${where} ORDER BY featured DESC, display_order ASC, created_at DESC`,
  );
  return rows.map(serializeTrack);
}

async function getTrackById(id) {
  const [rows] = await db.query("SELECT * FROM competition_tracks WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? serializeTrack(rows[0]) : null;
}

async function createTrack(track) {
  const values = competitionFields.map((field) => track[field]);
  const placeholders = competitionFields.map(() => "?").join(", ");
  const [result] = await db.query(
    `INSERT INTO competition_tracks (${competitionFields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
  return getTrackById(result.insertId);
}

async function updateTrack(id, track) {
  const assignments = competitionFields.map((field) => `${field} = ?`).join(", ");
  const values = [...competitionFields.map((field) => track[field]), id];
  const [result] = await db.query(`UPDATE competition_tracks SET ${assignments} WHERE id = ?`, values);

  if (result.affectedRows === 0) return null;
  return getTrackById(id);
}

async function deleteTrack(id) {
  const [result] = await db.query("DELETE FROM competition_tracks WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createTrack,
  deleteTrack,
  listTracks,
  normalizeTrackPayload,
  updateTrack,
};
