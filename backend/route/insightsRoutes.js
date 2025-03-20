const express = require("express");
const { addInsight, getInsights } = require("../controllers/insightsController");

const router = express.Router();

router.post("/add", addInsight);
router.get("/", getInsights);

module.exports = router;
