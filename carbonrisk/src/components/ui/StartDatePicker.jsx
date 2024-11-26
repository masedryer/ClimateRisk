"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function StartDatePicker({ startDate, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Year
      </label>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        placeholderText="Select Year"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        showYearPicker
        dateFormat="yyyy"
      />
    </div>
  );
}
