"use client";

import React from "react";
import Select from "react-select";

export default function CountrySelect({
  countries,
  selectedCountry,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Country
      </label>
      <Select
        options={countries}
        value={selectedCountry}
        onChange={onChange}
        placeholder="Select Country"
        className="rounded-lg"
      />
    </div>
  );
}
