const express = require("express");
const websiteBuilderController = require("../../controllers/websiteBuilderController");

const router = express.Router();

router.get("/", websiteBuilderController.listAdminSections);
router.post("/", websiteBuilderController.createSection);
router.put("/:id", websiteBuilderController.updateSection);

module.exports = router;
