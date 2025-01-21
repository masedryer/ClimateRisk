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

const ChartCard = ({
  metricName,
  metricData = [],
  countryName,
  yAxisSettings,
  // new props for axis labels:
  xAxisLabel = "Years",
  yAxisLabel = "",
}) => {
  // Years we want to plot (2015–2021, for example)
  // or you might compute dynamically.
  const allYears = [2015, 2016, 2017, 2018, 2019, 2020];

  // Build a dictionary { year: value } from metricData
  const dataByYear = {};
  metricData.forEach((item) => {
    dataByYear[item.year] = item.value;
  });

  // Create chartData with those years as labels
  const chartData = {
    labels: allYears.map(String),
    datasets: [
      {
        label: `${metricName} for ${countryName}`,
        data: allYears.map((year) =>
          dataByYear[year] !== undefined ? dataByYear[year] : null
        ),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  // If we have yAxisSettings, apply them, otherwise auto-scale
  const yOptions = {
    title: {
      display: !!yAxisLabel,
      text: yAxisLabel,
    },
  };
  if (yAxisSettings) {
    yOptions.min = yAxisSettings.min;
    yOptions.max = yAxisSettings.max;
    yOptions.ticks = {
      stepSize: yAxisSettings.stepSize,
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
        },
      },
      y: yOptions,
    },
  };

  return (
    <div className="p-4 pb-16 bg-white rounded-lg shadow-md w-full h-[400px]">
      <h2 className="text-xl font-bold mb-4">
        {metricName} Data for {countryName}
      </h2>
      <div className="h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ChartCard;
