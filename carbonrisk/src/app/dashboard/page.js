"use client";
import "../globals.css";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [countries, setCountries] = useState([]); // All countries for filters
  const [topCountries, setTopCountries] = useState([]); // Top 5 countries by NDVI
  const [selectedCountries, setSelectedCountries] = useState([]); // Selected countries
  const [metrics, setMetrics] = useState([]); // Selected metrics
  const [availableMetrics, setAvailableMetrics] = useState([]); // All metrics
  const [chartData, setChartData] = useState({}); // Chart data
  const [filterRange, setFilterRange] = useState("2000-2010"); // Year filter
  const [error, setError] = useState(null); // Error state

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("region")
        .select('id, "Country Name"');

      if (error) throw error;
      setCountries(data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError(err.message);
    }
  };

  // Fetch top 5 countries by NDVI
  const fetchTopCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("yearlydata_test")
        .select("NDVI, country_id")
        .eq("Year", 2020) // Filter for a specific year (modify as needed)
        .order("NDVI", { ascending: false }) // Sort by NDVI in descending order
        .limit(5); // Limit to top 5

      if (error) throw error;

      // Join with region table to get country names
      const countryIds = data.map((row) => row.country_id);
      const { data: regions, error: regionError } = await supabase
        .from("region")
        .select('id, "Country Name"')
        .in("id", countryIds);

      if (regionError) throw regionError;

      // Map NDVI values to country names
      const topCountriesData = data.map((row) => {
        const countryName = regions.find((region) => region.id === row.country_id)?.["Country Name"];
        return { name: countryName, ndvi: row.NDVI };
      });
      setTopCountries(topCountriesData);
    } catch (err) {
      console.error("Error fetching top countries by NDVI:", err);
      setError(err.message);
    }
  };

  // Fetch available metrics
  const fetchAvailableMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("yearlydata_test")
        .select('"Max temperature", "Mean temperature"')
        .limit(1); // Fetch only the schema (not the entire dataset)

      if (error) throw error;
      setAvailableMetrics(["Max Temperature", "Mean Temperature"]); // Set available metrics
    } catch (err) {
      console.error("Error fetching available metrics:", err);
      setError(err.message);
    }
  };

  // Fetch and process metrics based on filters
  const processMetrics = async () => {
    const yearRange = getYearRange(filterRange);
    try {
      const { data, error } = await supabase
        .from("yearlydata_test")
        .select("Year, country_id, MaxTemp, MeanTemp")
        .in("Year", yearRange)
        .in("country_id", selectedCountries);

      if (error) throw error;

      // Aggregate metrics or prepare for visualization (if needed)
      setChartData(data);
    } catch (err) {
      console.error("Error processing metrics:", err);
      setError(err.message);
    }
  };

  // Get year range based on filter
  const getYearRange = (filter) => {
    switch (filter) {
      case "2000-2010":
        return Array.from({ length: 11 }, (_, i) => 2000 + i);
      case "2010-2020":
        return Array.from({ length: 11 }, (_, i) => 2010 + i);
      case "2020-2024":
        return Array.from({ length: 5 }, (_, i) => 2020 + i);
      default:
        return [];
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchCountries();
    fetchTopCountries();
    fetchAvailableMetrics();
  }, []);

  // Update metrics whenever filters change
  useEffect(() => {
    if (selectedCountries.length > 0 && metrics.length > 0) {
      processMetrics();
    }
  }, [selectedCountries, metrics, filterRange]);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Top 5 Countries by NDVI */}
      <div>
        <h2>Top 5 Countries by NDVI (2020)</h2>
        <ul>
          {topCountries.map((country, index) => (
            <li key={index}>
              {index + 1}. {country.name}: {country.ndvi.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics Filter */}
      <div>
        <h2>Metrics</h2>
        <p>Available Metrics: {availableMetrics.join(", ")}</p>
      </div>

      {/* Chart Section */}
      <div>
        <h2>Charts</h2>
        {Object.keys(chartData).length === 0 ? (
          <p>No data available for the selected filters.</p>
        ) : (
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default Dashboard;