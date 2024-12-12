"use client";
import "../globals.css";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

// Country list (mock for now)
const countries = [
  "Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Italy",
  "Japan", "Mexico", "Russia", "South Africa", "United Kingdom", "United States",
];

const Dashboard = () => {
  const [filterRange, setFilterRange] = useState("2000-2010");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
  const [chartData, setChartData] = useState({}); // State for chart data

  const chartTitles = [
    "NDVI",
    "Max Temperature (°C)",
    "Summer Precipitation (mm)",
    "Forest Area (%)",
    "Night Light (DN value)",
  ];

  // Random value generator within the specified range for each metric
  const generateRandomData = (metric, country) => {
    let value;
    switch (metric) {
      case "NDVI":
        value = Math.random().toFixed(2); // Random between 0 and 1
        break;
      case "Max Temperature (°C)":
        value = (Math.random() * 50 - 10).toFixed(1); // Random between -10°C and 40°C
        break;
      case "Summer Precipitation (mm)":
        value = (Math.random() * 5000).toFixed(0); // Random between 0 and 5000 mm
        break;
      case "Forest Area (%)":
        value = (Math.random() * 100).toFixed(1); // Random between 0% and 100%
        break;
      case "Night Light (DN value)":
        value = (Math.random() * 63).toFixed(0); // Random between 0 and 63 DN
        break;
      default:
        value = 0;
    }
    return { country, value: parseFloat(value) };
  };

  // Function to generate chart data for all selected countries
  const generateChartData = () => {
    const data = {};
    const yearRange = getYearRange(filterRange); // Get the year range based on the filter
    countryList.forEach((country) => {
      chartTitles.forEach((title) => {
        const values = yearRange.map((year) => ({
          Year: year,
          Value: generateRandomData(title, country).value,
        }));
        if (!data[country]) data[country] = [];
        data[country].push({ metric: title, values });
      });
    });
    setChartData(data);
  };

  // Function to get year range based on selected filter
  const getYearRange = (filter) => {
    switch (filter) {
      case "2000-2010":
        return Array.from({ length: 11 }, (_, i) => 2000 + i); // 2000 to 2010
      case "2010-2020":
        return Array.from({ length: 11 }, (_, i) => 2010 + i); // 2010 to 2020
      case "2020-2024":
        return Array.from({ length: 5 }, (_, i) => 2020 + i); // 2020 to 2024
      default:
        return [];
    }
  };

  // Function to generate the list of years with an interval of 2 years
  const getXAxisTicks = (filterRange) => {
    const yearRange = getYearRange(filterRange); // Get the range based on filter
    return yearRange.filter((year, index) => index % 2 === 0); // Filter years at intervals of 2
  };

  // Filter countries based on search input
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a country
  const handleSelectCountry = (country) => {
    if (countryList.length < 5 && !countryList.includes(country)) {
      setCountryList((prevList) => [...prevList, country]);
      setShowTooltip(false); // Hide tooltip when a country is added
    } else if (countryList.length >= 5) {
      setShowTooltip(true); // Show tooltip if limit is reached
      setTimeout(() => {
        setShowTooltip(false); // Hide tooltip after 5 seconds
      }, 5000);
    }
  };

  // Handle removing a country from the list
  const handleRemoveCountry = (country) => {
    setCountryList((prevList) => prevList.filter((item) => item !== country));
    setShowTooltip(false); // Hide tooltip if space is made in the list
  };

  // Generate chart data when countryList or filterRange changes
  useEffect(() => {
    if (countryList.length > 0) {
      generateChartData();
    }
  }, [countryList, filterRange]);

  // Get line chart data based on the metric (title) and selected countries
  const getLineChartData = (title) => {
    const chartDataForMetric = Object.keys(chartData).map((country) => ({
      country,
      data: chartData[country]?.find((data) => data.metric === title)?.values,
    }));

    // We need to merge this data into a single array for all countries, ensuring each country’s data is displayed
    return chartDataForMetric.map((entry) => entry.data).flat();
  };

  return (
    <div className="flex">
      {/* Country Filter Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-2">Select Country</h2>
        <input
          type="text"
          placeholder="Search for a country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="max-h-64 overflow-auto">
          {filteredCountries.map((country, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectCountry(country)}
            >
              {country}
            </div>
          ))}
        </div>

        {showTooltip && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
            You can select only up to 5 countries.
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Countries</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {countryList.map((country, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
              >
                {country}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveCountry(country)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="w-3/4 p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
          >
            <option value="2000-2010">2000 to 2010</option>
            <option value="2010-2020">2010 to 2020</option>
            <option value="2020-2024">2020 to 2024</option>
          </select>
        </div>

        {/* Render Charts */}
        {chartTitles.map((title, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getLineChartData(title)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="Year"
                      ticks={getXAxisTicks(filterRange)} // Pass the generated ticks
                    />
                    <YAxis
                      domain={
                        title === "NDVI"
                          ? [0, 1] // For NDVI, it stays between 0 and 1
                          : title === "Max Temperature (°C)"
                            ? [-10, 50] // For Max Temperature, set the range from -10°C to 50°C
                            : title === "Summer Precipitation (mm)"
                              ? [0, 5000] // For Summer Precipitation, set the range from 0 to 5000 mm
                              : title === "Forest Area (%)"
                                ? [0, 100] // For Forest Area, set the range from 0% to 100%
                                : title === "Night Light (DN value)"
                                  ? [0, 63] // For Night Light, limit to 0-63
                                  : ["auto", "auto"] // For other metrics, auto scale
                      }
                    />
                    <Tooltip />
                    <Legend />
                    {countryList.map((country, idx) => (
                      <Line
                        key={idx}
                        type="monotone"
                        dataKey="Value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;