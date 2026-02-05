import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Info } from 'lucide-react';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  const handleNavigation = () => {
    // This sends the movie data in 'state' so MoviesDetails can read it instantly
    navigate(`/movies/${movie.id}`, { state: { movie } });
  };

  return (
    <div 
      onClick={handleNavigation}
      className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition duration-300 shadow-lg cursor-pointer h-full flex flex-col border border-gray-700 hover:border-blue-500 group"
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden bg-gray-700 h-80">
        <img
          src={movie.poster_path ? imageBaseUrl + movie.poster_path : "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:opacity-60 transition duration-300"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-yellow-400 px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 border border-yellow-500/20">
          <Star size={14} fill="currentColor" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {movie.title || movie.original_title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
           <span className="text-xs font-medium px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
             {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
           </span>
        </div>

        <p className="text-sm text-gray-400 line-clamp-3 mb-5 flex-grow italic">
          {movie.overview}
        </p>

        {/* CTA Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents the parent div click from firing twice
            handleNavigation();
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold transition duration-300 w-full flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-blue-900/20"
        >
          <Info size={16} />
          View Details
        </button>
      </div>
    </div>
  );
}