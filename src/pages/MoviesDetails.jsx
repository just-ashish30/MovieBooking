import React, { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, Ticket, Clock } from 'lucide-react';

const MovieDetails = ({ movie }) => {
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  // Mock timings
  const timings = ["10:30 AM", "01:45 PM", "04:00 PM", "07:15 PM", "10:30 PM"];

  const handleTheatreChange = (e) => {
    setSelectedTheatre(e.target.value);
    setSelectedTime(null); // Reset time if theatre changes
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto mb-8">
        <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Movies</span>
        </button>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-2xl">
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
               <span className="text-slate-500 italic">Trailer Player Placeholder</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">Interstellar</h1>
            <p className="text-slate-400 leading-relaxed">
              A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" />
              Book Tickets
            </h3>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 space-y-6">
              {/* Theatre Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Select Theatre</label>
                <div className="relative">
                  <select 
                    value={selectedTheatre}
                    onChange={handleTheatreChange}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
                  >
                    <option value="">Choose Cinema...</option>
                    <option value="imax">IMAX Dolby Theatre</option>
                    <option value="starlight">Starlight Premium</option>
                    <option value="grand">The Grand Cinema</option>
                  </select>
                  <MapPin size={16} className="absolute right-3 top-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Conditional Timing Section */}
              {selectedTheatre && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Available Timings</label>
                    <Clock size={14} className="text-blue-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {timings.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 text-sm font-medium rounded-md border transition-all ${
                          selectedTime === time
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main CTA */}
            <button 
              disabled={!selectedTime}
              className={`w-full mt-6 flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all shadow-lg ${
                selectedTime 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 cursor-pointer' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Ticket size={22} />
              {selectedTime ? `Buy Ticket for ${selectedTime}` : 'Select Time to Book'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails;