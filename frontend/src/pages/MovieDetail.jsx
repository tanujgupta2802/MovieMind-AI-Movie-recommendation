// src/pages/MovieDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Users,
  Play,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { moviesAPI, recommendationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SentimentAnalysis from "../components/recommendations/SentimentAnalysis";
import RecommendationCard from "../components/recommendations/RecommendationCard";
import Loading from "../components/common/Loading";
import { formatDate, formatRuntime, formatRating } from "../utils/constants.js";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentimentSummary, setSentimentSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details
        const movieResponse = await moviesAPI.getDetails(id);
        const movieData = movieResponse.data.movie;
        setMovie(movieData);

        // Check if movie is in user's favorites
        if (user && user.favoriteMovies) {
          setIsFavorite(user.favoriteMovies.some((fav) => fav.movieId === id));
        }

        // Fetch reviews and sentiment analysis in parallel
        const [reviewsResponse, recommendationsResponse] = await Promise.all([
          moviesAPI.getReviews(id).catch((err) => ({
            data: { reviews: [], sentimentSummary: null },
          })),
          recommendationsAPI
            .getMovieRecommendations({ movieId: id, limit: 6 })
            .catch((err) => ({ data: { recommendations: [] } })),
        ]);

        setReviews(reviewsResponse.data.reviews);
        setSentimentSummary(reviewsResponse.data.sentimentSummary);
        setRecommendations(recommendationsResponse.data.recommendations);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id, user]);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAddingToFavorites(true);
    try {
      await moviesAPI.addToFavorites(id);
      setIsFavorite(true);
      // Show success message (you could add a toast notification here)
    } catch (error) {
      console.error("Error adding to favorites:", error);
      // Show error message
    } finally {
      setAddingToFavorites(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on MovieMind!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show copied message
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading movie details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
            <Link
              to="/search"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Go to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Movie not found
          </h2>
          <p className="text-gray-600 mb-6">
            The movie you're looking for doesn't exist.
          </p>
          <Link to="/search" className="text-blue-600 hover:underline">
            Go back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Movie Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {movie.backdrop && (
          <div className="absolute inset-0 z-0">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          </div>
        )}

        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="flex justify-center">
                <div className="relative group">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full max-w-sm rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full max-w-sm h-96 bg-gray-300 rounded-2xl shadow-2xl flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div className="md:col-span-2 text-white space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {movie.title}
                  </h1>

                  {/* Movie Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-lg mb-4">
                    {movie.rating && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span>{formatRating(movie.rating)}</span>
                      </div>
                    )}

                    {movie.releaseDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    )}

                    {movie.runtime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Overview</h3>
                    <p className="text-lg leading-relaxed text-gray-200">
                      {movie.overview}
                    </p>
                  </div>
                )}

                {/* Director */}
                {movie.director && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Director</h3>
                    <p className="text-lg">{movie.director}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={handleAddToFavorites}
                    disabled={isFavorite || addingToFavorites}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isFavorite
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                    <span>
                      {addingToFavorites
                        ? "Adding..."
                        : isFavorite
                        ? "In Favorites"
                        : "Add to Favorites"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movie.cast.slice(0, 12).map((actor, index) => (
                <div key={index} className="text-center group">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {actor.name}
                  </h4>
                  <p className="text-xs text-gray-600">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sentiment Analysis */}
        <SentimentAnalysis
          reviews={reviews}
          sentimentSummary={sentimentSummary}
        />

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.movieId}
                  recommendation={recommendation}
                  rank={recommendation.rank}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
