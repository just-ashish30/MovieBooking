import React from 'react'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <Link to={`/movies/${movie.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300 shadow-lg cursor-pointer h-full flex flex-col">
        {/* Movie Poster */}
        <div className="relative overflow-hidden bg-gray-700 h-64">
          <img
            src={imageBaseUrl + movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover hover:opacity-80 transition duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
            }}
          />
          <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </div>
        </div>

        {/* Movie Details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-blue-400">
            {movie.title || movie.original_title}
          </h3>

          {/* Release Date */}
          <p className="text-sm text-gray-400 mb-2">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
          </p>

          {/* Overview */}
          <p className="text-sm text-gray-300 line-clamp-3 mb-4 flex-grow">
            {movie.overview}
          </p>

          {/* CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 w-full">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
