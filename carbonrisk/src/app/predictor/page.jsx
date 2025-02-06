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
  const [imageUrl, setImageUrl] = useState("");
  const [riskFactors, setRiskFactors] = useState([]);
  const [risktype, setRiskType] = useState([]);

  
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
  useEffect(() => {
    if (riskScore !== null) {
      if (riskScore <= 4) {
        setRiskType("Low Risk");
      } else if (riskScore > 4 && riskScore <= 7) {
        setRiskType("Moderate Risk");
      } else if (riskScore >= 8) {
        setRiskType("High Risk");
      }
    }
  }, [riskScore]); 
  

  // Fetch country ID based on country name
const fetchCountryId = async (countryName) => {
  try {
    const { data, error } = await supabase
      .from("region")
      .select("id")
      .eq("CountryName", countryName)
      .single();

    if (error) {
      console.error("Error fetching country ID:", error.message);
      return null;
    }
    console.log(data.id);
    return data.id;

  } catch (err) {
    console.error("Unexpected error fetching country ID:", err);
    return null;
  }
};

// Fetch risk score based on country ID and date range
const fetchRiskScoreFromDB = async (countryId, startYear, endYear) => {
  try {
    const { data, error } = await supabase
      .from("prediction")
      .select("adjusted_risk_score")
      .eq("country_id", countryId)
      .gte("Year", startYear)
      .lte("Year", endYear);

    if (error) {
      console.error("Error fetching prediction data:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("No risk data found for the selected period.");
      return null;
    }

    // Calculate and return the average risk score
    const totalScore = data.reduce((sum, { adjusted_risk_score }) => sum + adjusted_risk_score, 0);
    console.log(Math.round(totalScore / data.length));
    return Math.round(totalScore / data.length);
  } catch (err) {
    console.error("Unexpected error fetching risk score:", err);
    return null;
  }
};
const fetchRankingData = async (countryName) => {
  console.log(countryName)
  try {
    const { data, error } = await supabase
      .from("feature_ranking")
      .select(
        "ndvi_rank, forest_area_percentage_rank, forest_area_km_rank, political_stability_rank, fdi_rank, hdi_rank, population_density_rank, carbon_emission_rank, tree_cover_loss_rank, gross_carbon_emission_rank, disaster_count_rank, corruption_index_rank"
      )
      .eq("CountryName_x", countryName);

    console.log(`🔍 Fetching ranking data for: ${countryName}`);
    console.log("Raw API Response:", data);

    if (error) {
      console.error("❌ Error fetching rankings:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No ranking data found for ${countryName}`);
      return null;
    }

    // Rename the columns
    const renamedData = data.map((item) => ({
      ...item,
      foreign_direct_investment_rank: item.fdi_rank, // Rename fdi_rank
      human_development_index_rank: item.hdi_rank, // Rename hdi_rank
    }));

    // Remove old column names
    renamedData.forEach((item) => {
      delete item.fdi_rank;
      delete item.hdi_rank;
    });

    console.log("✅ Final Data:", renamedData[0]);
    return renamedData[0]; // Return modified data
  } catch (err) {
    console.error("🔥 Unexpected error fetching rankings:", err);
    return null;
  }
};


// Process ranking data into a sorted array
const processRankingData = (rankingData, riskScore) => {
  if (!rankingData) return [];

  const { Region, CountryName_y, ...rankings } = rankingData;

  

  const formattedData = Object.entries(rankings)
  .map(([key, value]) => ({
    name: key.replace("_rank", ""), 
    value: value,
  }))
  .sort((a, b) => a.value - b.value);

  console.log("✅ Processed Ranking Data:", formattedData);


  let selectedFactors = [];
  if (riskScore >= 8) {
    selectedFactors = formattedData.slice(-3);
  } else if (riskScore >= 5) {
    selectedFactors = [...formattedData.slice(0, 2), formattedData.slice(-1)[0]];
  } else {
    selectedFactors = formattedData.slice(0, 3);
  }

  console.log(selectedFactors);
  const factorNames = selectedFactors.map(factor => factor.name);
  return selectedFactors.length ? selectedFactors : [];
};




// Main function to fetch risk score and ranking
const fetchRiskData = async () => {
  if (!selectedCountry || !startDate || !endDate) {
    alert("Please select a country and valid start and end years.");
    return;
  }

  try {
    setIsSubmitting(true);

    // Step 1: Fetch Country ID
    const countryId = await fetchCountryId(selectedCountry);
    if (!countryId) throw new Error("Country not found in the database.");

    // Step 2: Fetch Risk Score
    const riskScore = await fetchRiskScoreFromDB(
      countryId,
      startDate.getFullYear(),
      endDate.getFullYear()
    );
    if (riskScore === null) throw new Error("No risk data available for the selected period.");

    setRiskScore(riskScore);
    console.log(riskScore)
    // Step 3: Fetch Ranking Data
    console.log("Fetching ranking data")
    const rankingData = await fetchRankingData(selectedCountry);

    console.log("Process ranking data")
    const selectedFactors = processRankingData(rankingData, riskScore);

    console.log("Update ranking data")
    setRiskFactors(selectedFactors);

  } catch (error) {
    console.error(error.message);
    alert("An error occurred while fetching risk data. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



  const fetchImageUrl = async (countryName) => {
    try {

      const { data, error } = await supabase.storage
        .from("ndvi_image")
        .createSignedUrl(`${countryName}.png`, 60 * 60 * 24); // 24-hour validity

      if (error) {
        console.error("Error generating signed URL:", error.message);
        setImageUrl(""); // Reset URL on error
        return;
      }

      setImageUrl(data.signedUrl); // Set signed URL on success
    } catch (err) {
      console.error("Unexpected error fetching image:", err);
      setImageUrl("");
    }
  };

  const listFiles = async () => {
    const { data, error } = await supabase.storage.from("ndvi_image").list(); // List all files in the bucket root

    if (error) {
      console.error("Error listing files:", error.message);
      return;
    }

    console.log("Files in bucket:", data);
  };

  listFiles();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setIsSubmitting(true);
  
      await fetchRiskData();
  
      await fetchImageUrl(selectedCountry);
  
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      const imgHeight1 = (canvas1.height * pageWidth) / (canvas1.width*1.2);

      // Add first page
      pdf.addImage(imgData1, "PNG", 0, 0, pageWidth, imgHeight1);

      // Add explanation page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Risk Rating and Interpretation", 20, 20);

      pdf.setFontSize(14);
      pdf.text(
        [
          "The risk rating falls under four distinct ranges:",
          "• 1-4: The project is highly achievable with minimal barriers",
          "• 4-7: The project is moderately achievable",
          "• 8-10: The project is challenging to achieve",
        ],
        20,
        40
      );

      pdf.text("Risk Factors That Affect Prediction Results:", 20, 90);
      pdf.setFontSize(8);

      pdf.text(
        [
          "Environmental Risks",
          "   • NDVI: Indicates vegetation health and density. Higher NDVI values reflect \nhealthier ecosystems that can store more carbon.",
          "   • Forest Area Percentage: Highlights the proportion of land under forest cover.\n A higher percentage means more potential for conservation",
          "     and carbon storage",
          "   • Forest Area Km:Larger forest areas provide greater potential for large-scale\n REDD+ projects, making conservation efforts impactful",
          "   • Carbon emissions: High emissions due to deforestation indicate priority regions \nfor REDD+ intervention to mitigate carbon release",
          "   • Tree Cover Loss :Areas with high recent tree cover loss may be at higher risk \nof continued deforestation due to factors like illegal logging,",
          "     agricultural expansion, or urban development. This can affect the long-term viability of reforestation efforts.",
          "   • Gross Carbon Emission(%) :High gross carbon emissions contribute to global warming,\n which can lead to changes in local weather patterns, ",
          "     including more frequent droughts, heatwaves, or unseasonal weather events. ",


          "Socialeconomic Risks",
          "   • HDI: Measures a country's development level, including health, education, and income.\n Higher HDI often correlates with better governance and ",
          "     capacity to implement sustainable forest management practices.",
          "   • FDI: Investment made by another country's company or individuals. Higher FDI means that more confidence on getting invested by other countries",
          "   • Disaster Count: Natural disaster like drought, wildfires, extreme temperature, \ninfestation will not only affect the the tree survivalbility ",
          "     and also cause  increase the risk of business disruptions, reducing investor confidence and deterring long-term economic development",
          "   • population_density: Higher population density often increases deforestation pressure\n due to agriculture or urbanization",
          "   • Political stability :Stable government able to provide policy consistency, effective\n enforcement, financial incentives, and opportunities ",
          "     for collaboration. ",
          "   • Corruption Index: Transparency in governance ensures the successful implementation of\n REDD+ and reforestation projects.",
          
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

  

  const getRiskLevel = (score, riskFactors) => {
    let performanceFactors = [];
    if (!Array.isArray(riskFactors) || riskFactors.length === 0) {
      console.warn("Invalid riskFactors, returning default value:", riskFactors);
      return {
        level: "Unknown",
        color: "text-gray-600",
        bg: "bg-gray-100",
        icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
        message: <p className="text-gray-600">No data available.</p>,
      };
    }
  
    if (riskFactors.length > 0) {
      // Sort risk factors from best to worst (ascending order)
      const sortedFactors = [...riskFactors].sort((a, b) => a.value - b.value);
  
      if (score <=4) {
           // Low risk: Highlight 3 best factors as "Excellent performance in"
           performanceFactors = sortedFactors.slice(0, 3).map(factor => ({
            text: `Excellent performance in ${factor.name.replace(/_/g, " ")}`,
            color: "text-green-700",
        }));
      } else if (score > 4 && score < 8) {
        // Moderate risk: First 2 best factors "Excellent performance in", third best factor "Low performance in"
        performanceFactors = [
          ...sortedFactors.slice(0, 2).map(factor => ({
            text: `Excellent performance in ${factor.name.replace(/_/g, " ")}`,
            color: "text-yellow-700",
          })),
          {
            text: `Low performance in ${sortedFactors[2].name.replace(/_/g, " ")}`,
            color: "text-yellow-900",
          },
        ];
      } else {
    

           // High risk: Highlight bottom 3 factors as "Low performance in"
        performanceFactors = sortedFactors.slice(-3).map(factor => ({
          text: `Low performance in ${factor.name.replace(/_/g, " ")}`,
          color: "text-red-700",
        }));
      }
    }
  
    let riskLevel = {}
    if(score<=4){
      
    riskLevel={level: "Low Risk",
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
              <h6 className="font-semibold text-green-800 mb-2">Key Performance Factors:</h6>
              <ul className="list-disc pl-4 space-y-2 text-gray-800">
                {performanceFactors.map((factor, index) => (
                  <li key={index} className={factor.color}>{factor.text}</li>
                ))}
              </ul>
            </div>
           
          </div>
        </div>
      ),
    };
    }
     else if (score > 4 && score < 8) {
      riskLevel = {
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
                  {performanceFactors.map((factor, index) => (
                    <li key={index} className={factor.color}>{factor.text}</li>
                  ))}
                </ul>
              </div>
             
            </div>
          </div>
        ),
      };
    }
  
    else if (score >= 8) {
      riskLevel = {
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
                  {performanceFactors.map((factor, index) => (
                    <li key={index} className={factor.color}>{factor.text}</li>
                  ))}
                </ul>
              </div>
   
            </div>
          </div>
        ),
      };
    } 
    return riskLevel;

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
                  onChange={(date) => {
                    if (startDate && date < startDate) {
                      alert("End year cannot be before start year.");
                      return;
                    }
                    setEndDate(date);
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={9}
                  placeholderText="Select End Year"
                  className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    !startDate ? "cursor-not-allowed bg-gray-100" : ""
                  }`}
                  minDate={startDate || new Date(2002, 0)} // Prevents selection before startDate
                  maxDate={new Date(2050, 0)}
                  required
                  disabled={!startDate} // Disable end year until start year is selected
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
                        {(risktype)}
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
                    {getRiskLevel(riskScore, riskFactors).message}
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
        {imageUrl && (
          
          <Card id="ndvi-card" className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-white/90 rounded-t-lg border-b pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                NDVI Image for {selectedCountry}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {/* Display Image */}
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={imageUrl}
                    alt={`${selectedCountry} NDVI`}
                    className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
                  />
                </a>
                <div className="space-y-2">
 

  <div
    className="h-3 rounded-full transition-all duration-500 border border-black"
    style={{
      width: "100%",
      background: "linear-gradient(to right, white, lightgreen, green, #9966CC)",
    }}
  ></div>
   <div className="flex justify-between text-sm font-semibold text-gray-700">
    <span>High Risk</span>
    <span>Low Risk</span>
  </div>
  <h3 className="text-lg font-semibold text-gray-900">Legend</h3>
          <div className="grid grid-cols-2 gap-4"> {/* Use grid for layout */}
            <div>
              <div className="bg-[#9966CC] w-6 h-6 inline-block mr-2 rounded border border-black"></div> {/* Example color */}
              Extremely Healthy Vegetation
            </div>
            <div>
              <div className="bg-[#66B366]   w-6 h-6 inline-block mr-2 rounded border border-black"></div> {/* Example color */}
              Healthy Vegetation
            </div>
            <div>
              <div className="bg-[#E0FFE0] w-6 h-6 inline-block mr-2 rounded border border-black"></div> {/* Example color */}
              Stressed Vegetation
            </div>        
            <div>
              <div className="bg-[#ffffff] w-6 h-6 inline-block mr-2 rounded border border-black"></div> {/* Example color */}
              Sparse Vegetation
            </div>  
                </div>            </div>



                {/* Download Button */}
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = `${selectedCountry}_NDVI.png`;
                    link.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md"
                >
                  Enlarge Image
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
    </div>
  );
}
