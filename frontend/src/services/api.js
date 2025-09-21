import axios from "axios";

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
};

// Movies API
export const moviesAPI = {
  search: (query) => api.get(`/movies/search/${query}`),
  getDetails: (id) => api.get(`/movies/${id}`),
  getReviews: (id) => api.get(`/movies/${id}/reviews`),
  addToFavorites: (id) => api.post(`/movies/${id}/favorite`),
  getPopular: () => api.get("/movies/popular"),
};

// Recommendations API
export const recommendationsAPI = {
  getMovieRecommendations: (data) => api.post("/recommendations/movie", data),
  getUserRecommendations: () => api.get("/recommendations/user"),
};

export default api;
