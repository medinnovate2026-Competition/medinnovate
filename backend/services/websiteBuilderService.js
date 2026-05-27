const db = require("../config/database");

const backgroundTypes = new Set(["default", "light", "dark", "gradient", "transparent"]);
const removedSectionKeys = new Set(["competition"]);

const sectionFields = [
  "section_key",
  "section_name",
  "title",
  "subtitle",
  "visible",
  "display_order",
  "background_type",
  "animation",
  "custom_css_class",
];

function serializeSection(row) {
  return {
    id: row.id,
    section_key: row.section_key,
    section_name: row.section_name || "",
    title: row.title || "",
    subtitle: row.subtitle || "",
    visible: Boolean(row.visible),
    display_order: Number(row.display_order || 0),
    background_type: row.background_type || "default",
    animation: row.animation || "fade",
    custom_css_class: row.custom_css_class || "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function isSupportedSection(row) {
  return !removedSectionKeys.has(String(row.section_key || "").trim().toLowerCase());
}

function normalizeSectionPayload(body) {
  const displayOrder = Number(body.display_order ?? 0);
  const backgroundType = String(body.background_type || "default").trim().toLowerCase();
  const sectionKey = String(body.section_key || "").trim().toLowerCase();
  const forcedVisible = sectionKey === "hero" || sectionKey === "footer";

  return {
    section_key: sectionKey,
    section_name: String(body.section_name || "").trim(),
    title: String(body.title || "").trim(),
    subtitle: String(body.subtitle || "").trim(),
    visible: forcedVisible ? true : body.visible === undefined ? true : Boolean(body.visible),
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    background_type: backgroundTypes.has(backgroundType) ? backgroundType : "default",
    animation: String(body.animation || "fade").trim(),
    custom_css_class: String(body.custom_css_class || "").trim(),
  };
}

async function listSections() {
  const [rows] = await db.query("SELECT * FROM website_sections ORDER BY display_order ASC, id ASC");
  return rows.filter(isSupportedSection).map(serializeSection);
}

async function listVisibleSections() {
  const [rows] = await db.query(
    "SELECT * FROM website_sections WHERE visible = TRUE OR section_key IN ('hero', 'footer') ORDER BY display_order ASC, id ASC",
  );
  return rows.filter(isSupportedSection).map(serializeSection);
}

async function getSectionById(id) {
  const [rows] = await db.query("SELECT * FROM website_sections WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? serializeSection(rows[0]) : null;
}

async function createSection(section) {
  const values = sectionFields.map((field) => section[field]);
  const placeholders = sectionFields.map(() => "?").join(", ");
  const [result] = await db.query(
    `INSERT INTO website_sections (${sectionFields.join(", ")}) VALUES (${placeholders})`,
    values,
  );
  return getSectionById(result.insertId);
}

async function updateSection(id, section) {
  const existing = await getSectionById(id);
  if (!existing) return null;

  const nextSection = {
    ...section,
    visible: existing.section_key === "hero" || existing.section_key === "footer" ? true : section.visible,
  };
  const assignments = sectionFields
    .filter((field) => field !== "section_key")
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...sectionFields.filter((field) => field !== "section_key").map((field) => nextSection[field]), id];
  const [result] = await db.query(`UPDATE website_sections SET ${assignments} WHERE id = ?`, values);

  if (result.affectedRows === 0) return null;
  return getSectionById(id);
}

module.exports = {
  createSection,
  listSections,
  listVisibleSections,
  normalizeSectionPayload,
  updateSection,
};
