const masterCmsService = require("../services/masterCmsService");

async function getAdminConfig(_req, res) {
  const config = await masterCmsService.getAdminConfig();
  return res.json(config);
}

async function getPublicConfig(_req, res) {
  const config = await masterCmsService.getPublicConfig();
  return res.json(config);
}

async function updateMasterConfig(req, res) {
  const config = await masterCmsService.updateMasterConfig(req.body || {});
  return res.json(config);
}

module.exports = {
  getAdminConfig,
  getPublicConfig,
  updateMasterConfig,
};
