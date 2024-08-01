// src/controllers/courseController.js

const { spawn } = require("child_process");
const Course = require("../models/Course");

// Method to add a course
exports.addCourse = async (req, res) => {
  const { url, userId } = req.body; // Expect userId from request body
  console.log(url);

  try {
    // Check if course URL already exists for the given user
    const existingCourse = await Course.findOne({ url, userId });

    if (existingCourse) {
      return res.status(400).json({ message: "Course already added" });
    }
    // Call the Python script to scrape data
    const pythonProcess = spawn("python", [
      "D:\\ISHA\\src\\services\\scrap.py",
      url,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      const courseData = JSON.parse(data.toString());
      console.log(courseData);

      if (courseData.error) {
        return res.status(400).json({ message: courseData.error });
      }

      // Include userId in course data
      courseData.userId = userId;
      courseData.url = url;
      const course = new Course(courseData);
      await course.save();

      res.status(201).json({
        message: "Course added successfully",
        course,
      });
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send("Server error");
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Method to get courses by user ID
exports.getCoursesByUserId = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.params.userId });

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this user" });
    }

    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Method to get a single course by ID
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Method to delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
