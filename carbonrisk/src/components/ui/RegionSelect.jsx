"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Select from "react-select";

const RegionSelect = ({ selectedRegion, onChange }) => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from("region")         // Table name
          .select("Region");      // Column name

        if (error) {
          console.error("Error fetching regions:", error.message);
        } else {
          const regionOptions = data.map((item) => ({
            value: item.Region,
            label: item.Region,
          }));
          setRegions(regionOptions);
        }
      } catch (err) {
        console.error("Unexpected error fetching regions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) return <p>Loading regions...</p>;

  return (
    <Select
      options={regions}
      value={regions.find((r) => r.value === selectedRegion) || null}
      onChange={onChange} // e.g. (selected) => onChange(selected?.value)
      isClearable
      placeholder="Select a Region..."
    />
  );
};

export default RegionSelect;
