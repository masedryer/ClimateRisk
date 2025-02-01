"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-gray-100 shadow-md py-3 px-8 w-full flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-4xl font-bold text-gray-800 hover:text-green-600 transition-colors">
        Lemonject
      </Link>

      <div className="hidden md:flex space-x-6 justify-center w-full">
        <Link href="/about" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
          About
        </Link>
        <Link href="/dashboard" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
          Dashboard
        </Link>
   
     
        <Link href="/predictor" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
          ML Predictor
        </Link>
     
     
        <Link href="/" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
          Docs
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/contact" className="hidden md:block text-lg text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors">
          Contact
        </Link>

        {user ? (
  <div className="relative">
    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 bg-gray-100 border-2 border-gray-800 px-3 py-2 rounded hover:bg-gray-200 transition-colors">
      <img src="/profile-icon.svg" alt="Profile" className="w-10 h-10" />
      <span>Welcome, {user.email|| "User"}</span>  {/* Uses display_name or a fallback */}
    </button>
    {isMenuOpen && (
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <Link href="/login" className="text-lg text-gray-800 hover:text-green-600 transition-colors">

  </Link>
)}




        <button
          className="md:hidden bg-gray-100 text-gray-800 border-2 border-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          onClick={toggleMenu}
        >
          Menu
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-white shadow-lg p-4 flex flex-col items-start space-y-4">
          <Link href="/about" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            About
          </Link>
          <Link href="/dashboard" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/contact" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
