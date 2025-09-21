const axios = require("axios");

class TMDBService {
  constructor() {
    this.baseURL = "https://api.themoviedb.org/3";
    this.apiKey = process.env.TMDB_API_KEY;
    this.imageBaseURL = "https://image.tmdb.org/t/p/w500";
  }

  async searchMovies(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query: query,
          language: "en-US",
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("TMDB Search Error:", error);
      throw new Error("Failed to search movies");
    }
  }

  async getMovieDetails(movieId) {
    try {
      const [movieResponse, creditsResponse] = await Promise.all([
        axios.get(`${this.baseURL}/movie/${movieId}`, {
          params: { api_key: this.apiKey },
        }),
        axios.get(`${this.baseURL}/movie/${movieId}/credits`, {
          params: { api_key: this.apiKey },
        }),
      ]);

      const movie = movieResponse.data;
      const credits = creditsResponse.data;

      return {
        ...movie,
        cast: credits.cast.slice(0, 10),
        director: credits.crew.find((person) => person.job === "Director")
          ?.name,
      };
    } catch (error) {
      console.error("TMDB Movie Details Error:", error);
      throw new Error("Failed to get movie details");
    }
  }

  async getSimilarMovies(movieId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/movie/${movieId}/similar`,
        {
          params: {
            api_key: this.apiKey,
            language: "en-US",
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("TMDB Similar Movies Error:", error);
      return [];
    }
  }

  async getPopularMovies() {
    try {
      const response = await axios.get(`${this.baseURL}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          language: "en-US",
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("TMDB Popular Movies Error:", error);
      return [];
    }
  }
}

module.exports = new TMDBService();
