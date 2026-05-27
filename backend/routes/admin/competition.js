const express = require("express");
const competitionController = require("../../controllers/competitionController");

const router = express.Router();

router.get("/", competitionController.listAdminTracks);
router.post("/", competitionController.createTrack);
router.put("/:id", competitionController.updateTrack);
router.delete("/:id", competitionController.deleteTrack);

module.exports = router;
