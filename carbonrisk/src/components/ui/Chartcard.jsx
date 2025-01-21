import React from "react";
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

// Register chart components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ ndviData, countryName }) => {
  const chartData = {
    labels: ndviData.map((data) => data.Year), // Years as labels
    datasets: [
      {
        label: `NDVI for ${countryName}`,
        data: ndviData.map((data) => data.NDVI), // NDVI values
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">NDVI Data for {countryName}</h2>
      {ndviData.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>No data available for the selected country.</p>
      )}
    </div>
  );
};

export default ChartCard;
