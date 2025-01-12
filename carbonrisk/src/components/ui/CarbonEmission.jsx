import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import ChartCard from "./ChartCard"; // Import ChartCard component

const CarbonEmission = ({ selectedCountry }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCountry || typeof selectedCountry !== "string") {
        console.error("Selected country is not valid:", selectedCountry);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch the region ID based on selectedCountry
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

        const { data: metricData, error } = await supabase
          .from("environment") // Replace with your actual table name
          .select("Year, carbon_emission") // Replace with the actual columns from your DB
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching Carbon Emission data:", error.message);
          setLoading(false);
          return;
        }

        // Format the data for ChartCard
        const formattedData = metricData.map((item) => ({
          year: item.Year,
          value: item.carbon_emission,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Unexpected error:", err);
      }

      setLoading(false);
    };

    if (selectedCountry) fetchData();
  }, [selectedCountry]);

  if (loading) return <p>Loading data...</p>;

  return (
    <ChartCard
      metricName="Carbon Emission"
      metricData={data}
      countryName={selectedCountry}
    />
  );
};

export default CarbonEmission;
