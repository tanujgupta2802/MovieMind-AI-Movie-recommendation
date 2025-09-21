const Movie = require("../models/Movie");

class RecommendationService {
  // Content-based filtering
  async getRecommendations(movieId, limit = 10) {
    try {
      const targetMovie = await Movie.findOne({ tmdbId: movieId });
      if (!targetMovie) {
        throw new Error("Movie not found");
      }

      // Find similar movies based on genres, cast, and director
      const similarMovies = await Movie.find({
        tmdbId: { $ne: movieId },
        $or: [
          { genres: { $in: targetMovie.genres } },
          { "cast.name": { $in: targetMovie.cast.map((c) => c.name) } },
          { director: targetMovie.director },
        ],
      }).limit(limit * 2); // Get more to filter later

      // Calculate similarity scores
      const recommendations = similarMovies.map((movie) => {
        const score = this.calculateSimilarity(targetMovie, movie);
        return { movie, score };
      });

      // Sort by score and return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((rec, index) => ({
          rank: index + 1,
          movie: rec.movie,
          score: rec.score,
        }));
    } catch (error) {
      console.error("Recommendation Error:", error);
      throw new Error("Failed to get recommendations");
    }
  }

  calculateSimilarity(movie1, movie2) {
    let score = 0;

    // Genre similarity (40% weight)
    const commonGenres = movie1.genres.filter((g) => movie2.genres.includes(g));
    score +=
      (commonGenres.length /
        Math.max(movie1.genres.length, movie2.genres.length)) *
      0.4;

    // Cast similarity (35% weight)
    const movie1Cast = movie1.cast.map((c) => c.name);
    const movie2Cast = movie2.cast.map((c) => c.name);
    const commonCast = movie1Cast.filter((c) => movie2Cast.includes(c));
    score +=
      (commonCast.length / Math.max(movie1Cast.length, movie2Cast.length)) *
      0.35;

    // Director similarity (25% weight)
    if (
      movie1.director &&
      movie2.director &&
      movie1.director === movie2.director
    ) {
      score += 0.25;
    }

    return score;
  }

  // User-based recommendations (for logged-in users)
  async getUserRecommendations(userId) {
    try {
      const User = require("../models/User");
      const user = await User.findById(userId);

      if (!user || !user.favoriteMovies.length) {
        // Return popular movies for new users
        const tmdbService = require("./tmdbService");
        return await tmdbService.getPopularMovies();
      }

      // Get recommendations based on user's favorite movies
      const allRecommendations = [];

      for (const favMovie of user.favoriteMovies) {
        const recs = await this.getRecommendations(favMovie.movieId, 5);
        allRecommendations.push(...recs);
      }

      // Remove duplicates and sort by average score
      const uniqueRecs = this.removeDuplicates(allRecommendations);
      return uniqueRecs.slice(0, 10);
    } catch (error) {
      console.error("User Recommendation Error:", error);
      throw new Error("Failed to get user recommendations");
    }
  }

  removeDuplicates(recommendations) {
    const seen = new Set();
    return recommendations.filter((rec) => {
      if (seen.has(rec.movie.tmdbId)) {
        return false;
      }
      seen.add(rec.movie.tmdbId);
      return true;
    });
  }
}

module.exports = new RecommendationService();
