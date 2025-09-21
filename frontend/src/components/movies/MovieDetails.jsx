import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Calendar, Clock, Heart, ArrowLeft, Users } from "lucide-react";
import { moviesAPI, recommendationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SentimentAnalysis from "../components/recommendations/SentimentAnalysis";
import RecommendationCard from "../components/recommendations/RecommendationCard";

const MovieDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentimentSummary, setSentimentSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        // Fetch movie details
        const movieResponse = await moviesAPI.getDetails(id);
        setMovie(movieResponse.data.movie);

        // Fetch reviews and sentiment analysis
        const reviewsResponse = await moviesAPI.getReviews(id);
        setReviews(reviewsResponse.data.reviews);
        setSentimentSummary(reviewsResponse.data.sentimentSummary);

        // Fetch recommendations
        const recommendationsResponse =
          await recommendationsAPI.getMovieRecommendations({
            movieId: id,
            limit: 6,
          });
        setRecommendations(recommendationsResponse.data.recommendations);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      alert("Please login to add movies to favorites");
      return;
    }

    try {
      await moviesAPI.addToFavorites(id);
      setIsFavorite(true);
      alert("Movie added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to add to favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-300 h-96 rounded-xl"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-300 h-8 w-3/4"></div>
                <div className="bg-gray-300 h-4 w-full"></div>
                <div className="bg-gray-300 h-4 w-2/3"></div>
              </div>
            </div>
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
          <Link to="/" className="text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/search"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </Link>
      </div>

      {/* Movie Header */}
      <div className="relative">
        {/* Backdrop */}
        {movie.backdrop && (
          <div className="absolute inset-0 z-0">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        )}

        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="flex justify-center">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full max-w-sm rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full max-w-sm h-96 bg-gray-300 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Movie Info */}
              <div className="md:col-span-2 text-white space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {movie.title}
                  </h1>

                  {/* Movie Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-lg">
                    {movie.rating && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span>{movie.rating.toFixed(1)}</span>
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
                        <span>{movie.runtime} min</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
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

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={handleAddToFavorites}
                    disabled={isFavorite}
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
                      {isFavorite ? "Added to Favorites" : "Add to Favorites"}
                    </span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.slice(0, 12).map((actor, index) => (
                <div key={index} className="text-center">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <h4 className="font-medium text-sm text-gray-900">
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
