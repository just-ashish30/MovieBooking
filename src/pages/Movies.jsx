import React, { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard"; // Ensure this component uses navigate('/movies/:id')
import { useFirestore } from "../hooks/useFirestore";

export default function Movies() {
  const { data: movies, loading, error } = useFirestore("movies");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Get all unique genres from movies
  const genres = useMemo(() => {
    if (!movies) return [];
    const genreSet = new Set();
    movies.forEach((movie) => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach((id) => genreSet.add(id));
      }
    });
    return Array.from(genreSet).sort((a, b) => a - b);
  }, [movies]);

  // Filter movies based on search term and genre
  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.original_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.overview?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        !selectedGenre || (movie.genre_ids && movie.genre_ids.includes(Number(selectedGenre)));

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, selectedGenre]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tighter">
            Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and book your favorite movies
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
                Search Database
              </label>
              <input
                type="text"
                placeholder="Search by title, overview..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
                Filter by Category
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    Genre ID: {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count Bar */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-gray-400 text-xs font-medium">
            <span>SHOWING {filteredMovies.length} MOVIES</span>
            <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Total: {movies?.length || 0}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 font-medium animate-pulse">Fetching Movie Database...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-4">
            <p className="font-bold flex items-center gap-2">⚠️ Error loading movies</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredMovies.length === 0 && (
          <div className="text-center py-24 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">
            <p className="text-gray-500 text-xl font-medium">
              {searchTerm || selectedGenre
                ? "We couldn't find any matches for your filters."
                : "The movie database appears to be empty."}
            </p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedGenre("");}}
              className="mt-4 text-blue-400 hover:underline text-sm font-bold uppercase"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && filteredMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}