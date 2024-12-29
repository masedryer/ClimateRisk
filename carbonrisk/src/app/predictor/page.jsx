"use client";

import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../globals.css";

export default function RiskPredictor() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskScore, setRiskScore] = useState(null);

  // List of sample countries
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const randomRiskScore = Math.floor(Math.random() * 10) + 1;
      setRiskScore(randomRiskScore);
      setIsSubmitting(false);
    }, 3000);
  };

  // Get risk level details based on score
  const getRiskLevel = (score) => {
    if (score >= 8) {
      return {
        level: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        message: (
          <div className="mt-6 p-6 border bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-lg mx-auto">
            <h5 className="text-xl font-semibold text-red-700 mb-4">High Risk Assessment</h5>
            <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
              Your risk rating falls within the 8 and above range, indicating a high level of risk.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h6 className="font-semibold text-red-800 mb-2">Key Risk Factors:</h6>
                <ul className="list-disc pl-4 space-y-2 text-gray-800">
                  <li>Declining NDVI (Normalized Difference Vegetation Index)</li>
                  <li>Political instability</li>
                  <li>Economic volatility</li>
                  <li>Poor governance</li>
                </ul>
              </div>
              <p className="text-base leading-relaxed text-gray-800">
                These elements contribute to an increased risk of project underperformance.{" "}
                <a href="/learn-more" className="text-blue-600 hover:text-blue-800 font-semibold">Learn more →</a>
              </p>
            </div>
          </div>
        )
      };
    }
    if (score >= 5) {
      return {
        level: "Moderate Risk",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
        message: (
          <div className="mt-6 p-6 border bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-lg mx-auto">
            <h5 className="text-xl font-semibold text-yellow-700 mb-4">Moderate Risk Assessment</h5>
            <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
              Your risk rating falls within the 5 to 7 range, indicating a moderate level of risk.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h6 className="font-semibold text-yellow-800 mb-2">Contributing Factors:</h6>
                <ul className="list-disc pl-4 space-y-2 text-gray-800">
                  <li>Slight fluctuations in NDVI</li>
                  <li>Moderate political uncertainty</li>
                  <li>Potential regulatory challenges</li>
                </ul>
              </div>
              <p className="text-base leading-relaxed text-gray-800">
                These risks should be monitored but are not expected to significantly impact performance.{" "}
                <a href="/learn-more" className="text-blue-600 hover:text-blue-800 font-semibold">Learn more →</a>
              </p>
            </div>
          </div>
        )
      };
    }
    return {
      level: "Low Risk",
      color: "text-green-600",
      bg: "bg-green-50",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      message: (
        <div className="mt-6 p-6 border bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-lg mx-auto">
          <h5 className="text-xl font-semibold text-green-700 mb-4">Low Risk Assessment</h5>
          <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
            Your risk rating falls within the 1 to 4 range, indicating a low level of risk.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h6 className="font-semibold text-green-800 mb-2">Positive Indicators:</h6>
              <ul className="list-disc pl-4 space-y-2 text-gray-800">
                <li>Positive NDVI trends</li>
                <li>Political stability</li>
                <li>Strong governance</li>
                <li>Supportive regulatory framework</li>
              </ul>
            </div>
            <p className="text-base leading-relaxed text-gray-800">
              Current conditions are conducive to successful outcomes.{" "}
              <a href="/learn-more" className="text-blue-600 hover:text-blue-800 font-semibold">Learn more →</a>
            </p>
          </div>
        </div>
      )
    };
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), url('/predictorbg.png')`,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="bg-white/90 rounded-t-lg border-b pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Project Risk Predictor
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Analyze and predict potential risks for your environmental projects
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Location */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Location
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {/* Project Start Year */}
              <div className="space-y-4 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Project Start Year
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={9}
                  placeholderText="Select Start Year"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  minDate={new Date(1800,0)}
                  required
                />
              </div>

              {/* Carbon Emission Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expected Carbon Emission (tons CO2e/year)
                </label>
                <input
                  type="number"
                  value={carbonEmission}
                  onChange={(e) => setCarbonEmission(e.target.value)}
                  placeholder="Enter expected carbon emission"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <ClipLoader size={20} color="#ffffff" />
                    <span>Analyzing Risk...</span>
                  </div>
                ) : (
                  "Analyze Risk"
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Results Card */}
        {riskScore && (
          <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-white/90 rounded-t-lg border-b">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Risk Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Risk Score Display */}
                <div className={`flex items-center justify-between p-4 rounded-lg ${getRiskLevel(riskScore).bg}`}>
                  <div className="flex items-center space-x-3">
                    {getRiskLevel(riskScore).icon}
                    <span className={`font-semibold text-lg ${getRiskLevel(riskScore).color}`}>
                      {getRiskLevel(riskScore).level}
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {riskScore}/10
                  </span>
                </div>

                {/* Risk Score Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(riskScore / 10) * 100}%`,
                        backgroundColor:
                          riskScore >= 8
                            ? "#ef4444"
                            : riskScore >= 5
                              ? "#f59e0b"
                              : "#10b981",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Risk Assessment Details */}
                <div className="mt-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment Details</h4>
                  {getRiskLevel(riskScore).message}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}