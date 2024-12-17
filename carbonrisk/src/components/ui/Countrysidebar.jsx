"use client";
import React from "react";

const CountrySidebar = ({
  searchTerm,
  setSearchTerm,
  filteredCountries,
  handleSelectCountry,
  showTooltip,
  countryList,
  handleRemoveCountry,
}) => {
  return (
    <div className="w-1/4 p-4 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-2">Select Country</h2>
      <input
        type="text"
        placeholder="Search for a country"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="max-h-64 overflow-auto">
        {filteredCountries.map((country, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleSelectCountry(country)}
          >
            {country}
          </div>
        ))}
      </div>
      {showTooltip && (
        <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
          You can select only up to 5 countries.
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selected Countries</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {countryList.map((country, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
            >
              {country}
              <button
                className="ml-2 text-red-500"
                onClick={() => handleRemoveCountry(country)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySidebar;
