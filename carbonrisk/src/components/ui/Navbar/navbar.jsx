"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import Image from 'next/image';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("User");
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // First try to get from auth metadata
          const { data: authData } = await supabase.auth.getUser();
          
          // If that doesn't work, query the profiles table
          if (!authData?.user?.user_metadata?.display_name) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', user.id)
              .single();
            
            if (profileData?.display_name) {
              setDisplayName(profileData.display_name);
            } else {
              // Fallback to email if no display name found
              setDisplayName(user.email.split('@')[0]);
            }
          } else {
            setDisplayName(authData.user.user_metadata.display_name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setDisplayName(user.email.split('@')[0]);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-gray-100 shadow-md py-2 px-4 w-full flex justify-between items-center sticky top-0 z-50 max-h-16">
    <Link href="/">
      <Image 
        src="/Lemonjectupdate.png" 
        alt="Lemonject Logo" 
        width={55}  
        height={20}  
        className="hover:opacity-80 transition-opacity"
      />
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
        <Link href="/docs" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
          Docs
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/contact" className="hidden md:block text-lg text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors">
          Contact
        </Link>

        {user && (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 bg-gray-100 border-2 border-gray-800 px-3 py-2 rounded hover:bg-gray-200 transition-colors">
              <img src="/profile-icon.svg" alt="Profile" className="w-10 h-10" />
              <span>Welcome, {displayName}</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
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
          <Link href="/predictor" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            ML Predictor
          </Link>
          <Link href="/docs" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            Docs
          </Link>
          <Link href="/contact" className="text-xl text-gray-800 hover:text-green-600 transition-colors">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}