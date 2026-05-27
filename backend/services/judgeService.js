const db = require("../config/database");

const judgeTypes = new Set(["faculty", "industry", "research", "sponsor", "external"]);

const judgeFields = [
  "name",
  "designation",
  "institution",
  "speciality",
  "bio",
  "expertise",
  "photo_url",
  "linkedin_url",
  "website_url",
  "judge_type",
  "featured",
  "priority",
];

function serializeJudge(row) {
  return {
    id: row.id,
    name: row.name,
    designation: row.designation || "",
    institution: row.institution || "",
    speciality: row.speciality || "",
    bio: row.bio || "",
    expertise: row.expertise || "",
    photo_url: row.photo_url || "",
    linkedin_url: row.linkedin_url || "",
    website_url: row.website_url || "",
    judge_type: row.judge_type || "faculty",
    featured: Boolean(row.featured),
    priority: Number(row.priority || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeJudgePayload(body) {
  const priority = Number(body.priority ?? 0);
  const judgeType = String(body.judge_type || "faculty").trim().toLowerCase();

  return {
    name: String(body.name || "").trim(),
    designation: String(body.designation || "").trim(),
    institution: String(body.institution || "").trim(),
    speciality: String(body.speciality || "").trim(),
    bio: String(body.bio || "").trim(),
    expertise: String(body.expertise || "").trim(),
    photo_url: String(body.photo_url || "").trim(),
    linkedin_url: String(body.linkedin_url || "").trim(),
    website_url: String(body.website_url || "").trim(),
    judge_type: judgeTypes.has(judgeType) ? judgeType : "faculty",
    featured: Boolean(body.featured),
    priority: Number.isFinite(priority) ? priority : 0,
  };
}

async function listJudges() {
  const [rows] = await db.query(
    "SELECT * FROM judges ORDER BY featured DESC, priority ASC, created_at DESC",
  );
  return rows.map(serializeJudge);
}

async function getJudgeById(id) {
  const [rows] = await db.query("SELECT * FROM judges WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? serializeJudge(rows[0]) : null;
}

async function createJudge(judge) {
  const values = judgeFields.map((field) => judge[field]);
  const placeholders = judgeFields.map(() => "?").join(", ");
  const [result] = await db.query(
    `INSERT INTO judges (${judgeFields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
  return getJudgeById(result.insertId);
}

async function updateJudge(id, judge) {
  const assignments = judgeFields.map((field) => `${field} = ?`).join(", ");
  const values = [...judgeFields.map((field) => judge[field]), id];
  const [result] = await db.query(`UPDATE judges SET ${assignments} WHERE id = ?`, values);

  if (result.affectedRows === 0) return null;
  return getJudgeById(id);
}

async function deleteJudge(id) {
  const [result] = await db.query("DELETE FROM judges WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createJudge,
  deleteJudge,
  listJudges,
  normalizeJudgePayload,
  updateJudge,
};
