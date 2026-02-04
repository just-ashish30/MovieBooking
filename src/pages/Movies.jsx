import React, { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import { useFirestore } from "../hooks/useFirestore";

export default function Movies() {
  const { data: movies, loading, error } = useFirestore("movies");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Get all unique genres from movies
  const genres = useMemo(() => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        movie.genre_ids.forEach((id) => genreSet.add(id));
      }
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // Filter movies based on search term and genre
  const filteredMovies = useMemo(() => {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and book your favorite movies
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Search Movies
              </label>
              <input
                type="text"
                placeholder="Search by title or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Filter by Genre ID
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    Genre {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-300 text-sm">
            Showing {filteredMovies.length} of {movies.length} movies
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
            <span className="ml-4 text-white text-lg">Loading movies...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Error loading movies</p>
            <p>{error}</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">
              {searchTerm || selectedGenre
                ? "No movies found matching your filters."
                : "No movies available."}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && filteredMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
