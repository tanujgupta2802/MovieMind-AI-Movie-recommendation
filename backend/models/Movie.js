const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: String,
    releaseDate: Date,
    genres: [String],
    poster: String,
    backdrop: String,
    rating: Number,
    runtime: Number,
    cast: [
      {
        name: String,
        character: String,
        profilePath: String,
      },
    ],
    director: String,
    imdbId: String,
    keywords: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
