"use client";

import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import CountrySelect from "@/components/ui/CountrySelect";
import StartDatePicker from "@/components/ui/StartDatePicker";
import CarbonEmissionInput from "@/components/ui/CarbonEmission";
import "../globals.css";

export default function RiskPredictor() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskScore, setRiskScore] = useState(null);

  // List of 10 random countries
  const countries = [
    "Canada",
    "Australia",
    "Brazil",
    "Germany",
    "India",
    "Japan",
    "South Africa",
    "Mexico",
    "Argentina",
    "United Kingdom",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a 5-second delay
    setTimeout(() => {
      const randomRiskScore = Math.floor(Math.random() * 10) + 1;
      setRiskScore(randomRiskScore);
      setIsSubmitting(false);
    }, 5000);
  };

  // Determine the output text based on the risk score
  const getRiskMessage = (score) => {
    if (score >= 8) {
      return (
        <div className="mt-4 p-4 border bg-white rounded-md max-w-lg mx-auto text-left">
          <p className="text-sm text-gray-800">
            Your risk rating falls within the 8 and above range, indicating a high level of risk.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            This could be attributed to several factors, including declining NDVI (Normalized Difference Vegetation Index), political instability, economic volatility, and poor governance.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            These elements, along with other environmental and regulatory uncertainties, contribute to an increased risk of project underperformance.{" "}
            <a href="/learn-more" className="text-blue-500">
              Learn more
            </a>
          </p>
        </div>
      );
    } else if (score >= 5) {
      return (
        <div className="mt-4 p-4 border bg-white rounded-md max-w-lg mx-auto text-left">
          <p className="text-sm text-gray-800">
            Your risk rating falls within the 5 to 7 range, indicating a moderate level of risk. This suggests that while there are some potential concerns, the project is generally stable.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            Contributing factors may include slight fluctuations in NDVI, moderate political or economic uncertainty, and potential regulatory challenges.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            These risks should be monitored, but they are not expected to significantly hinder project performance at this stage.{" "}
            <a href="/learn-more" className="text-blue-500">
              Learn more
            </a>
          </p>
        </div>
      );
    } else {
      return (
        <div className="mt-4 p-4 border bg-white rounded-md max-w-lg mx-auto text-left">
          <p className="text-sm text-gray-800">
            Your risk rating falls within the 1 to 4 range, indicating a low level of risk. This suggests that the project is in a relatively stable and favorable environment.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            Contributing factors include positive NDVI trends, political stability, strong governance, and a supportive regulatory framework.
          </p>
          <p className="text-sm text-gray-800 mt-6">
            While no project is entirely without risk, the current conditions are conducive to successful outcomes.{" "}
            <a href="/learn-more" className="text-blue-500">
              Learn more
            </a>
          </p>
        </div>
      );
    }
  };

  return (
    <div className="p-8 bg-cover bg-center min-h-screen flex flex-col items-center justify-center" style={{ backgroundImage: 'url(/predictorbg.png)' }}>
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Project Risk Predictor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Select */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm text-gray-700">
              Select a Country:
            </label>
            <select
              id="country"
              name="country"
              className="w-full p-2 border rounded-md"
              value={selectedCountry || ""}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Picker */}
          <StartDatePicker
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
          />

          {/* Carbon Emission Input */}
          <CarbonEmissionInput
            carbonEmission={carbonEmission}
            onChange={(e) => setCarbonEmission(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Analyze Risk"}
          </button>
        </form>

        {/* Loading and Output */}
        <div className="mt-6 text-center">
          {isSubmitting && <ClipLoader size={24} color="#10b981" />}
          {riskScore && !isSubmitting && (
            <p className="text-lg font-semibold text-green-600 mt-4">
              Risk analysis complete!
            </p>
          )}
        </div>
      </div>

      {/* Risk Rating Results */}
      {riskScore && (
        <div className="mt-6 text-center max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-gray-800">Risk Rating Results:</h3>
          <p className="text-lg font-semibold text-gray-700 mt-2">{riskScore}/10</p>
          <div className="w-full mt-4">
            <div className="h-4 w-full rounded-full bg-gray-300 relative">
              <div
                className="h-4 rounded-full"
                style={{
                  width: `${(riskScore / 10) * 100}%`,
                  backgroundColor:
                    riskScore >= 8
                      ? "#ef4444"
                      : riskScore >= 5
                        ? "#fbbf24"
                        : "#10b981",
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-black font-bold">Low</span>
              <span className="text-sm text-black font-bold">High</span>
            </div>
          </div>

          {/* Display Risk Description */}
          {getRiskMessage(riskScore)}
        </div>
      )}
    </div>
  );
}
