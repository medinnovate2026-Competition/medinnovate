const express = require("express");
const speakerController = require("../../controllers/speakerController");

const router = express.Router();

router.get("/", speakerController.listSpeakers);
router.post("/", speakerController.createSpeaker);
router.put("/:id", speakerController.updateSpeaker);
router.delete("/:id", speakerController.deleteSpeaker);

module.exports = router;
