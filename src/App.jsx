import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import MoviesDetails from "./pages/MoviesDetails";
import BookingSystem from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import ProtectedRoute from "./components/ProtectedRoute";
import { seedFirestore } from "./seed/seedData";

export default function App() {
  useEffect(() => {
    seedFirestore();
  }, []);

  return (
    // 2. Added Flex classes to keep footer at bottom
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      
      {/* 3. The main content area grows to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MoviesDetails />} />

          {/* 🔐 Protected Route */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingSystem />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer /> {/* 4. Placed outside Routes to show everywhere */}
    </div>
  );
}