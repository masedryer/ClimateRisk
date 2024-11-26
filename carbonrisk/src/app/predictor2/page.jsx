"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from "react-spinners"; // For loading spinner

export default function FormComponent() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const countryOptions = data.map((country) => ({
          label: country.name.common,
          value: country.name.common,
        }));
        setCountries(countryOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setOutput(result.prediction_label);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="country">Country</label>
          {loading ? (
            <ClipLoader size={24} />
          ) : (
            <Select
              options={countries}
              onChange={(option) => setSelectedCountry(option)}
              placeholder="Select Country"
              className="rounded-lg"
            />
          )}
        </div>
        <div>
          <label htmlFor="startDate">Credit Period Start</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select Start Date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            showYearDropdown
            dateFormat="yyyy"
          />
        </div>
        <div>
          <label htmlFor="carbonEmission">Carbon Emission (in tons)</label>
          <input
            type="text"
            id="carbonEmission"
            value={carbonEmission}
            onChange={(e) => setCarbonEmission(e.target.value)}
            placeholder="Enter Carbon Emission"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {isSubmitting ? "Processing..." : "Predict Risk"}
        </button>
      </form>

      {isSubmitting && <ClipLoader size={24} />}
      {output && !isSubmitting && (
        <div className="mt-4">
          <h3>Output: {output}</h3>
        </div>
      )}
    </div>
  );
}
