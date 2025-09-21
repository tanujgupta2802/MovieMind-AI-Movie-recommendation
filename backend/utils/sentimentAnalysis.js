class SentimentAnalysis {
  constructor() {
    // Simple sentiment word lists (in production, use a proper NLP library)
    this.positiveWords = [
      "amazing",
      "excellent",
      "fantastic",
      "great",
      "love",
      "perfect",
      "brilliant",
      "outstanding",
      "wonderful",
      "impressive",
      "superb",
      "magnificent",
      "awesome",
      "incredible",
      "spectacular",
      "marvelous",
      "terrific",
      "fabulous",
    ];

    this.negativeWords = [
      "terrible",
      "awful",
      "horrible",
      "bad",
      "hate",
      "worst",
      "disappointing",
      "boring",
      "waste",
      "stupid",
      "ridiculous",
      "pathetic",
      "annoying",
      "frustrating",
      "useless",
      "garbage",
      "trash",
      "disaster",
    ];
  }

  analyzeSentiment(text) {
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      if (this.positiveWords.includes(cleanWord)) {
        positiveScore++;
      } else if (this.negativeWords.includes(cleanWord)) {
        negativeScore++;
      }
    });

    const totalScore = positiveScore + negativeScore;
    if (totalScore === 0) {
      return { sentiment: "neutral", score: 0.5 };
    }

    const sentimentScore = positiveScore / totalScore;
    let sentiment;

    if (sentimentScore > 0.6) {
      sentiment = "positive";
    } else if (sentimentScore < 0.4) {
      sentiment = "negative";
    } else {
      sentiment = "neutral";
    }

    return { sentiment, score: sentimentScore };
  }

  analyzeReviews(reviews) {
    return reviews.map((review) => {
      const analysis = this.analyzeSentiment(review.content);
      return {
        ...review,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.score,
      };
    });
  }
}

module.exports = new SentimentAnalysis();
