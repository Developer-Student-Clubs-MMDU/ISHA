const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const ChatMessage = require("../models/ChatMessage"); // Import ChatMessage model

// Route to handle chatbot questions
router.post("/chat", async (req, res) => {
  const { userId, question } = req.body; // Expect userId and question from the request body

  if (!userId || !question) {
    return res
      .status(400)
      .json({ message: "User ID and question are required" });
  }

  try {
    // Save user question to database
    const userMessage = new ChatMessage({
      userId,
      message: question,
    });
    await userMessage.save();

    // Call the Python script with the question
    const pythonProcess = spawn("python", [
      "D:\\ISHA\\src\\services\\chatbot\\app.py", // Path to your Python script
      question,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      const response = data.toString();

      // Save chatbot response to database
      userMessage.response = response;
      await userMessage.save();

      // Respond to the client
      res.json({ answer: response });
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).json({ message: "Server error" });
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        res.status(500).json({ message: "Server error" });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get chat history for a user
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch chat history from the database
    const history = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .exec();
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
