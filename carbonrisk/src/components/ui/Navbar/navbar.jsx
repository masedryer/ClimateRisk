"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-100 shadow-md py-3 px-8 w-full flex justify-between items-center sticky top-0 z-50">
      {/* Logo Section */}
      <Link
        href="/"
        className="text-4xl font-bold text-gray-800 hover:text-green-600 transition-colors"
      >
        Lemonject
      </Link>

      <div className="hidden md:flex space-x-6 justify-center w-full">
        <Link
          href="/about"
          className="text-xl text-gray-800 hover:text-green-600 transition-colors"
        >
          About
        </Link>
        <Link
          href="/dashboard"
          className="text-xl text-gray-800 hover:text-green-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/predictor"
          className="text-xl text-gray-800 hover:text-green-600 transition-colors"
        >
          ML Predictor
        </Link>
        <Link
          href="/"
          className="text-xl text-gray-800 hover:text-green-600 transition-colors"
        >
          Docs
        </Link>
      </div>

      {/* "Contact Us" Button - Positioned to the right with smaller font */}
      <Link
        href="/contact"
        className="hidden md:block text-lg text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors"
      >
        Contact
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden bg-gray-100 text-gray-800 border-2 border-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        onClick={toggleMenu}
      >
        Menu
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-4 right-0 bg-white shadow-lg p-4 flex flex-col items-start space-y-4">
          <a
            href="#features"
            className="text-xl text-gray-800 hover:text-green-600 transition-colors"
          >
            Features
          </a>
          {/* Updated the About link to point to the /about page */}
          <Link
            href="/about"
            className="text-xl text-gray-800 hover:text-green-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="text-xl text-gray-800 hover:text-green-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#contact"
            className="text-xl text-gray-800 hover:text-green-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
