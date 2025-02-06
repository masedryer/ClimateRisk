import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Adjust path as needed
import ChartCard from "./ChartCard";

const CountryNDVI = ({ selectedCountry }) => {
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNDVI = async () => {
      setLoading(true);
      try {
        // Fetch the country_id from the region table based on selectedCountry
        const { data: regionData, error: regionError } = await supabase
          .from("region")
          .select("id")
          .eq("CountryName", selectedCountry);

        if (regionError) {
          console.error("Error fetching region data:", regionError.message);
          setLoading(false);
          return;
        }

        const countryId = regionData[0]?.id;

        if (!countryId) {
          console.error("Country ID not found");
          setLoading(false);
          return;
        }

        // Fetch the NDVI data from yearlydata_test using the countryId
        const { data, error } = await supabase
          .from("yearlydata_test")
          .select('"NDVI", "Year", "CountryName"')
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching NDVI data:", error.message);
          setLoading(false);
          return;
        }

        setNdviData(data);
      } catch (err) {
        console.error("Unexpected error fetching NDVI data:", err);
      }
      setLoading(false);
    };

    if (selectedCountry) fetchNDVI();
  }, [selectedCountry]);

  if (loading) return <p>Loading data...</p>;

  return <ChartCard countryName={selectedCountry} ndviData={ndviData} />;
};

export default CountryNDVI;
