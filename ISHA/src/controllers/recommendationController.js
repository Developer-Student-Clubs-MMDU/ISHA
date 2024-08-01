const Recommendation = require("../models/Recommendation");

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      userId: req.params.userId,
    });

    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
