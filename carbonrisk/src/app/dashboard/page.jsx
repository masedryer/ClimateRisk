"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Standard Mode
import CountrySelect from "@/components/ui/CountrySelect";
import MetricFilter from "@/components/ui/MetricFilter";

// Example metric components
import CountryNDVI from "@/components/ui/CountryNDVI";
import ForestAreaPercent from "@/components/ui/ForestAreaPercent";
import ForestAreaKM from "@/components/ui/ForestAreaKM";
import CarbonEmission from "@/components/ui/CarbonEmission";
import CountryHDI from "@/components/ui/CountryHDI";
import CountryFDI from "@/components/ui/CountryFDI";
import DisasterCount from "@/components/ui/DisasterCount";
import PoliticalStability from "@/components/ui/PoliticalStability";
import PopulationDensity from "@/components/ui/PopulationDensity";
import CorruptionIndex from "@/components/ui/CorruptionIndex";
import GrossCarbonEmission from "@/components/ui/GrossCarbonEmission";
import TreeCoverLoss from "@/components/ui/TreeCoverLoss";

// Top 5 bar chart
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
  // ---------------------------------------------------------------
  // FILTER OPEN/CLOSE (for MOBILE)
  // ---------------------------------------------------------------
  // Desktop: Filter is always visible on the left
  // Mobile: If false => the filter slides up off screen
  const [filterOpen, setFilterOpen] = useState(true);

  // ---------------------------------------------------------------
  // STANDARD vs. TOP 5
  // ---------------------------------------------------------------
  const [filterMode, setFilterMode] = useState("standard");

  // Lock Scale / See Trend
  const [restrictYAxis, setRestrictYAxis] = useState(true);

  // ---------------------------------------------------------------
  // STANDARD MODE STATES
  // ---------------------------------------------------------------
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

  const handleToggleYAxis = () => {
    setRestrictYAxis((prev) => !prev);
  };

  // ---------------------------------------------------------------
  // FETCH COUNTRIES
  // ---------------------------------------------------------------
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase.from("region").select("CountryName");
        if (error) {
          console.error("Error fetching countries:", error.message);
        } else if (data) {
          const uniqueCountries = Array.from(new Set(data.map((c) => c.CountryName)));
          setCountries(uniqueCountries.map((c) => ({ value: c, label: c })));
        }
      } catch (err) {
        console.error("Unexpected error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // ---------------------------------------------------------------
  // TOP 5 MODE STATES
  // ---------------------------------------------------------------
  const [isCountrySelected, setIsCountrySelected] = useState(true);
  const [regionChecked, setRegionChecked] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [top5Metric, setTop5Metric] = useState("");
  const [top5Highest, setTop5Highest] = useState(false);
  const [top5Lowest, setTop5Lowest] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [loadingTop5, setLoadingTop5] = useState(false);
  const [top5ChartData, setTop5ChartData] = useState(null);

  // ---------------------------------------------------------------
  // FETCH REGIONS
  // ---------------------------------------------------------------
  const [regionOptions, setRegionOptions] = useState([]);
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase.from("region").select("Region");
        if (error) {
          console.error("Error fetching regions:", error.message);
        } else if (data) {
          const unique = Array.from(new Set(data.map((r) => r.Region))).filter(Boolean);
          setRegionOptions(unique.map((r) => ({ value: r, label: r })));
        }
      } catch (err) {
        console.error("Unexpected error fetching regions:", err);
      }
    };
    fetchRegions();
  }, []);

  // ---------------------------------------------------------------
  // TOGGLE HIGHEST/LOWEST
  // ---------------------------------------------------------------
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

  // ---------------------------------------------------------------
  // COUNTRY vs REGION
  // ---------------------------------------------------------------
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

  // ---------------------------------------------------------------
  // GENERATE TOP 5
  // ---------------------------------------------------------------
  const handleGenerateTop5 = async () => {
    if (!top5Metric || !selectedYear) return;
    if (!top5Highest && !top5Lowest) return;
    if (!isCountrySelected && !selectedRegion) return;

    setLoadingTop5(true);
    setTop5ChartData(null);

    try {
      const isEnvMetric = [
        "ndvi",
        "forest_area_percentage",
        "forest_area_km",
        "carbon_emission",
        "tree_cover_loss",
        "gross_carbon_emission",
      ].includes(top5Metric);

      const isSocioMetric = [
        "hdi",
        "fdi",
        "disaster_count",
        "political_stability",
        "population_density",
        "corruption_index",
      ].includes(top5Metric);

      let query;
      if (isEnvMetric) {
        query = supabase
          .from("environmental2")
          .select(`
            Year,
            ndvi,
            forest_area_percentage,
            forest_area_km,
            carbon_emission,
            gross_carbon_emission,
            tree_cover_loss,
            region ( CountryName, Region )
          `)
          .eq("Year", selectedYear);
      } else if (isSocioMetric) {
        query = supabase
          .from("socio_economic")
          .select(`
            Year,
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
        return;
      }

      if (!isCountrySelected) {
        query = query.eq("region.Region", selectedRegion);
      }

      const ascending = top5Lowest ? true : false;
      query = query.order(top5Metric, { ascending }).limit(5);

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching top 5 data:", error.message);
        setTop5ChartData(null);
      } else if (data && data.length > 0) {
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
          forest_area_percentage: "Forest Area Percent",
          forest_area_km: "Forest Area KM",
          carbon_emission: "Carbon Emission",
          hdi: "HDI",
          fdi: "FDI",
          disaster_count: "Disaster Count",
          political_stability: "Political Stability",
          population_density: "Population Density",
          corruption_index: "Corruption Index",
          tree_cover_loss: "Tree Cover Loss",
          gross_carbon_emission: "Gross Carbon Emission"
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
    { value: "forest_area_percentage", label: "Forest Area Percent" },
    { value: "forest_area_km", label: "Forest Area KM" },
    { value: "carbon_emission", label: "Carbon Emission" },
    { value: "hdi", label: "HDI" },
    { value: "fdi", label: "FDI" },
    { value: "disaster_count", label: "Disaster Count" },
    { value: "political_stability", label: "Political Stability" },
    { value: "population_density", label: "Population Density" },
    { value: "corruption_index", label: "Corruption Index" },
    { value: "tree_cover_loss", label: "Tree Cover Loss" },
    { value: "gross_carbon_emission", label: "Gross Carbon Emission" },
  ];

  const yearOptions = [2015, 2016, 2017, 2018, 2019, 2020];

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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/*
        FILTER SECTION:
        - On desktop => normal sidebar on the left
        - On mobile => full-width, offset from top ("top-16") to avoid navbar
          and slides up if filterOpen=false
      */}
      <div
        className={`
          bg-white shadow-md p-4 z-40
          transition-transform duration-300
          
          // Desktop: pinned on left, 16rem wide, no transform
          md:relative md:w-64 md:translate-y-0 md:h-auto
          
          // Mobile: full width, absolute, offset from the top
          absolute w-full left-0 top-16
          ${filterOpen ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{
          // For mobile: fill the screen from top-16 downward
          height: "calc(100vh - 4rem)", // e.g., if your navbar is ~4rem tall
        }}
      >
        {/* MOBILE-ONLY: arrow at the BOTTOM to hide filter */}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setFilterOpen(false)}
            className="text-xl text-gray-700 bg-gray-200 px-2 py-1 rounded mb-2"
          >
            Hide ▲
          </button>
        </div>

        {/* FILTER HEADERS & TOGGLES */}
        {/* 
          2) On Desktop, the “Filters” title and Standard/Top5 checkboxes
             appear on the same line. 
        */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 flex-wrap">
          <h1 className="text-xl font-bold mr-4 mb-2 md:mb-0">Filters</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterMode === "standard"}
                onChange={() => setFilterMode("standard")}
              />
              <span className="ml-1">Standard</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterMode === "top5"}
                onChange={() => setFilterMode("top5")}
              />
              <span className="ml-1">Top 5</span>
            </label>
          </div>
        </div>

        {/* STANDARD MODE */}
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
                "Tree Cover Loss",
                "Forest Area Percent",
                "Forest Area KM",
                "Carbon Emission",
                "Gross Carbon Emission",
                "HDI",
                "FDI",
                "Disaster Count",
                "Political Stability",
                "Population Density",
                "Corruption Index",
              ]}
              selectedMetric={tempMetric}
              onChange={setTempMetric}
            />

            {/* 1) Matching button sizes: use same classes & minimal width */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddSelection}
                className="px-3 py-1 min-w-[100px] text-sm bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Add Selection
              </button>
              <button
                onClick={handleToggleYAxis}
                className="px-3 py-1 min-w-[100px] text-sm bg-green-600 hover:bg-green-700 text-white rounded"
              >
                {restrictYAxis ? "See Trend" : "Lock Scale"}
              </button>
            </div>

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

        {/* TOP 5 MODE */}
        {filterMode === "top5" && (
          <>
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

      {/* MOBILE-ONLY: show "Show Filter" arrow if filter is hidden */}
      {!filterOpen && (
        <button
          onClick={() => setFilterOpen(true)}
          className="md:hidden absolute top-20 right-4 z-50 text-xl text-white bg-gray-600 px-3 py-1 rounded"
        >
          Show ▼
        </button>
      )}

      {/* MAIN CONTENT: chart area */}
      <div className="flex-1 p-8 flex flex-col gap-8 overflow-auto">
        {/* STANDARD MODE */}
        {filterMode === "standard" &&
          selections.map((item, index) => (
            <div key={index} className="w-full">
              {item.metric === "NDVI" && item.country && (
                <CountryNDVI
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Tree Cover Loss" && item.country && (
                <TreeCoverLoss
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Forest Area Percent" && item.country && (
                <ForestAreaPercent
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Forest Area KM" && item.country && (
                <ForestAreaKM
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Carbon Emission" && item.country && (
                <CarbonEmission
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Gross Carbon Emission" && item.country && (
                <GrossCarbonEmission
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "HDI" && item.country && (
                <CountryHDI
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "FDI" && item.country && (
                <CountryFDI
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Disaster Count" && item.country && (
                <DisasterCount
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Political Stability" && item.country && (
                <PoliticalStability
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Population Density" && item.country && (
                <PopulationDensity
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
              {item.metric === "Corruption Index" && item.country && (
                <CorruptionIndex
                  selectedCountry={item.country}
                  restrictYAxis={restrictYAxis}
                />
              )}
            </div>
          ))}

        {/* TOP 5 MODE */}
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
