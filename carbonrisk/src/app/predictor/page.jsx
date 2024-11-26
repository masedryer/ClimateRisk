"use client";

import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import CountrySelect from "@/components/ui/CountrySelect";
import StartDatePicker from "@/components/ui/StartDatePicker";
import CarbonEmissionInput from "@/components/ui/CarbonEmission";

// Allowed countries list
const allowedCountries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas, The",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Channel Islands",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Dem. Rep.",
  "Congo, Rep.",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt, Arab Rep.",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "Gabon",
  "Gambia, The",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Rep.",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Dem. People's Rep.",
  "Korea, Rep.",
  "Kuwait",
  "Kyrgyz Republic",
  "Lao PDR",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia, Fed. Sts.",
  "Moldova",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovak Republic",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Kitts and Nevis",
  "St. Lucia",
  "St. Martin (French part)",
  "St. Vincent and the Grenadines",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkiye",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",

  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela, RB",
  "Viet Nam",
  "Virgin Islands (U.S.)",
  "West Bank and Gaza",
  "Yemen, Rep.",
  "Zambia",
  "Zimbabwe",
];

export default function Predictor() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(null);

  // Prepare country options for dropdown
  useEffect(() => {
    const countryOptions = allowedCountries.map((country) => ({
      label: country,
      value: country,
    }));
    setCountries(countryOptions);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for API request
    const requestData = {
      Year: startDate ? startDate.getFullYear() : 2018,
      Country_Name: selectedCountry ? selectedCountry.value : "Albania",
      NDVI: 0.53555,
      MtCo2: parseFloat(carbonEmission),
      NightLight: 1.21388,
      Land_Use_Tgc: -0.28354,
      percipitation_winter: 450.63,
      percipitation_summer: 188.06,
      percipitation_spring: 227.6,
      percipitation_autumn: 216.03,
      Max_temperature: 18.07,
      Mean_temperature: 13.03,
      Min_temperature: 8.02,
    };

    try {
      const response = await fetch("https://ml-model-v1.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setOutput(result.prediction_label); // Update this according to the actual response format
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Project Risk Predictor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Country Select */}
          <CountrySelect
            countries={countries}
            selectedCountry={selectedCountry}
            onChange={(option) => setSelectedCountry(option)}
          />

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
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Predict Risk"}
          </button>
        </form>

        {/* Loading and Output */}
        <div className="mt-6 text-center">
          {isSubmitting && <ClipLoader size={24} color="#2563eb" />}
          {output && !isSubmitting && (
            <p className="text-lg font-semibold text-green-600 mt-4">
              Output: {output}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
