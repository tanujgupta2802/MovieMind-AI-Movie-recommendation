import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, Brain, Heart } from "lucide-react";
import { moviesAPI } from "../services/api";
import MovieGrid from "../components/movies/MovieGrid";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await moviesAPI.getPopular();
        setPopularMovies(response.data.results.slice(0, 10)); // Show top 10
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Your Next
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Favorite Movie
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            AI-powered movie recommendations with intelligent sentiment
            analysis. Find movies you'll love based on what you already enjoy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Start Exploring</span>
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose MovieMind?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Recommendations
              </h3>
              <p className="text-gray-600">
                Our intelligent algorithm analyzes movie content, cast, and
                genres to suggest perfect matches for your taste.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sentiment Analysis
              </h3>
              <p className="text-gray-600">
                Get insights into what audiences really think with our advanced
                sentiment analysis of movie reviews.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Personal Favorites
              </h3>
              <p className="text-gray-600">
                Build your personal movie collection and get even better
                recommendations based on your favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieGrid
            movies={popularMovies}
            title="Trending Now"
            loading={loading}
          />

          <div className="text-center mt-12">
            <Link
              to="/search"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Explore More Movies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
