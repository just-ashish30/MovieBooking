import React from "react";
import { Clapperboard, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-black">
              <Clapperboard className="w-8 h-8 text-red-600" />
              <span>Cine<span className="text-red-600">Book</span></span>
            </div>
            <p className="text-gray-400 text-sm">Your ultimate movie booking destination.</p>
            <div className="flex gap-4">
              <Facebook className="hover:text-red-600 cursor-pointer" size={20} />
              <Instagram className="hover:text-red-600 cursor-pointer" size={20} />
              <Twitter className="hover:text-red-600 cursor-pointer" size={20} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-600">Explore</h4>
            <ul className="space-y-3 text-gray-400 text-sm font-medium">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/movies" className="hover:text-white transition">All Movies</a></li>
              <li><a href="/booking" className="hover:text-white transition">My Bookings</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-600">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex gap-3"><MapPin size={18} className="text-red-600" /> Kathmandu, Nepal</li>
              <li className="flex gap-3"><Phone size={18} className="text-red-600" /> +977-123456789</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-red-600">Newsletter</h4>
            <div className="flex bg-gray-800 rounded-xl overflow-hidden p-1">
              <input type="email" placeholder="Email" className="bg-transparent px-3 py-2 outline-none text-sm w-full" />
              <button className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          © 2026 CineBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;