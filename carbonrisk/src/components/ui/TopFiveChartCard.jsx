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
  metricName,
  topFiveData = [],
  xAxisLabel = "Countries",
  yAxisLabel = "",
}) => {
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

  // Extract labels and values from data
  const labels = topFiveData.map((item) => item.country);
  const values = topFiveData.map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: `Top 5 ${metricName}`,
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: !!xAxisLabel, text: xAxisLabel } },
      y: { title: { display: !!yAxisLabel, text: yAxisLabel }, beginAtZero: true },
    },
  };

  return (
    <div className="p-4 pb-16 bg-white rounded-lg shadow-md w-full h-[800px] relative">
      <h2 className="text-xl font-bold mb-4">Top 5 {metricName}</h2>
      <div className="h-full">
        <Bar data={chartData} options={options} />
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {citation}
      </div>
    </div>
  );
};

export default TopFiveChartCard;
