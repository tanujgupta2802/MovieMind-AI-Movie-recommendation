const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      required: true,
    },
    sentimentScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    source: {
      type: String,
      default: "imdb",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
