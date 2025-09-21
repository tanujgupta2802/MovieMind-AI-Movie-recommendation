const express = require("express");
const Movie = require("../models/Movie");
const Review = require("../models/Review");
const tmdbService = require("../services/tmdbService");
const scrapeService = require("../services/scrapeService");
const sentimentAnalysis = require("../utils/sentimentAnalysis");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/movies/popular
// @desc    Get popular movies
// @access  Public
// MOVED TO TOP - specific routes must come before parameterized routes
router.get("/popular", async (req, res) => {
  try {
    console.log("📽️ Fetching popular movies...");
    const movies = await tmdbService.getPopularMovies();

    res.json({
      success: true,
      results: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        rating: movie.vote_average,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching popular movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get popular movies",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/movies/search/:query
// @desc    Search movies
// @access  Public
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    console.log(`🔍 Searching movies for: ${query}`);
    const movies = await tmdbService.searchMovies(query);

    res.json({
      success: true,
      results: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        rating: movie.vote_average,
      })),
    });
  } catch (error) {
    console.error("❌ Error searching movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search movies",
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie details
// @access  Public
// MOVED AFTER specific routes - parameterized routes should come last
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🎬 Fetching movie with ID: ${id}`);

    // Check if movie exists in our database
    let movie = await Movie.findOne({ tmdbId: id });

    if (!movie) {
      // Fetch from TMDB and save to database
      const tmdbMovie = await tmdbService.getMovieDetails(id);

      movie = new Movie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        releaseDate: tmdbMovie.release_date,
        genres: tmdbMovie.genres.map((g) => g.name),
        poster: tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
          : null,
        backdrop: tmdbMovie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`
          : null,
        rating: tmdbMovie.vote_average,
        runtime: tmdbMovie.runtime,
        cast: tmdbMovie.cast.map((c) => ({
          name: c.name,
          character: c.character,
          profilePath: c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null,
        })),
        director: tmdbMovie.director,
        imdbId: tmdbMovie.imdb_id,
      });

      await movie.save();
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("❌ Error fetching movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get movie details",
    });
  }
});

// @route   GET /api/movies/:id/reviews
// @desc    Get movie reviews with sentiment analysis
// @access  Public
router.get("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Fetching reviews for movie ID: ${id}`);

    // Check if reviews exist in database
    let reviews = await Review.find({ movieId: id });

    if (reviews.length === 0) {
      // Get movie to find IMDB ID
      const movie = await Movie.findOne({ tmdbId: id });
      if (!movie || !movie.imdbId) {
        return res.status(404).json({
          success: false,
          message: "Movie not found or IMDB ID not available",
        });
      }

      // Scrape reviews from IMDB
      const scrapedReviews = await scrapeService.getIMDBReviews(movie.imdbId);

      if (scrapedReviews.length > 0) {
        // Analyze sentiment
        const analyzedReviews =
          sentimentAnalysis.analyzeReviews(scrapedReviews);

        // Save to database
        const reviewDocs = analyzedReviews.map((review) => ({
          movieId: id,
          content: review.content,
          sentiment: review.sentiment,
          sentimentScore: review.score,
        }));

        reviews = await Review.insertMany(reviewDocs);
      }
    }

    // Calculate sentiment summary
    const sentimentSummary = {
      total: reviews.length,
      positive: reviews.filter((r) => r.sentiment === "positive").length,
      negative: reviews.filter((r) => r.sentiment === "negative").length,
      neutral: reviews.filter((r) => r.sentiment === "neutral").length,
    };

    res.json({
      success: true,
      reviews,
      sentimentSummary,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get movie reviews",
    });
  }
});

// @route   POST /api/movies/:id/favorite
// @desc    Add movie to favorites
// @access  Private
router.post("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Get movie details
    const movie = await Movie.findOne({ tmdbId: id });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Add to user's favorites
    const User = require("../models/User");
    const user = await User.findById(userId);

    // Check if already in favorites
    const isAlreadyFavorite = user.favoriteMovies.some(
      (fav) => fav.movieId === id
    );
    if (isAlreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Movie already in favorites",
      });
    }

    user.favoriteMovies.push({
      movieId: id,
      title: movie.title,
      poster: movie.poster,
    });

    await user.save();

    res.json({
      success: true,
      message: "Movie added to favorites",
    });
  } catch (error) {
    console.error("❌ Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to favorites",
    });
  }
});

module.exports = router;
