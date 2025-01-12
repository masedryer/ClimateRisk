"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// For Standard Mode
import CountrySelect from "@/components/ui/CountrySelect";
import MetricFilter from "@/components/ui/MetricFilter";

import CountryNDVI from "@/components/ui/CountryNDVI";
import ForestAreaPercent from "@/components/ui/ForestAreaPercent";
import ForestAreaKM from "@/components/ui/ForestAreaKM";
import MaxTemp from "@/components/ui/MaxTemp";
import MeanTemp from "@/components/ui/MeanTemp";
import MinTemp from "@/components/ui/MinTemp";
import CarbonEmission from "@/components/ui/CarbonEmission";
import TotalPercipitation from "@/components/ui/TotalPercipitation";
import CountryHDI from "@/components/ui/CountryHDI";
import CountryGDP from "@/components/ui/CountryGDP";
import CountryFDI from "@/components/ui/CountryFDI";
import DisasterCount from "@/components/ui/DisasterCount";
import PoliticalStability from "@/components/ui/PoliticalStability";
import PopulationDensity from "@/components/ui/PopulationDensity";
import CorruptionIndex from "@/components/ui/CorruptionIndex";

// For Top 5 bar chart
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sidebar open/closed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Standard vs. Top 5
  const [filterMode, setFilterMode] = useState("standard"); // default

  const handleModeChange = (mode) => {
    setFilterMode(mode);
  };

  // Standard mode states
  const [tempCountry, setTempCountry] = useState("");
  const [tempMetric, setTempMetric] = useState("NDVI");
  const [selections, setSelections] = useState([]);

  const handleAddSelection = () => {
    if (tempCountry && tempMetric && selections.length < 5) {
      setSelections([...selections, { country: tempCountry, metric: tempMetric }]);
    }
  };

  const handleRemoveSelection = (index) => {
    setSelections((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch countries
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase.from("region").select("CountryName");
        if (error) {
          console.error("Error fetching countries:", error.message);
        } else {
          const uniqueCountries = Array.from(new Set(data.map((c) => c.CountryName)));
          setCountries(uniqueCountries.map((c) => ({ value: c, label: c })));
        }
      } catch (err) {
        console.error("Unexpected error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Top 5 mode states
  const [isCountrySelected, setIsCountrySelected] = useState(true);
  const [regionChecked, setRegionChecked] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [top5Metric, setTop5Metric] = useState("");
  const [top5Highest, setTop5Highest] = useState(false);
  const [top5Lowest, setTop5Lowest] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [loadingTop5, setLoadingTop5] = useState(false);
  const [top5ChartData, setTop5ChartData] = useState(null);

  // Fetch regions (distinct)
  const [regionOptions, setRegionOptions] = useState([]);
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase.from("region").select("Region");
        if (error) {
          console.error("Error fetching regions:", error.message);
        } else {
          const unique = Array.from(new Set(data.map((r) => r.Region))).filter(Boolean);
          setRegionOptions(unique.map((r) => ({ value: r, label: r })));
        }
      } catch (err) {
        console.error("Unexpected error fetching regions:", err);
      }
    };
    fetchRegions();
  }, []);

  // Toggle highest/lowest
  const handleToggleHighest = () => {
    setTop5Highest(!top5Highest);
    if (!top5Highest) {
      setTop5Lowest(false);
    }
  };
  const handleToggleLowest = () => {
    setTop5Lowest(!top5Lowest);
    if (!top5Lowest) {
      setTop5Highest(false);
    }
  };

  // Country vs Region toggle
  const handleCountryClick = () => {
    setIsCountrySelected(true);
    setRegionChecked(false);
    setSelectedRegion("");
  };
  const handleRegionCheck = () => {
    const newVal = !regionChecked;
    setRegionChecked(newVal);
    setIsCountrySelected(!newVal);
    if (!newVal) {
      setSelectedRegion("");
    }
  };

  // Generate top 5
  const handleGenerateTop5 = async () => {
    if (!top5Metric || !selectedYear) return;
    if (!top5Highest && !top5Lowest) return;
    if (!isCountrySelected && !selectedRegion) return;

    setLoadingTop5(true);
    setTop5ChartData(null);

    try {
      // Decide which table to query
      const isEnvMetric = [
        "ndvi",
        "forest_area_percent",
        "forest_area_km",
        "max_temperature",
        "mean_temperature",
        "min_temperature",
        "carbon_emission",
        "total_percipitation"
      ].includes(top5Metric);

      const isSocioMetric = ["gdp", "hdi"].includes(top5Metric);

      let query;
      if (isEnvMetric) {
        query = supabase
          .from("environment")
          .select(`
            Year,
            ndvi,
            forest_area_percent,
            forest_area_km,
            max_temperature,
            mean_temperature,
            min_temperature,
            carbon_emission,
            total_percipitation,
            region ( CountryName, Region )
          `)
          .eq("Year", selectedYear);
      } else if (isSocioMetric) {
        query = supabase
          .from("socioeconomic")
          .select(`
            Year,
            gdp,
            hdi,
            fdi,
            disaster_count,
            political_stability,
            population_density,
            corruption_index,
            region ( CountryName, Region )
          `)
          .eq("Year", selectedYear);
      } else {
        // If neither environment nor socioeconomic, handle error or return.
        return;
      }

      // Add region filter if needed
      if (!isCountrySelected) {
        query = query.eq("region.Region", selectedRegion);
      }

      // top5Lowest => ascending = true, top5Highest => ascending = false
      const ascending = top5Lowest ? true : false;
      query = query.order(top5Metric, { ascending }).limit(5);

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching top 5 data:", error.message);
        setTop5ChartData(null);
      } else if (data && data.length > 0) {
        // Sort the data in memory (just to be sure we get exact top/bottom 5)
        const sorted = [...data].sort((a, b) => {
          const valA = a[top5Metric] ?? 0;
          const valB = b[top5Metric] ?? 0;
          return top5Highest ? valB - valA : valA - valB;
        });

        const labels = sorted.map((item, idx) => {
          const countryName = item.region?.CountryName || `Item ${idx + 1}`;
          return countryName;
        });
        const values = sorted.map((item) => item[top5Metric] ?? 0);

        const metricLabelMap = {
          ndvi: "NDVI",
          forest_area_percent: "Forest Area Percent",
          forest_area_km: "Forest Area KM",
          max_temperature: "Max Temperature",
          mean_temperature: "Mean Temperature",
          min_temperature: "Min Temperature",
          carbon_emission: "Carbon Emission",
          total_percipitation: "Total Percipitation",
          gdp: "GDP",
          hdi: "HDI",
          fdi: "FDI",
          disaster_count: "Disaster Count",
          political_stability: "Political Stability",
          population_density: "Population Density",
          corruption_index: "Corruption Index"
        };
        const niceMetricName = metricLabelMap[top5Metric] || top5Metric;

        let contextName = "All Countries";
        if (!isCountrySelected) {
          contextName = selectedRegion;
        }

        const datasetLabel = `${top5Highest ? "Top 5 Highest" : "Top 5 Lowest"
          } ${niceMetricName} for ${contextName} in ${selectedYear}`;

        setTop5ChartData({
          labels,
          datasets: [
            {
              label: datasetLabel,
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } else {
        setTop5ChartData(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setTop5ChartData(null);
    } finally {
      setLoadingTop5(false);
    }
  };

  const top5MetricOptions = [
    { value: "ndvi", label: "NDVI" },
    { value: "forest_area_percent", label: "Forest Area Percent" },
    { value: "forest_area_km", label: "Forest Area KM" },
    { value: "max_temperature", label: "Max Temperature" },
    { value: "mean_temperature", label: "Mean Temperature" },
    { value: "min_temperature", label: "Min Temperature" },
    { value: "carbon_emission", label: "Carbon Emission" },
    { value: "total_percipitation", label: "Total Percipitation" },
    { value: "gdp", label: "GDP" },
    { value: "hdi", label: "HDI" },
    { value: "fdi", label: "FDI" },
    { value: "disaster_count", label: "Disaster Count" },
    { value: "political_stability", label: "Political Stability" },
    { value: "population_density", label: "Population Density" },
    { value: "corruption_index", label: "Corruption Index" },
  ];

  const yearOptions = [2015, 2016, 2017, 2018, 2019, 2020, 2021];

  const canGenerate =
    top5Metric &&
    selectedYear &&
    (top5Highest || top5Lowest) &&
    (isCountrySelected || selectedRegion) &&
    !loadingTop5;

  // --------------------------------------------
  // RENDER
  // --------------------------------------------
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          absolute
          md:static
          top-0
          left-0
          w-64
          md:w-1/4
          bg-white
          shadow-md
          p-4
          h-screen
          md:h-auto
          transform
          transition-transform
          duration-300
          z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close / Toggle Button (visible on mobile) */}
        <div className="flex justify-end mb-2 md:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            {/* Replace with any icon you prefer, e.g. Heroicons or FontAwesome */}
            <span className="text-xl">⟩</span>
          </button>
        </div>

        <div className="flex items-center mb-4 flex-wrap">
          <h1 className="text-xl font-bold mr-4">Filters</h1>
          {/* Toggle Standard vs. Top 5 */}
          <label className="mr-4 flex items-center">
            <input
              type="checkbox"
              checked={filterMode === "standard"}
              onChange={() => handleModeChange("standard")}
            />
            <span className="ml-1">Standard</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterMode === "top5"}
              onChange={() => handleModeChange("top5")}
            />
            <span className="ml-1">Top 5</span>
          </label>
        </div>

        {/* -------------------------------------- */}
        {/* STANDARD MODE */}
        {/* -------------------------------------- */}
        {filterMode === "standard" && (
          <>
            <CountrySelect
              countries={countries}
              selectedCountry={tempCountry}
              onChange={(val) => setTempCountry(val?.value || "")}
            />
            <MetricFilter
              metrics={[
                "NDVI",
                "Forest Area Percent",
                "Forest Area KM",
                "Max Temperature",
                "Mean Temperature",
                "Min Temperature",
                "Carbon Emission",
                "Total Percipitation",
                "GDP",
                "HDI",
                "FDI",
                "Disaster Count",
                "Political Stability",
                "Population Density",
                "Corruption Index"
              ]}
              selectedMetric={tempMetric}
              onChange={setTempMetric}
            />

            <button
              onClick={handleAddSelection}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Add Selection
            </button>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Selections</h2>
              <ul className="list-disc list-inside">
                {selections.map((item, index) => (
                  <li key={index} className="mb-1">
                    {index + 1}. {item.country} - {item.metric}
                    <button
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleRemoveSelection(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {selections.length === 0 && <li>No selections yet.</li>}
              </ul>
            </div>
          </>
        )}

        {/* -------------------------------------- */}
        {/* TOP 5 MODE */}
        {/* -------------------------------------- */}
        {filterMode === "top5" && (
          <>
            {/* Country vs Region */}
            <div className="flex items-center mb-4">
              <button
                onClick={handleCountryClick}
                className={
                  isCountrySelected
                    ? "px-4 py-2 bg-green-600 text-white rounded"
                    : "px-4 py-2 bg-gray-200 text-black rounded"
                }
              >
                Country
              </button>
              <label className="ml-4 flex items-center">
                Region
                <input
                  type="checkbox"
                  checked={regionChecked}
                  onChange={handleRegionCheck}
                  className="ml-1"
                />
              </label>
            </div>

            {/* Region dropdown if region is checked */}
            {regionChecked && (
              <div className="mb-4">
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">-- Select a Region --</option>
                  {regionOptions.map((ro) => (
                    <option key={ro.value} value={ro.value}>
                      {ro.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Metric selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Metric:</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={top5Metric}
                onChange={(e) => setTop5Metric(e.target.value)}
              >
                <option value="">-- Select a Metric --</option>
                {top5MetricOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Highest/Lowest */}
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={top5Highest}
                  onChange={handleToggleHighest}
                />
                Top 5 Highest
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={top5Lowest}
                  onChange={handleToggleLowest}
                />
                Top 5 Lowest
              </label>
            </div>

            {/* Year selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Year:</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">-- Select a Year --</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateTop5}
              disabled={!canGenerate}
              className={
                canGenerate
                  ? "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  : "px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              }
            >
              {loadingTop5 ? "Loading..." : "Generate Results"}
            </button>
          </>
        )}
      </div>

      {/* The "Open Sidebar" button (only visible on mobile when sidebar is hidden) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 text-xl text-white md:hidden"
        // You might style this differently, e.g., a round button with a background
        >
          {/* Replace with an icon of your choice */}
          <span className="bg-gray-700 p-2 rounded">⟨</span>
        </button>
      )}

      {/* Main Content Area */}
      {/* Use flex-col to stack charts, let them fill space */}
      <div className="flex-1 p-8 flex flex-col gap-8 overflow-auto">
        {/* STANDARD MODE: vertical stack of charts */}
        {filterMode === "standard" &&
          selections.map((item, index) => (
            <div key={index} className="w-full">
              {item.metric === "NDVI" && item.country && (
                <CountryNDVI selectedCountry={item.country} />
              )}
              {item.metric === "Forest Area Percent" && item.country && (
                <ForestAreaPercent selectedCountry={item.country} />
              )}
              {item.metric === "Forest Area KM" && item.country && (
                <ForestAreaKM selectedCountry={item.country} />
              )}
              {item.metric === "Max Temperature" && item.country && (
                <MaxTemp selectedCountry={item.country} />
              )}
              {item.metric === "Mean Temperature" && item.country && (
                <MeanTemp selectedCountry={item.country} />
              )}
              {item.metric === "Min Temperature" && item.country && (
                <MinTemp selectedCountry={item.country} />
              )}
              {item.metric === "Carbon Emission" && item.country && (
                <CarbonEmission selectedCountry={item.country} />
              )}
              {item.metric === "Total Percipitation" && item.country && (
                <TotalPercipitation selectedCountry={item.country} />
              )}
              {item.metric === "GDP" && item.country && (
                <CountryGDP selectedCountry={item.country} />
              )}
              {item.metric === "HDI" && item.country && (
                <CountryHDI selectedCountry={item.country} />
              )}
              {item.metric === "FDI" && item.country && (
                <CountryFDI selectedCountry={item.country} />
              )}
              {item.metric === "Disaster Count" && item.country && (
                <DisasterCount selectedCountry={item.country} />
              )}
              {item.metric === "Political Stability" && item.country && (
                <PoliticalStability selectedCountry={item.country} />
              )}
              {item.metric === "Population Density" && item.country && (
                <PopulationDensity selectedCountry={item.country} />
              )}
              {item.metric === "Corruption Index" && item.country && (
                <CorruptionIndex selectedCountry={item.country} />
              )}
            </div>
          ))}

        {/* TOP 5 MODE: Bar chart (cover most of the screen) */}
        {filterMode === "top5" && (
          <div className="w-full h-[75vh]">
            {top5ChartData ? (
              <div className="bg-white p-4 rounded shadow w-full h-full">
                <Bar
                  data={top5ChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true },
                    },
                    plugins: {
                      legend: { position: "top" },
                      title: {
                        display: true,
                        text: top5ChartData.datasets[0]?.label,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {loadingTop5 ? "Loading..." : "No Top 5 data yet or no results found."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
