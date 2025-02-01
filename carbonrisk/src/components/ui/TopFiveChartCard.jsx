"use client";

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

const TopFiveChartCard = ({
  metricName,       // Expected to be something like "NDVI"
  chartData,        // Preferred: already built chartData object
  options,          // Chart.js options
  topFiveData,      // Fallback: legacy array [{ country, value }, ...]
  xAxisLabel = "Countries",
  yAxisLabel = ""
}) => {
  // Force trimming and ensure we have a proper metric name.
  let effectiveMetricName = (metricName || "").trim();
  if (!effectiveMetricName && chartData && chartData.datasets && chartData.datasets[0]?.label) {
    effectiveMetricName = chartData.datasets[0].label.replace(/^Top 5\s+/i, "").trim();
  }
  if (!effectiveMetricName) {
    effectiveMetricName = "Unknown Metric";
  }

  // Source mapping using the effective metric name.
  const sourceMap = {
    "NDVI": "Source 1",
    "Carbon Emission": "Source 2",
    "Gross Carbon Emission": "Source 3",
    "Forest Area Percent": "Source 4",
    "Forest Area KM": "Source 5",
    "Tree Cover Loss": "Source 6",
    "HDI": "Source 7",
    "FDI": "Source 8",
    "Disaster Count": "Source 9",
    "Political Stability": "Source 10",
    "Population Density": "Source 11",
    "Corruption Index": "Source 12",
  };
  const citation = sourceMap[effectiveMetricName] || "Source Unknown";

  // Build finalChartData from chartData if provided, or fallback to topFiveData.
  let finalChartData = chartData;
  if (!finalChartData && topFiveData) {
    const labels = topFiveData.map((item) => item.country);
    const values = topFiveData.map((item) => item.value);
    finalChartData = {
      labels,
      datasets: [
        {
          label: `Top 5 ${effectiveMetricName}`,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }
  if (!finalChartData) {
    finalChartData = { labels: [], datasets: [] };
  }

  return (
    <div className="p-4 pb-16 bg-white rounded-lg shadow-md w-full h-[600px] relative">
      <h2 className="text-xl font-bold mb-4">Top 5 {effectiveMetricName}</h2>
      <div className="h-full">
        <Bar data={finalChartData} options={options} />
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {citation}
      </div>
    </div>
  );
};

export default TopFiveChartCard;
