"use client";

import React from "react";
import Select from "react-select";

export default function CountrySelect({
  countries,
  selectedCountry,
  onChange,
}) {
  // Find the matching option from the list using the selectedCountry value.
  const selectedOption = countries.find(
    (option) => option.value === selectedCountry
  ) || null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Country
      </label>
      <Select
        options={countries}
        value={selectedOption}
        onChange={onChange}
        placeholder="Select Country"
        className="rounded-lg"
      />
    </div>
  );
}