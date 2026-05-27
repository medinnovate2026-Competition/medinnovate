const express = require("express");
const sponsorController = require("../../controllers/sponsorController");

const router = express.Router();

router.get("/", sponsorController.listAdminSponsors);
router.post("/", sponsorController.createSponsor);
router.put("/:id", sponsorController.updateSponsor);
router.delete("/:id", sponsorController.deleteSponsor);

module.exports = router;
