import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 1. Added Navigation
import axios from "axios";
import { 
  ChevronLeft, ChevronRight, Star, Ticket, Info, 
  Flame, Award, Calendar 
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate(); // 2. Initialize Navigate
  const [trendingMovies, setTrendingMovies] = useState([]); 
  const [row1, setRow1] = useState([]); 
  const [row2, setRow2] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  const API_KEY = "80d491707d8cf7b38aa19c7ccab0952f";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
  const POSTER_PATH = "https://image.tmdb.org/t/p/w342";

  // --- NAVIGATION HANDLERS ---
  // This sends the user to the details page and passes the movie data
  const handleViewDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  // This sends them to the details page but skips straight to the booking UI
  const handleQuickBook = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie, autoScrollToBooking: true } });
  };

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const [popRes, topRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/popular`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/movie/top_rated`, { params: { api_key: API_KEY } })
        ]);
        setTrendingMovies(popRes.data.results.slice(0, 5));
        setRow1(popRes.data.results);
        setRow2(topRes.data.results);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    getMovieData();
  }, []);

  // --- AUTO-PLAY LOGIC ---
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    const autoPlay = setInterval(() => {
      setCurrentSlide((prev) => (prev === trendingMovies.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(autoPlay);
  }, [trendingMovies]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === trendingMovies.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? trendingMovies.length - 1 : prev - 1));

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // --- UPDATED MOVIE CARD ---
  const MovieCard = ({ movie }) => (
    <div 
      onClick={() => handleViewDetails(movie)}
      className="min-w-[160px] md:min-w-[200px] bg-white rounded-2xl shadow-md snap-start overflow-hidden group border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img src={`${POSTER_PATH}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={10} fill="currentColor" /> {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-xs text-gray-800 truncate mb-2">{movie.title}</h3>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click from firing
            handleQuickBook(movie);
          }}
          className="w-full py-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-bold transition-colors uppercase tracking-wider"
        >
          Quick Book
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-black group">
        {trendingMovies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
              index === currentSlide ? "scale-100" : "scale-125"
            }`}>
                <img src={`${IMG_PATH}${movie.backdrop_path}`} className="w-full h-full object-cover opacity-60" alt="" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center">
              <div className="max-w-[85%] mx-auto w-full text-white">
                 <div className={`transition-all duration-1000 delay-300 transform ${
                   index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                 }`}>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="bg-red-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-red-600/30">
                        Trending Now
                      </span>
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-md text-xs font-bold text-yellow-400">
                        <Star size={14} fill="currentColor" /> {movie.vote_average.toFixed(1)}
                      </div>
                      <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 capitalize">
                        <Calendar size={14} /> {movie.release_date?.split("-")[0]}
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl leading-[1]">
                      {movie.title}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-xl mb-8 line-clamp-3 leading-relaxed font-medium italic">
                      {movie.overview}
                    </p>

                    <div className="flex flex-wrap gap-4">
                       <button 
                        onClick={() => handleQuickBook(movie)}
                        className="bg-red-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 transition transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/20 text-sm uppercase"
                       >
                         <Ticket size={20}/> Book Tickets
                       </button>
                       <button 
                        onClick={() => handleViewDetails(movie)}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white hover:text-black transition transform hover:scale-105 active:scale-95 shadow-xl text-sm uppercase"
                       >
                         <Info size={20}/> View Details
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1.5 bg-red-600 z-50 transition-all duration-300"
             style={{ width: `${((currentSlide + 1) / trendingMovies.length) * 100}%` }} />

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-red-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10">
          <ChevronLeft size={28}/>
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-red-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10">
          <ChevronRight size={28}/>
        </button>
      </div>

      {/* --- SLIDERS --- */}
      <div className="max-w-[85%] mx-auto -mt-16 relative z-20 space-y-16">
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900 uppercase tracking-tight">
                <Flame className="text-red-600" fill="currentColor" /> Trending Now
              </h2>
              <div className="h-1 w-12 bg-red-600 mt-1 rounded-full"></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll(scrollRef1, "left")} className="p-2.5 bg-white shadow-lg rounded-xl hover:bg-red-600 hover:text-white transition active:scale-90"><ChevronLeft size={20}/></button>
              <button onClick={() => scroll(scrollRef1, "right")} className="p-2.5 bg-white shadow-lg rounded-xl hover:bg-red-600 hover:text-white transition active:scale-90"><ChevronRight size={20}/></button>
            </div>
          </div>
          <div ref={scrollRef1} className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x pb-4" style={{ scrollbarWidth: 'none' }}>
            {row1.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900 uppercase tracking-tight">
                <Award className="text-yellow-500" fill="currentColor" /> Top Rated
              </h2>
              <div className="h-1 w-12 bg-yellow-500 mt-1 rounded-full"></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll(scrollRef2, "left")} className="p-2.5 bg-white shadow-lg rounded-xl hover:bg-red-600 hover:text-white transition active:scale-90"><ChevronLeft size={20}/></button>
              <button onClick={() => scroll(scrollRef2, "right")} className="p-2.5 bg-white shadow-lg rounded-xl hover:bg-red-600 hover:text-white transition active:scale-90"><ChevronRight size={20}/></button>
            </div>
          </div>
          <div ref={scrollRef2} className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x pb-4" style={{ scrollbarWidth: 'none' }}>
            {row2.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;