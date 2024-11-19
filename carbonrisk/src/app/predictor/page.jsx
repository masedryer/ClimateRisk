"use client";
// Import necessary libraries
import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from "react-spinners"; // For loading spinner

// Status options
const statusOptions = [
  {
    label: "Crediting Period Renewal and Verification Approval Requested",
    value: "Crediting Period Renewal and Verification Approval Requested",
  },
  { label: "Inactive", value: "Inactive" },
  { label: "Late to verify", value: "Late to verify" },
  {
    label: "On Hold - see notification letter",
    value: "On Hold - see notification letter",
  },
  { label: "Registered", value: "Registered" },
  {
    label: "Registration and verification approval request denied",
    value: "Registration and verification approval request denied",
  },
  {
    label: "Registration and verification approval requested",
    value: "Registration and verification approval requested",
  },
  {
    label: "Registration request denied",
    value: "Registration request denied",
  },
  { label: "Registration requested", value: "Registration requested" },
  { label: "Rejected by Administrator", value: "Rejected by Administrator" },
  { label: "Under development", value: "Under development" },
  { label: "Under validation", value: "Under validation" },
  {
    label: "Units Transferred from Approved GHG Program",
    value: "Units Transferred from Approved GHG Program",
  },
  {
    label: "Verification approval request denied",
    value: "Verification approval request denied",
  },
  {
    label: "Verification approval requested",
    value: "Verification approval requested",
  },
  { label: "Withdrawn", value: "Withdrawn" },
];

export default function Predictor() {
  const [countries, setCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [carbonEmission, setCarbonEmission] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(null);

  // Fetch country data
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call delay
    setTimeout(() => {
      setOutput("75% risk"); // Placeholder output
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Project Risk Predictor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(option) => setSelectedStatus(option)}
              placeholder="Select Status"
              className="rounded-lg"
            />
          </div>

          {/* Country Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading countries...</p>
            ) : (
              <Select
                options={countries}
                value={selectedCountry}
                onChange={(option) => setSelectedCountry(option)}
                placeholder="Select Country"
                className="rounded-lg"
              />
            )}
          </div>

          {/* Date Pickers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Period Start
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Period End
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
          </div>

          {/* Carbon Emission Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbon Emission (in tons)
            </label>
            <input
              type="number"
              value={carbonEmission}
              onChange={(e) => setCarbonEmission(e.target.value)}
              placeholder="Enter Carbon Emission"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
          </div>

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
