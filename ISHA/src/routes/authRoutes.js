const express = require("express");
const router = express.Router();

// Controllers (Assuming you have authController)
const authController = require("../controllers/authController");

// Define routes
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
