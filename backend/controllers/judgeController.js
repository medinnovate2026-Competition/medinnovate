const judgeService = require("../services/judgeService");

async function listJudges(_req, res) {
  const items = await judgeService.listJudges();
  return res.json({ items });
}

async function createJudge(req, res) {
  const judge = judgeService.normalizeJudgePayload(req.body);

  if (!judge.name) {
    return res.status(400).json({ message: "Name is required." });
  }

  const item = await judgeService.createJudge(judge);
  return res.status(201).json({ item });
}

async function updateJudge(req, res) {
  const judge = judgeService.normalizeJudgePayload(req.body);

  if (!judge.name) {
    return res.status(400).json({ message: "Name is required." });
  }

  const item = await judgeService.updateJudge(req.params.id, judge);
  if (!item) return res.status(404).json({ message: "Judge not found." });

  return res.json({ item });
}

async function deleteJudge(req, res) {
  const deleted = await judgeService.deleteJudge(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Judge not found." });

  return res.json({ success: true });
}

module.exports = {
  createJudge,
  deleteJudge,
  listJudges,
  updateJudge,
};
