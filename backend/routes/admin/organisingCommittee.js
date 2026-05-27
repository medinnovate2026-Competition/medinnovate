const express = require("express");
const organisingCommitteeController = require("../../controllers/organisingCommitteeController");

const router = express.Router();

router.get("/", organisingCommitteeController.listMembers);
router.post("/", organisingCommitteeController.createMember);
router.put("/:id", organisingCommitteeController.updateMember);
router.delete("/:id", organisingCommitteeController.deleteMember);

module.exports = router;
