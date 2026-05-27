const websiteBuilderService = require("../services/websiteBuilderService");

async function listAdminSections(_req, res) {
  const items = await websiteBuilderService.listSections();
  return res.json({ items });
}

async function listPublicSections(_req, res) {
  const items = await websiteBuilderService.listVisibleSections();
  return res.json({ items });
}

async function createSection(req, res) {
  const section = websiteBuilderService.normalizeSectionPayload(req.body);

  if (!section.section_key) {
    return res.status(400).json({ message: "Section key is required." });
  }

  const item = await websiteBuilderService.createSection(section);
  return res.status(201).json({ item });
}

async function updateSection(req, res) {
  const section = websiteBuilderService.normalizeSectionPayload(req.body);
  const item = await websiteBuilderService.updateSection(req.params.id, section);

  if (!item) return res.status(404).json({ message: "Website section not found." });
  return res.json({ item });
}

module.exports = {
  createSection,
  listAdminSections,
  listPublicSections,
  updateSection,
};
