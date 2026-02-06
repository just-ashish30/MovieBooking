import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  Search,
  Clapperboard,
  ChevronDown,
  Menu, // Added for mobile
  X     // Added for mobile
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      setIsMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="bg-red-600 sticky top-0 z-[100] shadow-lg">
      <div className="max-w-[90%] md:max-w-[85%] mx-auto py-3 flex items-center justify-between text-white">
        
        {/* --- LEFT: Logo --- */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-1" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter hover:text-gray-200 transition flex items-center gap-2">
            <Clapperboard className="w-7 h-7 md:w-8 md:h-8 text-yellow-300" />
            <span className="block">CineBook</span>
          </Link>
        </div>

        {/* --- CENTER: Desktop Navigation Links (Hidden on Mobile) --- */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/movies" className="hover:text-yellow-300 transition font-bold">Movies</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition font-bold">
              Category <ChevronDown size={14} />
            </button>
            <div className="absolute hidden group-hover:block top-full left-0 bg-white text-gray-800 rounded-xl shadow-xl py-2 w-40 mt-1 border border-gray-100">
              <Link to="/category/hollywood" className="block px-4 py-2 hover:bg-red-50 hover:text-red-600">Hollywood</Link>
              <Link to="/category/bollywood" className="block px-4 py-2 hover:bg-red-50 hover:text-red-600">Bollywood</Link>
            </div>
          </div>

          <Link to="/genres" className="hover:text-yellow-300 transition font-bold">Genre</Link>
          <Link to="/contact" className="hover:text-yellow-300 transition font-bold">Contact</Link>
        </div>

        {/* --- RIGHT: Search + Auth --- */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Search Bar (Hidden on small mobile, visible on tablet+) */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-red-700 text-white placeholder-red-300 text-sm rounded-full py-1.5 pl-4 pr-8 w-24 focus:w-40 transition-all outline-none border border-transparent focus:border-red-400"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300" />
          </div>

          {user ? (
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center">
                <img
                  src={user.photoURL || "https://i.pravatar.cc/100"}
                  alt="Profile"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-yellow-300 object-cover shadow-md"
                />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl py-2 z-20 border border-gray-100 text-gray-800 animate-in fade-in zoom-in-95 duration-200">
                    <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm font-semibold">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition text-sm font-bold border-t border-gray-100">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-white text-red-600 px-4 py-2 rounded-xl hover:bg-yellow-300 transition font-black text-[10px] md:text-xs">
              LOGIN
            </Link>
          )}
        </div>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      {isMenuOpen && (
        <div className="lg:hidden bg-red-700 border-t border-red-500 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-4 font-bold">
            <Link to="/movies" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-red-600">Movies</Link>
            <div className="py-2 border-b border-red-600">
              <p className="text-red-300 text-xs mb-2 uppercase">Categories</p>
              <div className="flex gap-4">
                <Link to="/category/hollywood" onClick={() => setIsMenuOpen(false)}>Hollywood</Link>
                <Link to="/category/bollywood" onClick={() => setIsMenuOpen(false)}>Bollywood</Link>
              </div>
            </div>
            <Link to="/genres" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-red-600">Genre</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="py-2">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;