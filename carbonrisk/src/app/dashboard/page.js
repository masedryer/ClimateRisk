"use client";
import "../globals.css";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Initialize Supabase client
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [topCountries, setTopCountries] = useState([]); // Top 5 countries by NDVI
  const [chartsData, setChartsData] = useState([]); // Data for separate charts
  const [error, setError] = useState(null); // Error state

  // Fetch top 5 countries by NDVI for 2020
  const fetchTopCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("yearlydata_test")
        .select("NDVI, country_id")
        .eq("Year", 2020) // Filter for the year 2020
        .order("NDVI", { ascending: false }) // Sort by NDVI in descending order
        .limit(5); // Limit to top 5 countries

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
        return { name: countryName, country_id: row.country_id };
      });
      setTopCountries(topCountriesData);
      fetchNDVIData(topCountriesData); // Fetch NDVI data for each country
    } catch (err) {
      console.error("Error fetching top countries by NDVI:", err);
      setError(err.message);
    }
  };

  // Fetch NDVI data for each country over the 2010-2020 range
  const fetchNDVIData = async (topCountriesData) => {
    const yearRange = Array.from({ length: 11 }, (_, i) => 2010 + i); // 2010-2020 range
    const chartsDataPromises = topCountriesData.map(async (country) => {
      try {
        const { data, error } = await supabase
          .from("yearlydata_test")
          .select("Year, NDVI")
          .eq("country_id", country.country_id)
          .in("Year", yearRange); // Filter for the year range 2010-2020

        if (error) throw error;

        // Prepare the data for the chart
        const chartData = {
  labels: data.map((row) => row.Year), // Ensure `data` has a Year property
  datasets: [
    {
      label: `${countryName} NDVI`, // Use backticks for template literals
      data: data.map((row) => row.NDVI), // Ensure `data` has an NDVI property
      fill: false,
      borderColor: "rgba(75,192,192,1)", // Line color for the chart
      tension: 0.1, // Curve smoothness
    },
  ],
};

        return { countryName: country.name, chartData };
      } catch (err) {
        console.error(`Error fetching NDVI data for ${countryName}:`, err);
        return null; // Return null in case of error
      }
    });

    // Wait for all data to be fetched and set the state
    const resolvedData = await Promise.all(chartsDataPromises);
    setChartsData(resolvedData.filter((item) => item !== null)); // Remove null entries if any
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchTopCountries();
  }, []);

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
              {index + 1}. {country.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Separate Charts for Each Country */}
      <div>
        <h2>NDVI Charts (2010-2020)</h2>
        {chartsData.length === 0 ? (
          <p>Loading charts...</p>
        ) : (
          chartsData.map((countryChart, index) => (
            <div key={index}>
              <h3>{countryChart.countryName}</h3>
              <Line data={countryChart.chartData} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;