import React from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp } from "lucide-react";

const RecommendationCard = ({ recommendation, rank }) => {
  const { movie, score } = recommendation;

  return (
    <Link
      to={`/movie/${movie.tmdbId}`}
      className="group bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300 relative"
    >
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
        {rank}
      </div>

      {/* Score Badge */}
      {score && (
        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">
            {(score * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Movie Poster */}
      <div className="relative overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>

        {movie.rating && (
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecommendationCard;
