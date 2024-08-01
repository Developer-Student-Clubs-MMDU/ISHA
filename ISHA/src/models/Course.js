const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  videoLink: {
    type: String,
    required: true,
  },
  iframe: {
    type: String,
    required: true,
  },
  thumbnailImageLink: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: { type: String },
    totalDuration: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: false,
    },
    numberOfVideos: {
      type: Number,
      required: true,
    },
    videos: [videoSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
