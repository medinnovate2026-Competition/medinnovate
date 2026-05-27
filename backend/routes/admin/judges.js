const express = require("express");
const judgeController = require("../../controllers/judgeController");

const router = express.Router();

router.get("/", judgeController.listJudges);
router.post("/", judgeController.createJudge);
router.put("/:id", judgeController.updateJudge);
router.delete("/:id", judgeController.deleteJudge);

module.exports = router;
