const express = require("express");
const masterCmsController = require("../../controllers/masterCmsController");

const router = express.Router();

router.get("/", masterCmsController.getAdminConfig);
router.put("/", masterCmsController.updateMasterConfig);

module.exports = router;
