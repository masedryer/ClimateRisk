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
   "NDVI": "https://code.earthengine.google.com/",
    "Carbon Emission": "https://globalcarbonatlas.org/emissions/carbon-emissions",
    "Gross Carbon Emission": "https://gfw.global/3rq1FFN",
    "Forest Area Percent": "https://www.kaggle.com/datasets/webdevbadger/world-forest-area",
    "Forest Area KM": "https://www.kaggle.com/datasets/webdevbadger/world-forest-area",
    "Tree Cover Loss": "https://gfw.global/48pxTlg",
    "HDI": "https://hdr.undp.org/data-center/human-development-index#/indicies/HDI",
    "FDI": "https://databank.worldbank.org/source/world-development-indicators/Series/BX.KLT.DINV.WD.GD.ZS#",
    "Disaster Count": "https://public.emdat.be/",
    "Political Stability": "https://databank.worldbank.org/source/worldwide-governance-indicators/Series/PV.EST",
    "Population Density": "https://data.worldbank.org/indicator/EN.POP.DNST",
    "Corruption Index": "https://ourworldindata.org/grapher/political-corruption-index",
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
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 break-words">
        Source:{" "}
        <a
          href={citation}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-700"
        >
          {citation}
        </a>
      </div>
    </div>
  );
};

export default TopFiveChartCard;
