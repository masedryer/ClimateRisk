"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import ChartCard from "./Chartcard"; // The ChartCard component

const TreeCoverLoss = ({ selectedCountry, restrictYAxis }) => {
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

        // 2) Fetch Tree Cover Loss data
        const { data: metricData, error } = await supabase
          .from("environmental2")
          .select("Year, tree_cover_loss")
          .eq("country_id", countryId);

        if (error) {
          console.error("Error fetching Tree Cover Loss data:", error.message);
          setLoading(false);
          return;
        }

        // 3) Format data for ChartCard
        const formattedData = metricData.map((item) => ({
          year: item.Year,
          value: item.tree_cover_loss,
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
    return <p>No Tree Cover Loss data for {selectedCountry}.</p>;
  }

  // ----------------------------------------------------------------
  //  BUILD Y-AXIS SETTINGS
  // ----------------------------------------------------------------
  if (restrictYAxis) {
    //
    // LOCKED Y-axis: Tree Cover Loss from 0.0 to 1.0 in steps of 0.2
    //
    const yAxisSettings = {
      min: 0,
      max: 6000000,
      stepSize: 1500000,
    };
    return (
      <ChartCard
        metricName="Tree Cover Loss"
        metricData={data}
        countryName={selectedCountry}
        yAxisSettings={yAxisSettings}
        yAxisLabel="Tree Cover Loss (Mha)"
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
        metricName="Tree Cover Loss"
        metricData={data}
        countryName={selectedCountry}
        yAxisSettings={yAxisSettings}
        yAxisLabel="Tree Cover Loss (Mha)"
      />
    );
  }
};

export default TreeCoverLoss;