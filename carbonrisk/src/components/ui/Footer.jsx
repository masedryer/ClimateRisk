"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-between sm:flex-row">
        {/* Logo or Brand */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl font-bold">Lemonject</h1>
        </div>

        {/* Links Section */}
        <div className="flex space-x-4 text-sm">
          <a href="/about" className="hover:text-gray-400">
            About Us
          </a>
          <a href="/dashboard" className="hover:text-gray-400">
            Dashboard
          </a>
          <a href="/predictor" className="hover:text-gray-400">
            ML Predictor
          </a>
          <a href="/docs" className="hover:text-gray-400">
            Docs
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact Us
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Lemonject. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
