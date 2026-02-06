import React, { useState } from 'react';
import { ChevronLeft, Armchair, ZoomIn } from 'lucide-react';

const SeatMap = ({ movieTitle, theatreName, dateTime, onBack, onConfirm }) => {
  const sections = [
    { label: 'PREMIUM SOFA - NPR 450.00', rows: ['H', 'G'], price: 450, isSofa: true },
    { label: 'EXECUTIVE - NPR 275.00', rows: ['F', 'E', 'D', 'C', 'B', 'A'], price: 275, isSofa: false },
  ];

  const cols = Array.from({ length: 18 }, (_, i) => i + 1);
  const soldOut = ['H8', 'H9', 'G1', 'G2', 'E10', 'E11', 'A1', 'A18'];
  const reserved = ['F5', 'F6'];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (id) => {
    if (soldOut.includes(id) || reserved.includes(id)) return;
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getSeatColor = (id) => {
    if (soldOut.includes(id)) return 'text-red-500 opacity-30';
    if (reserved.includes(id)) return 'text-cyan-600 opacity-100';
    if (selectedSeats.includes(id)) return 'text-yellow-400 scale-125 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]';
    return 'text-teal-500 hover:text-teal-300 transition-colors';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-slate-300 flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-[#111] shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft size={28} className="text-white" />
        </button>
        <div className="text-center px-2">
          <h2 className="text-white font-bold uppercase tracking-tight text-sm md:text-lg">{movieTitle}</h2>
          <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">{theatreName}</p>
        </div>
        <div className="flex flex-col items-center text-slate-500">
           <ZoomIn size={20} />
           <span className="text-[8px] uppercase font-bold">Slide</span>
        </div>
      </header>

      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a] touch-pan-x touch-pan-y">
        {/* Increased min-width to accommodate larger icons */}
        <div className="min-w-[950px] md:min-w-0 p-10 md:p-16 flex flex-col items-center">
          
          {/* SCREEN */}
          <div className="w-full max-w-3xl mb-24 px-10">
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_15px_40px_rgba(6,182,212,0.5)]"></div>
            <p className="text-center text-[10px] uppercase tracking-[1.2em] text-slate-600 mt-6 font-bold">Cinema Screen</p>
          </div>

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="w-full flex flex-col items-center mb-12">
              <div className="w-full max-w-5xl border-b border-white/5 mb-8 pb-2 text-center">
                 <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{section.label}</span>
              </div>

              <div className="space-y-6">
                {section.rows.map(rowLabel => (
                  <div key={rowLabel} className="flex items-center gap-6">
                    <span className="w-6 text-xs font-black text-slate-800">{rowLabel}</span>
                    
                    <div className="flex gap-3 md:gap-4">
                      {cols.map(col => {
                        const id = `${rowLabel}${col}`;
                        const isAisle = col === 4 || col === 14;

                        return (
                          <React.Fragment key={id}>
                            <button 
                              onClick={() => toggleSeat(id)} 
                              className={`transition-all duration-300 transform active:scale-75 ${getSeatColor(id)}`}
                            >
                              {/* BIGGER ICONS HERE */}
                              <Armchair size={section.isSofa ? 28 : 24} strokeWidth={2.5} />
                            </button>
                            {isAisle && <div className="w-6 md:w-10" />} 
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <span className="w-6 text-xs font-black text-slate-800">{rowLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-12 mb-24 py-10 w-full border-t border-white/5">
            <LegendItem color="text-teal-500" label="Available" />
            <LegendItem color="text-cyan-600" label="Reserved" />
            <LegendItem color="text-red-500/30" label="Sold Out" />
            <LegendItem color="text-yellow-400" label="Selected" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="p-6 bg-[#111] border-t border-white/5 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {selectedSeats.length} Seats
            </p>
            <p className="text-3xl font-black text-white">
               <span className="text-sm mr-2 text-teal-600 font-bold tracking-tighter">NPR</span>
               {(selectedSeats.length * 275).toLocaleString()}
            </p>
          </div>
          
          <button
            disabled={selectedSeats.length === 0}
            onClick={() => onConfirm(selectedSeats)}
            className={`px-12 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
              selectedSeats.length > 0 
              ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] active:scale-95 hover:bg-cyan-500' 
              : 'bg-white/5 text-slate-700 cursor-not-allowed uppercase'
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </footer>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex flex-col items-center gap-3">
    <Armchair size={24} className={color} strokeWidth={2.5} />
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
  </div>
);

export default SeatMap;