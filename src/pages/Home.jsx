import React from "react";

const movies = [
  {
    title: "Avatar: The Way of Water",
    rating: "8.5",
    poster: "https://via.placeholder.com/200x300?text=Avatar",
  },
  {
    title: "Top Gun: Maverick",
    rating: "8.3",
    poster: "https://via.placeholder.com/200x300?text=Top+Gun",
  },
  {
    title: "The Batman",
    rating: "7.9",
    poster: "https://via.placeholder.com/200x300?text=Batman",
  },
  {
    title: "Jurassic World",
    rating: "7.4",
    poster: "https://via.placeholder.com/200x300?text=Jurassic+World",
  },
  {
    title: "Doctor Strange",
    rating: "8.1",
    poster: "https://via.placeholder.com/200x300?text=Doctor+Strange",
  },
  {
    title: "Black Panther",
    rating: "7.8",
    poster: "https://via.placeholder.com/200x300?text=Black+Panther",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-4xl font-bold mb-6 text-center">Now Showing</h2>

        {/* Movie Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                <p className="text-gray-600 mb-4">Rating: {movie.rating}</p>
                <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
