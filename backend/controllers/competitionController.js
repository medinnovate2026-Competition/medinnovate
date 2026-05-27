const competitionService = require("../services/competitionService");

async function listAdminTracks(_req, res) {
  const items = await competitionService.listTracks();
  return res.json({ items });
}

async function listPublicTracks(_req, res) {
  const items = await competitionService.listTracks({ publicOnly: true });
  return res.json({ items });
}

async function createTrack(req, res) {
  const track = competitionService.normalizeTrackPayload(req.body);

  if (!track.title) {
    return res.status(400).json({ message: "Track title is required." });
  }

  const item = await competitionService.createTrack(track);
  return res.status(201).json({ item });
}

async function updateTrack(req, res) {
  const track = competitionService.normalizeTrackPayload(req.body);

  if (!track.title) {
    return res.status(400).json({ message: "Track title is required." });
  }

  const item = await competitionService.updateTrack(req.params.id, track);
  if (!item) return res.status(404).json({ message: "Competition track not found." });

  return res.json({ item });
}

async function deleteTrack(req, res) {
  const deleted = await competitionService.deleteTrack(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Competition track not found." });

  return res.json({ success: true });
}

module.exports = {
  createTrack,
  deleteTrack,
  listAdminTracks,
  listPublicTracks,
  updateTrack,
};
