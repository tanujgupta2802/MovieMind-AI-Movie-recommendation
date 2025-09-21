const axios = require("axios");
const cheerio = require("cheerio");

class ScrapeService {
  async getIMDBReviews(imdbId) {
    try {
      const url = `https://www.imdb.com/title/${imdbId}/reviews`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const reviews = [];

      $(".review-container").each((index, element) => {
        if (index >= 10) return false; // Limit to 10 reviews

        const reviewText = $(element)
          .find(".text.show-more__control")
          .text()
          .trim();
        if (reviewText) {
          reviews.push({
            content: reviewText,
            id: index + 1,
          });
        }
      });

      return reviews;
    } catch (error) {
      console.error("Scraping Error:", error);
      return [];
    }
  }
}

module.exports = new ScrapeService();
