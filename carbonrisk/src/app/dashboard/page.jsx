"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Standard Mode
import CountrySelect from "@/components/ui/CountrySelect";
import MetricFilter from "@/components/ui/MetricFilter";

// Single-country metric components
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

// For compiling multiple countries in a single chart
import { Line } from "react-chartjs-2";

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
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

/**
 * Axis labels for TOP 5 Bar Charts (y-axis).
 */
const metricAxisLabels = {
  ndvi: "NDVI (Normalised)",
  forest_area_percentage: "Forest Area Percentage (%)",
  forest_area_km: "Forest Area (km²)",
  carbon_emission: "Carbon Emission (MtCO2)",
  gross_carbon_emission: "Gross Carbon Emission (MtCO2)",
  tree_cover_loss: "Tree Cover Loss (Mha)",
  hdi: "Human Development Index (Normalised)",
  fdi: "Foreign Direct Investment (%)",
  disaster_count: "Disaster Count (Count)",
  political_stability: "Political Stability (Normalised)",
  population_density: "Population Density (people/km²)",
  corruption_index: "Corruption Index (Normalised)",
};

/**
 * Y-axis scale ranges to match single-country charts (Lock Scale).
 * If a metric is not here, we fallback to [0, undefined].
 */
const METRIC_SCALE_RANGES = {
  "NDVI": { min: 0, max: 1 },
  "Forest Area Percent": { min: 0, max: 100 },
  "Forest Area KM": { min: 0, max: 6000000 },
  "Tree Cover Loss": { min: 0, max: 6000000 },
  "Carbon Emission": { min: 0, max: 3000 },
  "Gross Carbon Emission": { min: 0, max: 3240000000 },
  "HDI": { min: 0, max: 1 },
  "FDI": { min: -150, max: 300 },
  "Disaster Count": { min: 0, max: 10 },
  "Political Stability": { min: -4, max: 2 },
  "Population Density": { min: 0, max: 1500 },
  "Corruption Index": { min: 0, max: 1 },
};

/**
 * Axis labels for multi-line COMPILED charts in standard mode.
 */
const compiledAxisLabels = {
  "NDVI": "NDVI (Normalised)",
  "Tree Cover Loss": "Tree Cover Loss (Mha)",
  "Forest Area Percent": "Forest Area Percent (%)",
  "Forest Area KM": "Forest Area (km²)",
  "Carbon Emission": "Carbon Emission (MtCO2)",
  "Gross Carbon Emission": "Gross Carbon Emission (MtCO2)",
  "HDI": "Human Development Index (Normalised)",
  "FDI": "Foreign Direct Investment (%)",
  "Disaster Count": "Disaster Count (Count)",
  "Political Stability": "Political Stability (Normalised)",
  "Population Density": "Population Density (people/km²)",
  "Corruption Index": "Corruption Index (Normalised)",
};

/**
 * Step sizes for Y-axis ticks (Lock Scale).
 */
const METRIC_STEP_SIZES = {
  "NDVI": 0.1,
  "Forest Area Percent": 10,
  "Forest Area KM": 500000,
  "Tree Cover Loss": 500000,
  "Carbon Emission": 300,
  "Gross Carbon Emission": 300000000,
  "HDI": 0.1,
  "FDI": 50,
  "Disaster Count": 1,
  "Political Stability": 1,
  "Population Density": 100,
  "Corruption Index": 0.1,
};

const Dashboard = () => {
  // ---------------------------------------------------------------
  // FILTER OPEN/CLOSE (for MOBILE)
  // ---------------------------------------------------------------
  const [filterOpen, setFilterOpen] = useState(true);

  // ---------------------------------------------------------------
  // STANDARD vs. TOP 5
  // ---------------------------------------------------------------
  const [filterMode, setFilterMode] = useState("standard");

  // Lock Scale / See Trend
  const [restrictYAxis, setRestrictYAxis] = useState(true);

  // ---------------------------------------------------------------
  // STANDARD MODE
  // ---------------------------------------------------------------
  const [tempCountry, setTempCountry] = useState("");
  const [tempMetric, setTempMetric] = useState("NDVI");
  const [selections, setSelections] = useState([]);

  const handleAddSelection = () => {
    if (tempCountry && tempMetric && selections.length < 10) {
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
  // COMPILE DATA
  // ---------------------------------------------------------------
  const [compiledCharts, setCompiledCharts] = useState(null);
  const [compiledMode, setCompiledMode] = useState(false);

  // If compiledMode is ON, recompile when selections change
  useEffect(() => {
    if (compiledMode) {
      handleCompileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections]);

  const handleToggleCompile = () => {
    if (compiledMode) {
      setCompiledMode(false);
      setCompiledCharts(null);
    } else {
      handleCompileData();
      setCompiledMode(true);
    }
  };

  const handleCompileData = async () => {
    if (selections.length === 0) {
      setCompiledCharts([]);
      return;
    }

    // Group selections by metric
    const byMetric = selections.reduce((acc, sel) => {
      if (!acc[sel.metric]) acc[sel.metric] = [];
      acc[sel.metric].push(sel.country);
      return acc;
    }, {});

    const results = [];
    for (const [metric, countryList] of Object.entries(byMetric)) {
      if (countryList.length === 1) {
        results.push({
          metric,
          countries: countryList,
          type: "single",
        });
      } else {
        const chartData = await fetchCompiledChartData(metric, countryList);
        if (!chartData) continue;
        results.push({
          metric,
          countries: countryList,
          type: "multi",
          chartData,
        });
      }
    }

    setCompiledCharts(results);
  };

  const fetchCompiledChartData = async (metric, countryList) => {
    const envMetrics = [
      "NDVI",
      "Tree Cover Loss",
      "Forest Area Percent",
      "Forest Area KM",
      "Carbon Emission",
      "Gross Carbon Emission",
    ];
    const socioMetrics = [
      "HDI",
      "FDI",
      "Disaster Count",
      "Political Stability",
      "Population Density",
      "Corruption Index",
    ];

    // Map from user-friendly metric to DB column
    const metricToColumn = {
      NDVI: "ndvi",
      "Tree Cover Loss": "tree_cover_loss",
      "Forest Area Percent": "forest_area_percentage",
      "Forest Area KM": "forest_area_km",
      "Carbon Emission": "carbon_emission",
      "Gross Carbon Emission": "gross_carbon_emission",
      HDI: "hdi",
      FDI: "fdi",
      "Disaster Count": "disaster_count",
      "Political Stability": "political_stability",
      "Population Density": "population_density",
      "Corruption Index": "corruption_index",
    };

    const columnName = metricToColumn[metric];
    if (!columnName) return null;

    let tableName = "";
    let columnsSelect = "";

    if (envMetrics.includes(metric)) {
      tableName = "environmental2";
      columnsSelect = `
        Year,
        ${columnName},
        region!inner (
          CountryName
        )
      `;
    } else if (socioMetrics.includes(metric)) {
      tableName = "socio_economic";
      columnsSelect = `
        Year,
        ${columnName},
        region!inner (
          CountryName
        )
      `;
    } else {
      return null;
    }

    const { data, error } = await supabase
      .from(tableName)
      .select(columnsSelect)
      .in("region.CountryName", countryList);

    if (error) {
      console.error("Error fetching compiled data:", error.message);
      return null;
    }
    if (!data || data.length === 0) return null;

    // Filter out rows < 2015
    const filteredRows = data.filter((row) => row.Year >= 2015);

    // group by country
    const countryData = {};
    filteredRows.forEach((row) => {
      const cName = row.region?.CountryName;
      if (!cName) return;
      if (row[columnName] == null) return;

      if (!countryData[cName]) {
        countryData[cName] = [];
      }
      countryData[cName].push({ x: row.Year, y: row[columnName] });
    });

    // sort each array by year
    Object.values(countryData).forEach((arr) => {
      arr.sort((a, b) => a.x - b.x);
    });

    // Build datasets
    const colorList = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#00A8A8",
      "#E6B0AA",
      "#F1948A",
    ];
    let colorIndex = 0;

    const datasets = Object.keys(countryData).map((country) => {
      const color = colorList[colorIndex % colorList.length];
      colorIndex++;
      return {
        label: country,
        data: countryData[country],
        borderColor: color,
        backgroundColor: color + "66",
        tension: 0.1,
        fill: false,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "y",
        },
      };
    });

    return { datasets };
  };

  // Renders compiled or single charts
  const renderCompiledCharts = () => {
    if (!compiledCharts) return null;

    return compiledCharts.map((item, idx) => {
      const { metric, countries, type, chartData } = item;

      if (type === "single") {
        const c = countries[0];
        return (
          <div key={idx} className="w-full mb-8">
            {metric === "NDVI" && (
              <CountryNDVI selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Tree Cover Loss" && (
              <TreeCoverLoss selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Forest Area Percent" && (
              <ForestAreaPercent selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Forest Area KM" && (
              <ForestAreaKM selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Carbon Emission" && (
              <CarbonEmission selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Gross Carbon Emission" && (
              <GrossCarbonEmission selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "HDI" && (
              <CountryHDI selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "FDI" && (
              <CountryFDI selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Disaster Count" && (
              <DisasterCount selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Political Stability" && (
              <PoliticalStability selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Population Density" && (
              <PopulationDensity selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
            {metric === "Corruption Index" && (
              <CorruptionIndex selectedCountry={c} restrictYAxis={restrictYAxis} />
            )}
          </div>
        );
      } else {
        // multi-line
        const chartTitle = `Compiled ${metric} Data`;

        // lock scale or see trend
        let yMin, yMax;
        let stepSize;

        if (restrictYAxis) {
          const lockedRange = METRIC_SCALE_RANGES[metric];
          if (lockedRange) {
            yMin = lockedRange.min;
            yMax = lockedRange.max;
          } else {
            yMin = 0;
            yMax = undefined;
          }
          stepSize = METRIC_STEP_SIZES[metric] || undefined;
        } else {
          // auto-scale => no fixed min/max, no step size
          yMin = undefined;
          yMax = undefined;
          stepSize = undefined;
        }

        // *** FIX for repeated years *** 
        // add stepSize: 1 and parseInt in X-axis to ensure 
        // each integer year is only displayed once
        const xAxis = {
          type: "linear",
          ticks: {
            stepSize: 1,
            callback: (value) => parseInt(value, 10),
          },
          title: { display: true, text: "Year" },
        };

        const yAxisLabel = compiledAxisLabels[metric] || metric;

        const options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: xAxis,
            y: {
              min: yMin,
              max: yMax,
              beginAtZero: false,
              title: {
                display: true,
                text: yAxisLabel,
              },
              ticks: { stepSize },
            },
          },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: chartTitle,
            },
          },
        };

        return (
          <div key={idx} className="w-full h-96 mb-8 bg-white p-4 rounded shadow">
            <Line data={chartData} options={options} />
          </div>
        );
      }
    });
  };

  const renderStandardCharts = () => {
    return selections.map((item, index) => (
      <div key={index} className="w-full mb-8">
        {item.metric === "NDVI" && (
          <CountryNDVI selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Tree Cover Loss" && (
          <TreeCoverLoss selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Forest Area Percent" && (
          <ForestAreaPercent
            selectedCountry={item.country}
            restrictYAxis={restrictYAxis}
          />
        )}
        {item.metric === "Forest Area KM" && (
          <ForestAreaKM selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Carbon Emission" && (
          <CarbonEmission selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Gross Carbon Emission" && (
          <GrossCarbonEmission
            selectedCountry={item.country}
            restrictYAxis={restrictYAxis}
          />
        )}
        {item.metric === "HDI" && (
          <CountryHDI selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "FDI" && (
          <CountryFDI selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Disaster Count" && (
          <DisasterCount selectedCountry={item.country} restrictYAxis={restrictYAxis} />
        )}
        {item.metric === "Political Stability" && (
          <PoliticalStability
            selectedCountry={item.country}
            restrictYAxis={restrictYAxis}
          />
        )}
        {item.metric === "Population Density" && (
          <PopulationDensity
            selectedCountry={item.country}
            restrictYAxis={restrictYAxis}
          />
        )}
        {item.metric === "Corruption Index" && (
          <CorruptionIndex
            selectedCountry={item.country}
            restrictYAxis={restrictYAxis}
          />
        )}
      </div>
    ));
  };

  // ---------------------------------------------------------------
  // TOP 5 MODE
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

      let tableName = "";
      let columns = "";

      if (isEnvMetric) {
        tableName = "environmental2";
        columns = `
          Year,
          ndvi,
          forest_area_percentage,
          forest_area_km,
          carbon_emission,
          gross_carbon_emission,
          tree_cover_loss,
          region!inner (
            CountryName,
            Region
          )
        `;
      } else if (isSocioMetric) {
        tableName = "socio_economic";
        columns = `
          Year,
          hdi,
          fdi,
          disaster_count,
          political_stability,
          population_density,
          corruption_index,
          region!inner (
            CountryName,
            Region
          )
        `;
      } else {
        return;
      }

      let { data: rawData, error } = await supabase
        .from(tableName)
        .select(columns)
        .eq("Year", selectedYear);

      if (error) {
        console.error("Error fetching data:", error.message);
        return setTop5ChartData(null);
      }
      if (!rawData || rawData.length === 0) {
        return setTop5ChartData(null);
      }

      // filter by region
      let filtered = rawData;
      if (!isCountrySelected) {
        filtered = filtered.filter((row) => row.region?.Region === selectedRegion);
      }

      // exclude null metrics
      filtered = filtered.filter(
        (row) => row[top5Metric] !== null && row[top5Metric] !== undefined
      );

      // sort
      if (top5Highest) {
        filtered.sort((a, b) => b[top5Metric] - a[top5Metric]);
      } else if (top5Lowest) {
        filtered.sort((a, b) => a[top5Metric] - b[top5Metric]);
      }

      // slice top/bottom 5
      const top5data = filtered.slice(0, 5);
      if (top5data.length === 0) {
        return setTop5ChartData(null);
      }

      // build chart
      const labels = top5data.map((item, idx) => {
        return item.region?.CountryName || `Item ${idx + 1}`;
      });
      const values = top5data.map((item) => item[top5Metric]);

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
        gross_carbon_emission: "Gross Carbon Emission",
      };
      const niceMetricName = metricLabelMap[top5Metric] || top5Metric;

      let contextName = "All Countries";
      if (!isCountrySelected) {
        contextName = selectedRegion;
      }

      const datasetLabel = `${
        top5Highest ? "Top 5 Highest" : "Top 5 Lowest"
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
    } catch (err) {
      console.error("Unexpected error:", err);
      setTop5ChartData(null);
    } finally {
      setLoadingTop5(false);
    }
  };

  const canGenerate =
    top5Metric &&
    selectedYear &&
    (top5Highest || top5Lowest) &&
    (isCountrySelected || selectedRegion) &&
    !loadingTop5;

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* FILTER SECTION */}
      <div
        className={`
          bg-white shadow-md p-4 z-40
          transition-transform duration-300
          md:relative md:w-64 md:translate-y-0
          overflow-y-auto
          absolute w-full left-0 top-16
          ${filterOpen ? "translate-y-0" : "-translate-y-full"}
        `}
        style={{
          height: "calc(100vh - 4rem)",
        }}
      >
        {/* MOBILE-ONLY: arrow to hide filter */}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setFilterOpen(false)}
            className="text-xl text-gray-700 bg-gray-200 px-2 py-1 rounded mb-2"
          >
            Hide ▲
          </button>
        </div>

        {/* Filter Headers & Toggles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 flex-wrap">
          <h1 className="text-xl font-bold mr-4 mb-2 md:mb-0">Filters</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterMode === "standard"}
                onChange={() => {
                  setFilterMode("standard");
                  setCompiledMode(false);
                  setCompiledCharts(null);
                }}
              />
              <span className="ml-1">Standard</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterMode === "top5"}
                onChange={() => {
                  setFilterMode("top5");
                  setCompiledMode(false);
                  setCompiledCharts(null);
                }}
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

            <div className="mt-4 flex flex-col md:items-start">
              <div className="flex gap-2">
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
                {/* Mobile only: compile toggle */}
                <button
                  onClick={handleToggleCompile}
                  className="px-3 py-1 min-w-[100px] text-sm bg-green-600 hover:bg-green-700 text-white rounded md:hidden"
                >
                  {compiledMode ? "Separate Data" : "Compile Data"}
                </button>
              </div>

              {/* Desktop compile toggle */}
              <div className="hidden md:flex mt-2">
                <button
                  onClick={handleToggleCompile}
                  className="px-3 py-1 min-w-[100px] text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {compiledMode ? "Separate Data" : "Compile Data"}
                </button>
              </div>
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
                {[
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
                ].map((m) => (
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
                {[2015, 2016, 2017, 2018, 2019, 2020].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateTop5}
              disabled={
                !top5Metric ||
                !selectedYear ||
                (!top5Highest && !top5Lowest) ||
                (!isCountrySelected && !selectedRegion) ||
                loadingTop5
              }
              className={
                !loadingTop5
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
        {filterMode === "standard" && (
          <>
            {compiledMode ? renderCompiledCharts() : renderStandardCharts()}
          </>
        )}

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
                      x: {
                        title: {
                          display: true,
                          text: "Countries",
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: metricAxisLabels[top5Metric] ?? "Value",
                        },
                      },
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
