import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import ChartCard from "./Chartcard"; // Import ChartCard component

const DisasterCount = ({ selectedCountry }) => {
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
          .from("socioeconomic") // Replace with your actual table name
          .select("Year, disaster_count") // Replace with the actual columns from your DB
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching Disaster Count data:", error.message);
          setLoading(false);
          return;
        }

        // Format the data for ChartCard
        const formattedData = metricData.map((item) => ({
          year: item.Year,
          value: item.disaster_count,
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
      metricName="Disaster count"
      metricData={data}
      countryName={selectedCountry}
    />
  );
};

export default DisasterCount;
