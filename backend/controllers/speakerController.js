const speakerService = require("../services/speakerService");

async function listSpeakers(_req, res) {
  const items = await speakerService.listSpeakers();
  return res.json({ items });
}

async function createSpeaker(req, res) {
  const speaker = speakerService.normalizeSpeakerPayload(req.body);

  if (!speaker.name) {
    return res.status(400).json({ message: "Name is required." });
  }

  const item = await speakerService.createSpeaker(speaker);
  return res.status(201).json({ item });
}

async function updateSpeaker(req, res) {
  const speaker = speakerService.normalizeSpeakerPayload(req.body);

  if (!speaker.name) {
    return res.status(400).json({ message: "Name is required." });
  }

  const item = await speakerService.updateSpeaker(req.params.id, speaker);
  if (!item) return res.status(404).json({ message: "Speaker not found." });

  return res.json({ item });
}

async function deleteSpeaker(req, res) {
  const deleted = await speakerService.deleteSpeaker(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Speaker not found." });

  return res.json({ success: true });
}

module.exports = {
  createSpeaker,
  deleteSpeaker,
  listSpeakers,
  updateSpeaker,
};
