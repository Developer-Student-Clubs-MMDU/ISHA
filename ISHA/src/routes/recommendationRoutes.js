const express = require("express");
const router = express.Router();

// Controllers (Assuming you have recommendationController)
const recommendationController = require("../controllers/recommendationController");

// Define routes
router.get("/:userId", recommendationController.getRecommendations);

module.exports = router;
