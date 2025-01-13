// ForestAreaKM Component (e.g., ForestAreaKM.jsx)
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ChartCard from "./Chartcard";

const ForestAreaKM = ({ selectedCountry }) => {
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

        // Fetch Forest Area KM data
        const { data: metricData, error } = await supabase
          .from("environment")
          .select("Year, forest_area_km") // Ensure this column exists
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching Forest Area KM data:", error.message);
          setLoading(false);
          return;
        }

        // Format the data for ChartCard
        const formattedData = metricData.map((item) => ({
          year: item.Year,
          value: item.forest_area_km,
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
      metricName="Forest Area (KM)"
      metricData={data}
      countryName={selectedCountry}
    />
  );
};

export default ForestAreaKM;
