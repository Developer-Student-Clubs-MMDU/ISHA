const Progress = require("../models/Progress");

exports.updateProgress = async (req, res) => {
  const { userId, courseId, progress } = req.body;

  try {
    let userProgress = await Progress.findOne({ userId, courseId });

    if (userProgress) {
      userProgress.progress = progress;
    } else {
      userProgress = new Progress({ userId, courseId, progress });
    }

    await userProgress.save();

    res.json(userProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
