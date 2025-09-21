// src/components/movies/SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { moviesAPI } from "../../services/api";

const SearchBar = ({
  onSearch,
  placeholder = "Search movies...",
  showSuggestions = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("moviemind_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!showSuggestions || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await moviesAPI.search(query);
        setSuggestions(response.data.results.slice(0, 5)); // Top 5 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, showSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const performSearch = (searchQuery) => {
    onSearch(searchQuery);

    // Add to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter((item) => item !== searchQuery),
    ].slice(0, 10); // Keep only last 10

    setRecentSearches(newRecentSearches);
    localStorage.setItem(
      "moviemind_recent_searches",
      JSON.stringify(newRecentSearches)
    );

    // Clear and close
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (movie) => {
    performSearch(movie.title);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("moviemind_recent_searches");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-lg"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl mt-2 max-h-96 overflow-y-auto"
        >
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}

          {/* Movie Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Suggestions
                </h4>
              </div>
              {suggestions.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie)}
                  className="w-full flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                >
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-200 rounded mr-3 flex-shrink-0 flex items-center justify-center">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">
                      {movie.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).getFullYear()
                        : "N/A"}
                      {movie.rating && ` • ★ ${movie.rating.toFixed(1)}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Recent Searches
                </h4>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => performSearch(search)}
                  className="w-full flex items-center px-4 py-2 hover:bg-blue-50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No movies found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && query.length < 2 && recentSearches.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Start typing to search movies</p>
              <p className="text-sm mt-1">Try "Avengers", "Inception", etc.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
