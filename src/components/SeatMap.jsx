import React, { useState } from 'react';
import { ChevronLeft, Armchair } from 'lucide-react';

const SeatMap = ({ movieTitle, theatreName, dateTime, onBack, onConfirm }) => {
  // 1. Expanded Layout Definition
  const sections = [
    { label: 'PREMIUM SOFA - NPR 450.00', rows: ['H', 'G'], price: 450, isSofa: true },
    { label: 'EXECUTIVE - NPR 275.00', rows: ['F', 'E', 'D', 'C', 'B', 'A'], price: 275, isSofa: false },
  ];

  // 18 columns total for a wide-screen feel
  const cols = Array.from({ length: 18 }, (_, i) => i + 1);

  // Expanded Mock statuses for a realistic look
  const soldOut = ['H8', 'H9', 'G1', 'G2', 'E10', 'E11', 'A1', 'A18', 'B9', 'B10'];
  const reserved = ['F5', 'F6', 'C1', 'C2'];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (id) => {
    if (soldOut.includes(id) || reserved.includes(id)) return;
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getSeatColor = (id) => {
    if (soldOut.includes(id)) return 'text-red-500 opacity-100'; // Sold Out
    if (reserved.includes(id)) return 'text-cyan-600 opacity-100'; // Reserved
    if (selectedSeats.includes(id)) return 'text-yellow-400 opacity-100 scale-125'; // Selected
    return 'text-teal-400 opacity-80 hover:opacity-100 hover:text-white'; // Available
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#111111] text-slate-300 flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-[#1a1a1a]">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-white font-bold uppercase tracking-widest text-sm md:text-base">{movieTitle}</h2>
          <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tighter">{theatreName} | {dateTime}</p>
        </div>
        <div className="w-10" />
      </header>

      {/* SEAT GRID AREA */}
      <div className="flex-1 overflow-auto p-4 md:p-12 flex flex-col items-center bg-[#111111] custom-scrollbar">
        
        {/* CINEMA SCREEN REPRESENTATION */}
        <div className="w-full max-w-3xl mb-20">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_15px_40px_rgba(6,182,212,0.5)]"></div>
          <p className="text-center text-[9px] uppercase tracking-[0.8em] text-slate-600 mt-6">All eyes this way</p>
        </div>

        {/* MAPPING SECTIONS */}
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="w-full flex flex-col items-center mb-10">
            <div className="w-full max-w-4xl border-b border-white/5 mb-8 pb-1 text-center">
               <span className="text-[9px] font-black text-slate-500 tracking-[0.2em]">{section.label}</span>
            </div>

            <div className="space-y-4">
              {section.rows.map(rowLabel => (
                <div key={rowLabel} className="flex items-center gap-4 md:gap-8">
                  <span className="w-4 text-[10px] font-black text-slate-700">{rowLabel}</span>
                  
                  <div className="flex gap-2 md:gap-3">
                    {cols.map(col => {
                      const id = `${rowLabel}${col}`;
                      // AISLE LOGIC: Add extra space after seat 4 and seat 14 for a 3-column block look
                      const isAisle = col === 4 || col === 14;

                      return (
                        <React.Fragment key={id}>
                          <button 
                            onClick={() => toggleSeat(id)} 
                            className={`transition-all duration-300 transform active:scale-75 ${getSeatColor(id)}`}
                          >
                            <Armchair size={section.isSofa ? 22 : 18} strokeWidth={2.5} />
                          </button>
                          {isAisle && <div className="w-4 md:w-8" />} 
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="w-4 text-[10px] font-black text-slate-700">{rowLabel}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-12 py-8 w-full max-w-4xl border-t border-white/5">
          <LegendItem iconColor="text-teal-400" label="Available" />
          <LegendItem iconColor="text-cyan-600" label="Reserved" />
          <LegendItem iconColor="text-red-500" label="Sold Out" />
          <LegendItem iconColor="text-yellow-400" label="Selected" />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="p-6 bg-[#1a1a1a] border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Payable</p>
            <p className="text-2xl font-black text-white">NPR {selectedSeats.length > 0 ? selectedSeats.length * 275 : '0.00'}</p>
          </div>
          
          <button
            disabled={selectedSeats.length === 0}
            onClick={() => onConfirm(selectedSeats)}
            className={`w-full md:w-64 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
              selectedSeats.length > 0 
              ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.3)]' 
              : 'bg-[#2a2a2a] text-slate-600 cursor-not-allowed'
            }`}
          >
            Confirm {selectedSeats.length} Seats
          </button>
        </div>
      </footer>
    </div>
  );
};

const LegendItem = ({ iconColor, label }) => (
  <div className="flex items-center gap-3">
    <Armchair size={20} className={iconColor} strokeWidth={2.5} />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

export default SeatMap;