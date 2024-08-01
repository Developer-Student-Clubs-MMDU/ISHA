const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
exports.getHome = (req, res) => {
  res.json({
    message:
      "Welcome to ISHA - Intelligent System for Hyper Accelerated Learning",
    description:
      "ISHA centralizes online free courses, blogs, and lectures, allowing students to categorize and track progress visually. By marking completed topics and analyzing time spent, ISHA identifies areas needing focus. It even studies students' learning habits, recommending strategies to boost efficiency.",
  });
};

exports.getAbout = (req, res) => {
  res.json({
    message: "About ISHA",
    description:
      "ISHA bridges the gap between free online content and structured learning, aiming to improve outcomes and enhance the overall learning experience.",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).send({
    title: "Your account",
    user: updatedUser,
  });
});
