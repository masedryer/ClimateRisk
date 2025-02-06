// components/ui/Countrysidebar.jsx
"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Import supabase client

const Countrysidebar = () => {
  const [countries, setCountries] = useState([]);

  // Fetch countries for the dropdown
  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("region")
        .select("CountryName");
      if (error) {
        console.error("Error fetching countries:", error.message);
      } else {
        setCountries(data.map((item) => item.CountryName)); // Store country names
      }
    } catch (err) {
      console.error("Unexpected error fetching countries:", err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      <h1>Country List</h1>
      <ul>
        {countries.map((country, index) => (
          <li key={index}>{country}</li>
        ))}
      </ul>
    </div>
  );
};

export default Countrysidebar;
