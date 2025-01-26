"use client";

import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { createClient } from "@supabase/supabase-js";

import "../globals.css";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RiskPredictor() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from("region")
          .select("CountryName"); // Case-sensitive: Ensure column matches Supabase

        if (error) {
          console.error("Error fetching countries:", error.message);
          return;
        }

        if (data) {
          console.log("Fetched countries:", data); // Debug fetched data
          setCountries(data.map((item) => item.CountryName)); // Extract CountryName from data
        }
      } catch (err) {
        console.error("Unexpected error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const fetchRiskScore = async () => {
    if (!selectedCountry || !startDate || !endDate) {
      alert("Please select a country and valid start and end years.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get country ID from region table
      const { data: regionData, error: regionError } = await supabase
        .from("region")
        .select("id")
        .eq("CountryName", selectedCountry) // Case-sensitive: Ensure column matches Supabase
        .single();

      if (regionError) throw new Error("Country not found in the database.");

      const countryId = regionData.id;

      // Fetch predictions for the specified year range
      const { data: predictionData, error: predictionError } = await supabase
        .from("prediction")
        .select("adjusted_risk_score")
        .eq("country_id", countryId)
        .gte("Year", startDate.getFullYear())
        .lte("Year", endDate.getFullYear());

      if (predictionError) throw new Error("Error fetching prediction data.");

      if (!predictionData || predictionData.length === 0) {
        throw new Error("No risk data available for the selected period.");
      }

      // Calculate the average risk score
      const totalScore = predictionData.reduce(
        (sum, { adjusted_risk_score }) => sum + adjusted_risk_score,
        0
      );
      const averageScore = totalScore / predictionData.length;
      const roundedScore = Math.round(averageScore);

      setRiskScore(roundedScore);
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while fetching risk data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRiskScore();
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    const resultsElement = document.getElementById("risk-results");

    try {
      // First page - Results
      const canvas1 = await html2canvas(resultsElement, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData1 = canvas1.toDataURL("image/png");

      // Initialize PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight1 = (canvas1.height * pageWidth) / canvas1.width;

      // Add first page
      pdf.addImage(imgData1, "PNG", 0, 0, pageWidth, imgHeight1);

      // Add explanation page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Risk Rating and Interpretation", 20, 20);

      pdf.setFontSize(12);
      pdf.text(
        [
          "The risk rating falls under four distinct ranges:",
          "• 1.0-2.4: The project is highly achievable with minimal barriers",
          "• 2.5-4.9: The project is moderately achievable",
          "• 5.0-7.4: The project is challenging to achieve",
          "• 7.5-10.0: The project is highly unlikely to be achievable",
        ],
        20,
        40
      );

      pdf.text("Risk Factors That Affect Prediction Results:", 20, 90);
      pdf.text(
        [
          "1. Environmental Risks",
          "   • Temperature variations",
          "   • Seasonal precipitation",
          "   • Carbon emissions",
          "2. Political Risks",
          "   • Political stability",
          "   • Regulatory framework",
          "3. Economic Factors",
          "   • Market conditions",
          "   • Investment climate",
          "4. NDVI (Normalized Difference Vegetation Index)",
          "   • Vegetation health assessment",
          "   • Land use changes monitoring",
        ],
        20,
        100
      );

      pdf.save("risk-analysis-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }

    setIsExporting(false);
  };

  const getRiskLevel = (score) => {
    if (score >= 8) {
      return {
        level: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        message: (
          <div className="mt-6 p-6 border bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-lg mx-auto">
            <h5 className="text-xl font-semibold text-red-700 mb-4">
              High Risk Assessment
            </h5>
            <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
              Your risk rating falls within the 8 and above range, indicating a
              high level of risk.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h6 className="font-semibold text-red-800 mb-2">
                  Key Risk Factors:
                </h6>
                <ul className="list-disc pl-4 space-y-2 text-gray-800">
                  <li>
                    Declining NDVI (Normalized Difference Vegetation Index)
                  </li>
                  <li>Political instability</li>
                  <li>Economic volatility</li>
                  <li>Poor governance</li>
                </ul>
              </div>
              <p className="text-base leading-relaxed text-gray-800">
                These elements contribute to an increased risk of project
                underperformance.{" "}
                <a
                  href="/learn-more"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Learn more →
                </a>
              </p>
            </div>
          </div>
        ),
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
            <h5 className="text-xl font-semibold text-yellow-700 mb-4">
              Moderate Risk Assessment
            </h5>
            <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
              Your risk rating falls within the 5 to 7 range, indicating a
              moderate level of risk.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h6 className="font-semibold text-yellow-800 mb-2">
                  Contributing Factors:
                </h6>
                <ul className="list-disc pl-4 space-y-2 text-gray-800">
                  <li>Slight fluctuations in NDVI</li>
                  <li>Moderate political uncertainty</li>
                  <li>Potential regulatory challenges</li>
                </ul>
              </div>
              <p className="text-base leading-relaxed text-gray-800">
                These risks should be monitored but are not expected to
                significantly impact performance.{" "}
                <a
                  href="/learn-more"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Learn more →
                </a>
              </p>
            </div>
          </div>
        ),
      };
    }
    return {
      level: "Low Risk",
      color: "text-green-600",
      bg: "bg-green-50",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      message: (
        <div className="mt-6 p-6 border bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-lg mx-auto">
          <h5 className="text-xl font-semibold text-green-700 mb-4">
            Low Risk Assessment
          </h5>
          <p className="text-base leading-relaxed text-gray-800 font-medium mb-4">
            Your risk rating falls within the 1 to 4 range, indicating a low
            level of risk.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h6 className="font-semibold text-green-800 mb-2">
                Positive Indicators:
              </h6>
              <ul className="list-disc pl-4 space-y-2 text-gray-800">
                <li>Positive NDVI trends</li>
                <li>Political stability</li>
                <li>Strong governance</li>
                <li>Supportive regulatory framework</li>
              </ul>
            </div>
            <p className="text-base leading-relaxed text-gray-800">
              Current conditions are conducive to successful outcomes.{" "}
              <a
                href="/learn-more"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Learn more →
              </a>
            </p>
          </div>
        </div>
      ),
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
              Analyze and predict potential risks for your environmental
              projects
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Location
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

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
                  minDate={new Date(2002, 0)}
                  maxDate={new Date(2050, 0)}
                  required
                />
              </div>
              <div className="space-y-4 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Project End Year
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={9}
                  placeholderText="Select End Year"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  minDate={new Date(2002, 0)}
                  maxDate={new Date(2050, 0)}
                  required
                />
              </div>

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

        {riskScore && (
          <div id="risk-results">
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
              <CardHeader className="bg-white/90 rounded-t-lg border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Risk Analysis Results
                  </CardTitle>
                  <button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      getRiskLevel(riskScore).bg
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getRiskLevel(riskScore).icon}
                      <span
                        className={`font-semibold text-lg ${
                          getRiskLevel(riskScore).color
                        }`}
                      >
                        {getRiskLevel(riskScore).level}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {riskScore}/10
                    </span>
                  </div>

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

                  <div className="mt-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      Risk Assessment Details
                    </h4>
                    {getRiskLevel(riskScore).message}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      Project Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Location
                        </p>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {selectedCountry}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Start Year
                        </p>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {startDate ? startDate.getFullYear() : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project End Year
                        </p>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {endDate ? endDate.getFullYear() : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Analysis Date
                        </p>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">
                      Recommendations
                    </h4>
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="ml-3 text-blue-900">
                            Regular monitoring of environmental indicators and
                            NDVI trends
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="ml-3 text-blue-900">
                            Implement robust risk mitigation strategies
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="ml-3 text-blue-900">
                            Maintain detailed documentation of all project
                            activities
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="ml-3 text-blue-900">
                            Regular stakeholder engagement and communication
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
