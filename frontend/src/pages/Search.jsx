import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter } from "lucide-react";
import { moviesAPI, recommendationsAPI } from "../services/api";
import MovieGrid from "../components/movies/MovieGrid";
import RecommendationCard from "../components/recommendations/RecommendationCard";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Search movies
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await moviesAPI.search(query);
      setSearchResults(response.data.results);
      setSearchParams({ q: query });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Get recommendations for a movie
  const handleGetRecommendations = async (movieId, movieTitle) => {
    setRecommendationsLoading(true);
    setSelectedMovie(movieTitle);
    try {
      const response = await recommendationsAPI.getMovieRecommendations({
        movieId: movieId.toString(),
        limit: 8,
      });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Recommendations error:", error);
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Search on page load if query exists
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Movie
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for movies and get AI-powered recommendations based on your
            selection
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for movies (e.g., 'Avengers', 'Inception')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <div key={movie.id} className="relative group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                    {/* Movie Poster */}
                    <div className="relative overflow-hidden">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}

                      {/* Get Recommendations Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() =>
                            handleGetRecommendations(movie.id, movie.title)
                          }
                          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                          Get Similar Movies
                        </button>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {movie.title}
                      </h3>

                      {movie.rating && (
                        <div className="flex items-center text-gray-600 text-sm mt-2">
                          <span>★ {movie.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {selectedMovie && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Movies Similar to "{selectedMovie}"
            </h2>

            {recommendationsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 rounded-xl h-64 mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.movieId}
                    recommendation={recommendation}
                    rank={recommendation.rank}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No recommendations found for this movie.
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && <MovieGrid loading={true} />}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No movies found for "{searchQuery}"
            </div>
            <p className="text-gray-400">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
