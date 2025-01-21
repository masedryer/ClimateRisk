"use client";

import React from "react";

export default function CarbonEmissionInput({ carbonEmission, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Carbon Emission (in tons)
      </label>
      <input
        type="number"
        value={carbonEmission}
        onChange={onChange}
        placeholder="Enter Carbon Emission"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}
