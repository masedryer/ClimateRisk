"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import ChartCard from "./Chartcard"; // The ChartCard component

const PopulationDensity = ({ selectedCountry, restrictYAxis }) => {
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
        // 1) Fetch region ID
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

        // 2) Fetch Population Density data
        const { data: metricData, error } = await supabase
          .from("socio_economic")
          .select("Year, population_density")
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching Population Density data:", error.message);
          setLoading(false);
          return;
        }

        // 3) Format data for ChartCard
        const formattedData = metricData.map((item) => ({
          year: item.Year,
          value: item.population_density,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  if (loading) return <p>Loading data...</p>;

  // If we have no data, just render a fallback
  if (data.length === 0) {
    return <p>No Population Density data for {selectedCountry}.</p>;
  }

  // ----------------------------------------------------------------
  //  BUILD Y-AXIS SETTINGS
  // ----------------------------------------------------------------
  if (restrictYAxis) {
    //
    // LOCKED Y-axis: Population Density from 0.0 to 1.0 in steps of 0.2
    //
    const yAxisSettings = {
      min: 0,
      max: 1500,
      stepSize: 375,
    };
    return (
      <ChartCard
        metricName="Population Density"
        metricData={data}
        countryName={selectedCountry}
        yAxisSettings={yAxisSettings}
        yAxisLabel="Population Density (people/km²)"
      />
    );
  } else {
    //
    // AUTO-SCALE Y-axis: compute min and max from the actual data
    //
    let dataMin = Infinity;
    let dataMax = -Infinity;
    data.forEach((d) => {
      if (d.value < dataMin) dataMin = d.value;
      if (d.value > dataMax) dataMax = d.value;
    });

    // If data is all the same value, dataMin == dataMax;
    // add a small offset to avoid a flat line
    if (dataMin === dataMax) {
      dataMin -= 0.01;
      dataMax += 0.01;
    }

    // Add a margin around min and max so the line isn't pinned to edges
    const margin = (dataMax - dataMin) * 0.1;
    const dynamicMin = dataMin - margin;
    const dynamicMax = dataMax + margin;

    // We can also guess a stepSize. E.g., divide the range by 5
    // so we get ~5 steps on the y-axis:
    const stepSize = (dynamicMax - dynamicMin) / 5;

    const yAxisSettings = {
      min: dynamicMin,
      max: dynamicMax,
      stepSize: stepSize,
    };

    return (
      <ChartCard
        metricName="Population Density"
        metricData={data}
        countryName={selectedCountry}
        yAxisSettings={yAxisSettings}
        yAxisLabel="Population Density (people/km²)"
      />
    );
  }
};

export default PopulationDensity;