"use client";
import "../globals.css";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [jsonData, setJsonData] = useState([]); // Store the fetched JSON data
  const [loading, setLoading] = useState(true); // Loading state to control rendering

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        // Fetching data from Supabase table "yearlydata"
        const { data, error } = await supabase.from("yearlydata").select("*");

        if (error) {
          console.error("Error fetching data from Supabase:", error);
          setLoading(false);
          return;
        }

        console.log("Fetched Data:", data);

        // Filter out data with missing or invalid NDVI values
        const validData = data.filter(
          (item) => item["NDVI"] !== null && !isNaN(item["NDVI"])
        );

        setJsonData(validData); // Storing valid data in state
        setLoading(false); // Data is loaded, stop loading
      } catch (error) {
        console.error("Unexpected error:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchJsonData();
  }, []);

  // 1. Get the top 5 countries with the highest NDVI values, ensuring countries are distinct
  const sortedNDVIData = jsonData.sort((a, b) => b["NDVI"] - a["NDVI"]); // Sort by highest NDVI

  // Filter out duplicates based on "Country Name" and get the top 5
  const uniqueCountries = [];
  const topCountries = [];

  sortedNDVIData.forEach((item) => {
    if (!uniqueCountries.includes(item["Country Name"])) {
      uniqueCountries.push(item["Country Name"]);
      topCountries.push(item["Country Name"]);
    }
    if (topCountries.length === 5) return; // Stop when we have top 5 countries
  });

  // 2. Generate the line chart data for each country (from 2015 to 2022)
  const getCountryData = (countryName) => {
    return jsonData
      .filter(
        (item) =>
          item["Country Name"] === countryName &&
          item["Year"] >= 2015 &&
          item["Year"] <= 2022
      )
      .map((item) => ({
        Year: item["Year"],
        NDVI: item["NDVI"],
      }));
  };

  // Ensure loading state is handled, and render loading text if necessary
  if (loading) {
    return <div>Loading...</div>;
  }

  // Limit the number of charts to 5
  const top5Countries = topCountries.slice(0, 5);

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Temperature Trend Line Chart (Top 5 Countries with highest NDVI) */}
        {top5Countries.length > 0 ? (
          top5Countries.map((country) => {
            const countryData = getCountryData(country);

            return (
              <Card key={country}>
                <CardHeader>
                  <CardTitle>NDVI Trend for {country}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={countryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="NDVI"
                          stroke="#8884d8"
                          name={country}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div>No data available for the selected NDVI trends.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
