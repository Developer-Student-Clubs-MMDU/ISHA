const express = require("express");
const router = express.Router();

// Controllers (Assuming you have progressController)
const progressController = require("../controllers/progressController");

// Define routes
router.post("/update", progressController.updateProgress);
router.get("/:userId", progressController.getProgress);

module.exports = router;
