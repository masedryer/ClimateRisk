"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CompiledChartCard = ({
  metricName,       // e.g., "NDVI", "Forest Area Percent", etc.
  chartData,        // Preferred: chartData object built in Dashboard
  compiledData,     // Fallback: legacy data [{ country, data: [{ x, y }, ...] }, ...]
  yAxisSettings,
  xAxisLabel = "Years",
  yAxisLabel = ""
}) => {
  // Define the range of years
  const allYears = [
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
  ];

  // Citation mapping based on metricName
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
  const citation = sourceMap[metricName] || "Source Unknown";

  // Build final chartData
  let finalChartData;
  if (chartData) {
    // If chartData is provided, assume it’s already built for line parsing.
    finalChartData = { ...chartData };
    // Only add labels if none exist AND the data isn’t using parsing mode.
    if (!finalChartData.labels && !(finalChartData.datasets && finalChartData.datasets[0]?.parsing)) {
      finalChartData.labels = allYears.map(String);
    }
  } else if (compiledData) {
    // Build chartData from compiledData fallback
    const colorList = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#00A8A8",
    ];
    const datasets = compiledData.map(({ country, data }, index) => ({
      label: `${metricName} for ${country}`,
      data: allYears.map((year) => {
        const entry = data.find((item) => item.x === year);
        return entry ? entry.y : null;
      }),
      fill: false,
      borderColor: colorList[index % colorList.length],
      tension: 0.1,
    }));
    finalChartData = { labels: allYears.map(String), datasets };
  } else {
    finalChartData = { labels: [], datasets: [] };
  }

  // Force the x-axis to be linear so that parsed x-values are used
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        title: { display: !!xAxisLabel, text: xAxisLabel },
        ticks: { stepSize: 1, callback: (value) => parseInt(value, 10) },
      },
      y: {
        min: yAxisSettings?.min,
        max: yAxisSettings?.max,
        ticks: { stepSize: yAxisSettings?.stepSize },
        title: { display: !!yAxisLabel, text: yAxisLabel },
      },
    },
  };

  return (
    <div className="p-4 pb-16 bg-white rounded-lg shadow-md w-full h-[400px] relative">
      <h2 className="text-xl font-bold mb-4">{metricName} Compiled Data</h2>
      <div className="h-full">
        <Line data={finalChartData} options={options} />
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {citation}
      </div>
    </div>
  );
};

export default CompiledChartCard;