const express = require("express");
const router = express.Router();

// Controllers (Assuming you have courseController)
const courseController = require("../controllers/courseController");

// Define routes
router.post("/add", courseController.addCourse); // Add a new course
router.get("/:id", courseController.getCourse); // Get a course by ID
router.get("/userId/:userId", courseController.getCoursesByUserId); // Delete a course by ID
router.delete("/:id", courseController.deleteCourse); // Delete a course by ID

module.exports = router;
