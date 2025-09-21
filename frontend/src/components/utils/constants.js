// src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Application Constants
export const APP_CONFIG = {
  NAME: "MovieMind",
  VERSION: "1.0.0",
  DESCRIPTION: "AI-powered movie recommendations with sentiment analysis",
  TAGLINE: "Discover your next favorite movie",
};

// Movie Genres
export const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];

// Movie Rating Ranges
export const RATING_RANGES = [
  { label: "All Ratings", min: 0, max: 10 },
  { label: "9+ Excellent", min: 9, max: 10 },
  { label: "8+ Great", min: 8, max: 10 },
  { label: "7+ Good", min: 7, max: 10 },
  { label: "6+ Average", min: 6, max: 10 },
  { label: "Below 6", min: 0, max: 6 },
];

// Release Year Ranges
export const YEAR_RANGES = [
  { label: "All Years", value: "all" },
  { label: "2020s", value: "2020-2029" },
  { label: "2010s", value: "2010-2019" },
  { label: "2000s", value: "2000-2009" },
  { label: "1990s", value: "1990-1999" },
  { label: "1980s", value: "1980-1989" },
  { label: "Before 1980", value: "1900-1979" },
];

// Sentiment Analysis
export const SENTIMENT_CONFIG = {
  POSITIVE_THRESHOLD: 0.6,
  NEGATIVE_THRESHOLD: 0.4,
  COLORS: {
    positive: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      accent: "bg-green-500",
    },
    negative: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      accent: "bg-red-500",
    },
    neutral: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      accent: "bg-yellow-500",
    },
  },
};

// Recommendation Algorithm Constants
export const RECOMMENDATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 20,
  SIMILARITY_WEIGHTS: {
    GENRE: 0.4,
    CAST: 0.35,
    DIRECTOR: 0.25,
  },
  MIN_SCORE_THRESHOLD: 0.1,
};

// UI Constants
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 20,
  GRID_BREAKPOINTS: {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  NOT_FOUND: "The requested content was not found.",
  UNAUTHORIZED: "You need to be logged in to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Successfully logged in!",
  REGISTER: "Account created successfully!",
  LOGOUT: "Successfully logged out!",
  FAVORITE_ADDED: "Movie added to favorites!",
  FAVORITE_REMOVED: "Movie removed from favorites!",
  PROFILE_UPDATED: "Profile updated successfully!",
};

// Form Validation
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SEARCH_MIN_LENGTH: 1,
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 1000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "moviemind_token",
  RECENT_SEARCHES: "moviemind_recent_searches",
  USER_PREFERENCES: "moviemind_preferences",
  THEME: "moviemind_theme",
};

// External Links
export const EXTERNAL_LINKS = {
  TMDB: "https://www.themoviedb.org",
  IMDB: "https://www.imdb.com",
  GITHUB: "https://github.com",
  SUPPORT: "mailto:support@moviemind.com",
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_SENTIMENT_ANALYSIS: true,
  ENABLE_USER_REVIEWS: true,
  ENABLE_SOCIAL_SHARING: false,
  ENABLE_DARK_MODE: false,
};

// Image Configurations
export const IMAGE_CONFIG = {
  POSTER_SIZES: {
    small: "w185",
    medium: "w342",
    large: "w500",
    xlarge: "w780",
  },
  BACKDROP_SIZES: {
    small: "w300",
    medium: "w780",
    large: "w1280",
  },
  PROFILE_SIZES: {
    small: "w45",
    medium: "w185",
    large: "h632",
  },
  FALLBACK_POSTER: "/images/no-poster.jpg",
  FALLBACK_BACKDROP: "/images/no-backdrop.jpg",
  FALLBACK_PROFILE: "/images/no-profile.jpg",
};

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  MOVIE_DETAIL: "/movie/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  FAVORITES: "/favorites",
  PROFILE: "/profile",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      900: "#1e3a8a",
    },
    secondary: {
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
    },
  },
  GRADIENTS: {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600",
    secondary: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    accent: "bg-gradient-to-r from-purple-600 to-pink-600",
  },
};

// Export commonly used functions
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatRating = (rating) => {
  if (!rating) return "N/A";
  return Math.round(rating * 10) / 10;
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default {
  API_CONFIG,
  APP_CONFIG,
  MOVIE_GENRES,
  RATING_RANGES,
  YEAR_RANGES,
  SENTIMENT_CONFIG,
  RECOMMENDATION_CONFIG,
  UI_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_CONFIG,
  STORAGE_KEYS,
  EXTERNAL_LINKS,
  FEATURE_FLAGS,
  IMAGE_CONFIG,
  ROUTES,
  HTTP_STATUS,
  THEME_CONFIG,
  formatDate,
  formatRating,
  formatRuntime,
  truncateText,
  capitalizeFirstLetter,
};
