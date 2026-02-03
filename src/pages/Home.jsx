import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios
import { ChevronLeft, ChevronRight, Star, MapPin, Ticket } from "lucide-react";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const API_KEY = "80d491707d8cf7b38aa19c7ccab0952f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
  const POSTER_PATH = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const getMovieData = async () => {
      try {
        // Axios handles the JSON conversion automatically
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
            sort_by: "popularity.desc",
          },
        });

        const results = response.data.results;
        setMovies(results);
        setTrending(results.slice(0, 3));
      } catch (error) {
        console.error("Axios Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getMovieData();
  }, []);

  // Carousel Logic (Same as before)
  useEffect(() => {
    if (trending.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === trending.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [trending]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-red-600 font-bold animate-pulse">Loading CineBook...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Carousel */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {trending.map((movie, index) => (
          <div key={movie.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
            <img src={`${IMG_PATH}${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 to-transparent flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-white text-5xl md:text-7xl font-black mb-4">Welcome to <span className="text-red-600">CineBook</span></h1>
              <div className="flex gap-4 mt-4">
                <button className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-xl"><Ticket size={20} /> Book Now</button>
                <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition shadow-xl"><MapPin size={20} /> See Location</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Slider */}
      <div className="max-w-screen-2xl mx-auto mt-16 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 border-l-8 border-red-600 pl-4 uppercase">Discover Movies</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll("left")} className="p-2 bg-white shadow-md rounded-full hover:bg-red-600 hover:text-white transition"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll("right")} className="p-2 bg-white shadow-md rounded-full hover:bg-red-600 hover:text-white transition"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8" style={{ scrollbarWidth: 'none' }}>
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[280px] md:min-w-[340px] bg-white rounded-[2rem] shadow-lg snap-start overflow-hidden hover:shadow-2xl transition-all group">
              <div className="relative h-[450px] overflow-hidden">
                <img src={`${POSTER_PATH}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-yellow-400 text-sm font-bold px-4 py-2 rounded-2xl flex items-center gap-2"><Star size={16} fill="currentColor" /> {movie.vote_average.toFixed(1)}</div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-black text-xl text-gray-800 mb-4 truncate">{movie.title}</h3>
                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition shadow-lg">Quick Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;