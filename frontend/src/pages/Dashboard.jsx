// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  Clock,
  Search,
  Star,
  Film,
  BarChart3,
  User,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { recommendationsAPI, moviesAPI } from "../services/api";
import MovieGrid from "../components/movies/MovieGrid";
import RecommendationCard from "../components/recommendations/RecommendationCard";
import Loading from "../components/common/Loading";
import { formatDate } from "../utils/constants.js";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalSearches: 0,
    joinedDate: null,
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get user recommendations
        const recommendationsResponse =
          await recommendationsAPI.getUserRecommendations();
        setUserRecommendations(
          recommendationsResponse.data.recommendations || []
        );

        // Set user data
        setFavoriteMovies(user.favoriteMovies || []);

        // Load recent searches from localStorage
        const savedSearches = localStorage.getItem("moviemind_recent_searches");
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }

        // Set user stats
        setStats({
          totalFavorites: user.favoriteMovies?.length || 0,
          totalSearches: user.searchHistory?.length || 0,
          joinedDate: user.createdAt,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading || loading) {
    return <Loading fullScreen text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600">
            Discover your next favorite movie with personalized recommendations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Favorites Count */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Favorite Movies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalFavorites}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Recommendations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRecommendations.length}
                </p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Member Since
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.joinedDate ? formatDate(stats.joinedDate) : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personalized Recommendations */}
            {userRecommendations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                    Recommended For You
                  </h2>
                  <Link
                    to="/search"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Explore More
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRecommendations
                    .slice(0, 6)
                    .map((recommendation, index) => (
                      <RecommendationCard
                        key={recommendation.id || index}
                        recommendation={{
                          movie: recommendation,
                          score: 0.9 - index * 0.1, // Mock similarity score
                        }}
                        rank={index + 1}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* No Recommendations State */}
            {userRecommendations.length === 0 && (
              <section className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100 text-center">
                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some movies to your favorites to get personalized
                  recommendations!
                </p>
                <Link
                  to="/search"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Discover Movies
                </Link>
              </section>
            )}

            {/* Favorite Movies */}
            {favoriteMovies.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-600" />
                    Your Favorites
                  </h2>
                  <Link
                    to="/favorites"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    View All ({favoriteMovies.length})
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {favoriteMovies.slice(0, 8).map((movie, index) => (
                    <Link
                      key={movie.movieId || index}
                      to={`/movie/${movie.movieId}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Film className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {movie.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Added {formatDate(movie.addedAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/search"
                  className="flex items-center w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">
                    Search Movies
                  </span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-700 font-medium">My Favorites</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">
                    Edit Profile
                  </span>
                </Link>
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(search)}`}
                      className="block p-2 hover:bg-gray-50 rounded text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {search}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Your Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Favorite Movies</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalFavorites}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recent Searches</span>
                  <span className="font-semibold text-gray-900">
                    {recentSearches.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recommendations</span>
                  <span className="font-semibold text-gray-900">
                    {userRecommendations.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💡 Pro Tip
              </h3>
              <p className="text-sm text-gray-600">
                Add more movies to your favorites to get better personalized
                recommendations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
