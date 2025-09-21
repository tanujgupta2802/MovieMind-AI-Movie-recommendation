import React from "react";
import { Link } from "react-router-dom";
import { Star, Calendar } from "lucide-react";

const MovieCard = ({ movie }) => {
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "N/A";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
    >
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
            <span className="text-gray-500 text-lg">No Image</span>
          </div>
        )}

        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {movie.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mt-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{releaseYear}</span>
        </div>

        {movie.overview && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-3">
            {movie.overview}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
