const express = require("express");
const recommendationService = require("../services/recommendationService");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/recommendations/movie
// @desc    Get movie recommendations
// @access  Public
router.post("/movie", async (req, res) => {
  try {
    const { movieId, limit = 10 } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const recommendations = await recommendationService.getRecommendations(
      movieId,
      parseInt(limit)
    );

    res.json({
      success: true,
      inputMovie: { movieId },
      recommendations: recommendations.map((rec) => ({
        rank: rec.rank,
        movieId: rec.movie.tmdbId,
        title: rec.movie.title,
        poster: rec.movie.poster,
        rating: rec.movie.rating,
        genres: rec.movie.genres,
        score: rec.score,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
});

// @route   GET /api/recommendations/user
// @desc    Get personalized user recommendations
// @access  Private
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendations = await recommendationService.getUserRecommendations(
      userId
    );

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user recommendations" });
  }
});

module.exports = router;
