import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  Search,
  Clapperboard,
  ChevronDown 
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
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
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    // Outer wrapper for full-width background
    <nav className="bg-red-600 sticky top-0 z-[100] shadow-lg">
      
      {/* --- Inner Container with 85% Max Width --- */}
      <div className="max-w-[85%] mx-auto py-4 grid grid-cols-12 items-center text-white">
        
        {/* --- LEFT: Logo (Cols 1-3) --- */}
        <div className="col-span-3 flex items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:text-gray-200 transition flex items-center gap-2">
            <Clapperboard className="w-8 h-8 text-yellow-300" />
            <span className="hidden lg:block">CineBook</span>
          </Link>
        </div>

        {/* --- CENTER: Navigation Links (Cols 4-9) --- */}
        <div className="col-span-6 flex justify-center items-center space-x-2 md:space-x-8">
          <Link to="/movies" className="hover:text-yellow-300 transition font-bold text-sm md:text-base">
            Movies
          </Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition font-bold text-sm md:text-base">
              Category <ChevronDown size={14} />
            </button>
            <div className="absolute hidden group-hover:block top-full left-0 bg-white text-gray-800 rounded-xl shadow-xl py-2 w-40 mt-1 border border-gray-100">
              <Link to="/category/hollywood" className="block px-4 py-2 hover:bg-red-50 hover:text-red-600">Hollywood</Link>
              <Link to="/category/bollywood" className="block px-4 py-2 hover:bg-red-50 hover:text-red-600">Bollywood</Link>
            </div>
          </div>

          <Link to="/genres" className="hover:text-yellow-300 transition font-bold text-sm md:text-base">
            Genre
          </Link>

          <Link to="/contact" className="hover:text-yellow-300 transition font-bold text-sm md:text-base">
            Contact
          </Link>
        </div>

        {/* --- RIGHT: Search + Auth (Cols 10-12) --- */}
        <div className="col-span-3 flex items-center justify-end space-x-4">
          
          {/* Search Bar */}
          <div className="relative hidden xl:block">
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
                  className="w-9 h-9 rounded-full border-2 border-yellow-300 object-cover shadow-md"
                />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl py-2 z-20 border border-gray-100 text-gray-800">
                    <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm font-semibold">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition text-sm font-bold border-t border-gray-100">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-white text-red-600 px-4 py-2 rounded-xl hover:bg-yellow-300 transition font-black text-xs">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;