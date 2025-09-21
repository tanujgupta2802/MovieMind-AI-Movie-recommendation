import React from "react";
import { Smile, Frown, Meh, MessageSquare } from "lucide-react";

const SentimentAnalysis = ({ reviews, sentimentSummary }) => {
  if (!sentimentSummary || sentimentSummary.total === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Sentiment Analysis
        </h3>
        <p className="text-gray-600">
          No reviews available for sentiment analysis.
        </p>
      </div>
    );
  }

  const { positive, negative, neutral, total } = sentimentSummary;
  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2" />
        Sentiment Analysis ({total} reviews)
      </h3>

      {/* Sentiment Bars */}
      <div className="space-y-4 mb-6">
        {/* Positive */}
        <div className="flex items-center space-x-3">
          <Smile className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Positive
              </span>
              <span className="text-sm text-gray-600">
                {positive} ({positivePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${positivePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Neutral */}
        <div className="flex items-center space-x-3">
          <Meh className="w-5 h-5 text-yellow-500" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Neutral</span>
              <span className="text-sm text-gray-600">
                {neutral} ({neutralPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${neutralPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center space-x-3">
          <Frown className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Negative
              </span>
              <span className="text-sm text-gray-600">
                {negative} ({negativePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${negativePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {positivePercent > negativePercent + neutralPercent
              ? "😊 Positive"
              : negativePercent > positivePercent + neutralPercent
              ? "😔 Negative"
              : "😐 Mixed"}
          </div>
          <div className="text-sm text-gray-600">
            Overall audience sentiment
          </div>
        </div>
      </div>

      {/* Sample Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Sample Reviews
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {review.sentiment === "positive" && (
                      <Smile className="w-4 h-4 text-green-500" />
                    )}
                    {review.sentiment === "neutral" && (
                      <Meh className="w-4 h-4 text-yellow-500" />
                    )}
                    {review.sentiment === "negative" && (
                      <Frown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {review.sentiment}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
