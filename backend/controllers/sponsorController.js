const sponsorService = require("../services/sponsorService");

async function listAdminSponsors(_req, res) {
  const items = await sponsorService.listSponsors();
  return res.json({ items });
}

async function listPublicSponsors(_req, res) {
  const items = await sponsorService.listSponsors({ publicOnly: true });
  return res.json({ items });
}

async function createSponsor(req, res) {
  const sponsor = sponsorService.normalizeSponsorPayload(req.body);

  if (!sponsor.name) {
    return res.status(400).json({ message: "Sponsor name is required." });
  }

  const item = await sponsorService.createSponsor(sponsor);
  return res.status(201).json({ item });
}

async function updateSponsor(req, res) {
  const sponsor = sponsorService.normalizeSponsorPayload(req.body);

  if (!sponsor.name) {
    return res.status(400).json({ message: "Sponsor name is required." });
  }

  const item = await sponsorService.updateSponsor(req.params.id, sponsor);
  if (!item) return res.status(404).json({ message: "Sponsor not found." });

  return res.json({ item });
}

async function deleteSponsor(req, res) {
  const deleted = await sponsorService.deleteSponsor(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Sponsor not found." });

  return res.json({ success: true });
}

module.exports = {
  createSponsor,
  deleteSponsor,
  listAdminSponsors,
  listPublicSponsors,
  updateSponsor,
};
