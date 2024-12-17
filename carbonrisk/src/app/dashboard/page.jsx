"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ChartCard from "@/components/ui/Chartcard";

const Dashboard = () => {
  const [ndviData, setNdviData] = useState([]);
  const [countryName, setCountryName] = useState(""); // Default selected country
  const [countries, setCountries] = useState([]); // List of countries for the dropdown

  // Fetch countries for dropdown
  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("region")
        .select("CountryName");
      if (error) {
        console.error("Error fetching countries:", error.message);
      } else {
        setCountries(data.map((item) => item.CountryName));
      }
    } catch (err) {
      console.error("Unexpected error fetching countries:", err);
    }
  };

  // Fetch NDVI data for selected country
  const fetchNDVIData = async (selectedCountry) => {
    try {
      // Fetch the country_id based on selected country
      const { data: regionData, error: regionError } = await supabase
        .from("region")
        .select("id")
        .eq("CountryName", selectedCountry);

      if (regionError) {
        console.error("Error fetching region data:", regionError.message);
        setNdviData([]);
        return;
      }

      const countryId = regionData[0]?.id;

      if (!countryId) {
        console.error("Country ID not found");
        setNdviData([]);
        return;
      }

      // Fetch NDVI data for the selected country using the country_id
      const { data, error } = await supabase
        .from("yearlydata_test")
        .select("NDVI, Year")
        .eq("country_id", countryId);

      if (error) {
        console.error("Error fetching NDVI data:", error.message);
        setNdviData([]);
      } else {
        // Format data to match chart expectations
        const formattedData = data.map((item) => ({
          NDVI: item.NDVI,
          Year: item.Year,
        }));
        setNdviData(formattedData);
      }
    } catch (err) {
      console.error("Unexpected error fetching NDVI data:", err);
      setNdviData([]);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countryName) {
      fetchNDVIData(countryName);
    }
  }, [countryName]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="country"
        >
          Select Country
        </label>
        <select
          id="country"
          className="p-2 border border-gray-300 rounded w-full"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        >
          <option value="">-- Select a Country --</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <ChartCard ndviData={ndviData} countryName={countryName} />
    </div>
  );
};

export default Dashboard;
