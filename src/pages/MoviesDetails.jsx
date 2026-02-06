import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, Ticket, Clock, Search, Check, CalendarDays } from 'lucide-react';
import SeatMap from '../components/SeatMap';

const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSeatMap, setShowSeatMap] = useState(false);
  
  const dropdownRef = useRef(null);
  const dateInputRef = useRef(null);

  const theaters = [
    { id: 'imax', name: 'IMAX Dolby Theatre', location: 'Downtown' },
    { id: 'starlight', name: 'Starlight Premium', location: 'Westside' },
    { id: 'grand', name: 'The Grand Cinema', location: 'East Plaza' },
  ];

  const timings = ["10:30 AM", "01:45 PM", "04:00 PM", "07:15 PM", "10:30 PM"];
  const today = new Date().toISOString().split('T')[0];

  const handleDateClick = () => {
    if (dateInputRef.current) dateInputRef.current.showPicker();
  };

  const filteredTheaters = theaters.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!movie) return <div className="h-screen bg-[#0f172a] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 relative">
      
      {/* SEAT MAP OVERLAY */}
      {showSeatMap && (
        <SeatMap 
          movieTitle={movie.title}
          theatreName={selectedTheatre?.name}
          dateTime={`${selectedDate} | ${selectedTime}`}
          onBack={() => setShowSeatMap(false)}
          onConfirm={(seats, total) => {
            console.log("Confirmed Seats:", seats, "Total Price:", total);
            alert(`Booking Confirmed!\nSeats: ${seats.join(', ')}\nTotal: $${total}`);
            setShowSeatMap(false);
          }}
        />
      )}

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Movies</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-2xl">
            <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} className="w-full h-full object-cover opacity-60" alt={movie.title} />
          </div>
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
            <p className="text-slate-400 leading-relaxed">{movie.overview}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl sticky top-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Ticket size={20} className="text-blue-400" /> Reserve Seats
            </h3>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 space-y-6">
              {/* THEATRE */}
              <div className="space-y-2" ref={dropdownRef}>
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">1. Select Theatre</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <span className={selectedTheatre ? "text-white" : "text-slate-500"}>
                      {selectedTheatre ? selectedTheatre.name : "Search Cinema..."}
                    </span>
                    <Search size={18} className="text-slate-400" />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                      <input 
                        className="w-full bg-slate-900 p-3 border-b border-slate-700 outline-none focus:bg-slate-950 transition-colors"
                        placeholder="Type to filter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="max-height-[200px] overflow-y-auto">
                        {filteredTheaters.map(t => (
                          <div key={t.id} onClick={() => { setSelectedTheatre(t); setIsDropdownOpen(false); }} className="p-3 hover:bg-blue-600 cursor-pointer transition-colors">
                            {t.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DATE */}
              {selectedTheatre && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">2. Select Date</label>
                  <div 
                    onClick={handleDateClick}
                    className="group flex items-center justify-between bg-slate-800 border border-slate-600 p-3 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <span className={selectedDate ? "text-white" : "text-slate-500"}>
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' }) : "Pick a date"}
                    </span>
                    <CalendarDays size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <input 
                      type="date"
                      ref={dateInputRef}
                      min={today}
                      className="absolute opacity-0 pointer-events-none"
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(null);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TIME */}
              {selectedDate && (
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">3. Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timings.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 text-sm rounded-md border transition-all ${
                          selectedTime === time ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              disabled={!selectedTime}
              onClick={() => setShowSeatMap(true)}
              className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedTime ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-500 opacity-50'
              }`}
            >
              <Ticket size={20} />
              {selectedTime ? `Select Seats for ${selectedTime}` : 'Complete Selection'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails;