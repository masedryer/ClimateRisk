// CountryList.jsx
"use client";

import React from "react";

const CountryList = ({ selectedCountry, selectedMetric }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Selected Country & Metric</h2>
      <ul className="list-disc list-inside">
        {/* Example: Only one item for now, labeled as 1 */}
        {selectedCountry && selectedMetric ? (
          <li>{`1. ${selectedCountry} - ${selectedMetric}`}</li>
        ) : (
          <li>No selection</li>
        )}
      </ul>
    </div>
  );
};

export default CountryList;
