import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
      {/* Left side: Logo + Nav Links */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <span className="text-2xl font-bold">CineBook</span>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="hover:text-yellow-300 transition font-semibold"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="hover:text-yellow-300 transition font-semibold"
          >
            Movies
          </Link>
        </div>
      </div>

      {/* Right side: Login/Register */}
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="flex items-center bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200 transition space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </Link>
        <Link
          to="/register"
          className="flex items-center bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200 transition space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Register</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
