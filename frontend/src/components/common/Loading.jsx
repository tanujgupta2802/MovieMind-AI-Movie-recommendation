// src/components/common/Loading.jsx
import React from "react";
import { Film, Loader } from "lucide-react";

const Loading = ({
  size = "default",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-blue-100 rounded-full animate-spin border-t-blue-600 mx-auto mb-4`}
          ></div>

          {/* MovieMind icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
      </div>
    </div>
  );
};

// Skeleton Loading Component for grids
export const SkeletonCard = () => (
  <div className="animate-pulse bg-white/80 rounded-xl shadow-lg overflow-hidden">
    <div className="bg-gray-300 h-72"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
      <div className="bg-gray-300 h-3 rounded w-1/2"></div>
      <div className="bg-gray-300 h-3 rounded w-full"></div>
    </div>
  </div>
);

// Grid Skeleton
export const SkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {[...Array(count)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

// Inline Loading Spinner
export const Spinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <Loader className={`${sizeClasses[size]} animate-spin ${className}`} />
  );
};

export default Loading;
