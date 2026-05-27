const db = require("../config/database");
const websiteBuilderService = require("./websiteBuilderService");

const defaultSettings = {
  homepage_sections: {
    type: "json",
    value: [],
  },
  site_theme: {
    type: "json",
    value: {
      mode: "default",
      primary_color: "#7C3AED",
      accent_color: "#EC4899",
      button_style: "rounded",
      animation_intensity: "normal",
    },
  },
  maintenance_mode: { type: "boolean", value: false },
  maintenance_message: { type: "text", value: "MedInnovate is currently under maintenance. Please check back soon." },
  announcement_enabled: { type: "boolean", value: false },
  announcement_text: { type: "text", value: "Registrations Open" },
  countdown_enabled: { type: "boolean", value: false },
  countdown_date: { type: "text", value: "" },
  registration_banner_enabled: { type: "boolean", value: false },
  registration_banner_text: { type: "text", value: "Early Bird Open" },
  popup_enabled: { type: "boolean", value: false },
  popup_title: { type: "text", value: "Registrations Open" },
  popup_content: { type: "text", value: "Register your team and start building for public health." },
  schedule_enabled: { type: "boolean", value: false },
  gallery_enabled: { type: "boolean", value: false },
  sponsors_enabled: { type: "boolean", value: false },
  judges_enabled: { type: "boolean", value: true },
  speakers_enabled: { type: "boolean", value: true },
  committee_enabled: { type: "boolean", value: true },
  faq_enabled: { type: "boolean", value: true },
  community_enabled: { type: "boolean", value: true },
};

function getDefaultSettings() {
  return Object.fromEntries(Object.entries(defaultSettings).map(([key, config]) => [key, config.value]));
}

function parseSettingValue(value, type) {
  if (type === "boolean") return value === true || value === "true" || value === "1" || value === 1;
  if (type === "number") return Number(value || 0);
  if (type === "json") {
    try {
      return typeof value === "string" ? JSON.parse(value || "null") : value;
    } catch {
      return null;
    }
  }
  return value == null ? "" : String(value);
}

function inferType(key, value) {
  if (defaultSettings[key]?.type) return defaultSettings[key].type;
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (value && typeof value === "object") return "json";
  return "text";
}

function stringifySettingValue(value, type) {
  if (type === "json") return JSON.stringify(value ?? null);
  if (type === "boolean") return value ? "true" : "false";
  if (type === "number") return String(Number(value || 0));
  return value == null ? "" : String(value);
}

async function ensureDefaults() {
  const entries = Object.entries(defaultSettings);
  for (const [settingKey, setting] of entries) {
    await db.query(
      `INSERT INTO master_cms (setting_key, setting_value, setting_type)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_key = setting_key`,
      [settingKey, stringifySettingValue(setting.value, setting.type), setting.type],
    );
  }
}

async function listSettings() {
  await ensureDefaults();
  const [rows] = await db.query("SELECT * FROM master_cms ORDER BY setting_key ASC");
  const settings = getDefaultSettings();

  rows.forEach((row) => {
    if (row.setting_key === "competition_enabled") return;
    settings[row.setting_key] = parseSettingValue(row.setting_value, row.setting_type || inferType(row.setting_key, row.setting_value));
  });

  return settings;
}

async function upsertSettings(settings = {}) {
  const entries = Object.entries(settings);
  for (const [settingKey, value] of entries) {
    const normalizedKey = String(settingKey || "").trim();
    if (!normalizedKey) continue;
    if (normalizedKey === "competition_enabled") continue;
    const type = inferType(normalizedKey, value);
    await db.query(
      `INSERT INTO master_cms (setting_key, setting_value, setting_type)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type)`,
      [normalizedKey, stringifySettingValue(value, type), type],
    );
  }

  return listSettings();
}

async function updateSections(sections = []) {
  if (!Array.isArray(sections)) return websiteBuilderService.listSections();

  for (const section of sections) {
    if (!section?.id) continue;
    const payload = websiteBuilderService.normalizeSectionPayload(section);
    await websiteBuilderService.updateSection(section.id, payload);
  }

  return websiteBuilderService.listSections();
}

async function getAdminConfig() {
  const [settings, sections] = await Promise.all([
    listSettings(),
    websiteBuilderService.listSections(),
  ]);

  return { settings, sections };
}

async function getPublicConfig() {
  const [settings, sections] = await Promise.all([
    listSettings(),
    websiteBuilderService.listSections(),
  ]);

  return {
    settings,
    sections,
    visible_sections: sections.filter((section) => section.visible || section.section_key === "hero" || section.section_key === "footer"),
  };
}

async function updateMasterConfig(payload = {}) {
  const sections = await updateSections(payload.sections || []);
  const settings = await upsertSettings({
    ...(payload.settings || {}),
    homepage_sections: sections,
  });

  return { settings, sections };
}

module.exports = {
  defaultSettings,
  getAdminConfig,
  getPublicConfig,
  updateMasterConfig,
};
