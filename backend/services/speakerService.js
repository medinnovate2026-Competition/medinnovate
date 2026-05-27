const db = require("../config/database");

const speakerFields = [
  "name",
  "designation",
  "institution",
  "bio",
  "photo_url",
  "session_title",
  "session_description",
  "session_day",
  "session_time",
  "venue",
  "linkedin_url",
  "instagram_url",
  "website_url",
  "featured",
  "priority",
];

function serializeSpeaker(row) {
  return {
    id: row.id,
    name: row.name,
    designation: row.designation || "",
    institution: row.institution || "",
    bio: row.bio || "",
    photo_url: row.photo_url || "",
    session_title: row.session_title || "",
    session_description: row.session_description || "",
    session_day: row.session_day || "",
    session_time: row.session_time || "",
    venue: row.venue || "",
    linkedin_url: row.linkedin_url || "",
    instagram_url: row.instagram_url || "",
    website_url: row.website_url || "",
    featured: Boolean(row.featured),
    priority: Number(row.priority || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeSpeakerPayload(body) {
  const priority = Number(body.priority ?? 0);

  return {
    name: String(body.name || "").trim(),
    designation: String(body.designation || "").trim(),
    institution: String(body.institution || "").trim(),
    bio: String(body.bio || "").trim(),
    photo_url: String(body.photo_url || "").trim(),
    session_title: String(body.session_title || "").trim(),
    session_description: String(body.session_description || "").trim(),
    session_day: String(body.session_day || "").trim(),
    session_time: String(body.session_time || "").trim(),
    venue: String(body.venue || "").trim(),
    linkedin_url: String(body.linkedin_url || "").trim(),
    instagram_url: String(body.instagram_url || "").trim(),
    website_url: String(body.website_url || "").trim(),
    featured: Boolean(body.featured),
    priority: Number.isFinite(priority) ? priority : 0,
  };
}

async function listSpeakers() {
  const [rows] = await db.query(
    "SELECT * FROM speakers ORDER BY featured DESC, priority ASC, created_at DESC",
  );
  return rows.map(serializeSpeaker);
}

async function createSpeaker(speaker) {
  const values = speakerFields.map((field) => speaker[field]);
  const placeholders = speakerFields.map(() => "?").join(", ");
  const [result] = await db.query(
    `INSERT INTO speakers (${speakerFields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
  return getSpeakerById(result.insertId);
}

async function getSpeakerById(id) {
  const [rows] = await db.query("SELECT * FROM speakers WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? serializeSpeaker(rows[0]) : null;
}

async function updateSpeaker(id, speaker) {
  const assignments = speakerFields.map((field) => `${field} = ?`).join(", ");
  const values = [...speakerFields.map((field) => speaker[field]), id];
  const [result] = await db.query(`UPDATE speakers SET ${assignments} WHERE id = ?`, values);

  if (result.affectedRows === 0) return null;
  return getSpeakerById(id);
}

async function deleteSpeaker(id) {
  const [result] = await db.query("DELETE FROM speakers WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createSpeaker,
  deleteSpeaker,
  listSpeakers,
  normalizeSpeakerPayload,
  updateSpeaker,
};
