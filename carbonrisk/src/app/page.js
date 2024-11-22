"use client";
import "./globals.css";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { db, collection, getDocs } from "../lib/firebase";

const Dashboard = () => {
  const [jsonData, setJsonData] = useState([]); // Store the fetched JSON data

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        // Fetching data from Firebase collection yearlydata
        const querySnapshot = await getDocs(collection(db, "yearlydata"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setJsonData(data); // Storing data in state
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchJsonData();
  }, []);

  // 1. Filter the data for the years 2015-2021
  const filteredData = jsonData.filter(
    (item) => item.Year >= 2015 && item.Year <= 2021
  );

  // 2. Find the 2 countries with the highest max temperature and the lowest min temperature
  const sortedMaxTempData = filteredData
    .sort((a, b) => b["Max temperature"] - a["Max temperature"]) // Sort by highest max temperature
    .slice(0, 2); // Take the top 2 countries with highest max temperature

  const sortedMinTempData = filteredData
    .sort((a, b) => a["Min temperature"] - b["Min temperature"]) // Sort by lowest min temperature
    .slice(0, 2); // Take the top 2 countries with lowest min temperature

  // 3. Prepare temperature trend data for the highest max temperature and lowest min temperature countries
  const highestMaxTempCountry = sortedMaxTempData[0]?.["Country Name"];
  const lowestMinTempCountry = sortedMinTempData[0]?.["Country Name"];

  const highestMaxTempTrend = filteredData.filter(
    (item) => item["Country Name"] === highestMaxTempCountry
  );
  const lowestMinTempTrend = filteredData.filter(
    (item) => item["Country Name"] === lowestMinTempCountry
  );

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Temperature Trend Line Chart (Highest Max Temp and Lowest Min Temp Countries) */}
        {highestMaxTempCountry && lowestMinTempCountry ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Temperature Trend for {highestMaxTempCountry}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={highestMaxTempTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Max temperature"
                        stroke="#8884d8"
                        name={highestMaxTempCountry}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Temperature Trend for {lowestMinTempCountry}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lowestMinTempTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Min temperature"
                        stroke="#82ca9d"
                        name={lowestMinTempCountry}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div>No data available for the selected temperature trends.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
