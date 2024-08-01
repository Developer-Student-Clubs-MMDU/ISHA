// src/routes/homeRoutes.js

const express = require("express");
const router = express.Router();
const homeController = require("./../controllers/homeController");

router.get("/", homeController.getHome);
router.get("/about", homeController.getAbout);

// router.post(
//   "/submit-user-data",
//   homeController.protect,
//   homeController.updateUserData
// );

module.exports = router;
