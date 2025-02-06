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
  xAxisLabel = "Years",
  yAxisLabel = "",
}) => {
  // Example set of years; adjust as needed (2015–2020, etc.)
  const allYears = [
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
    2014, 2015, 2016, 2017, 2018, 2019, 2020,
  ];

  // Build a dictionary { year: value } from metricData
  const dataByYear = {};
  metricData.forEach((item) => {
    dataByYear[item.year] = item.value;
  });

  // Source mapping for bottom-right label
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
    // fallback
  };
  const citation = sourceMap[metricName] || "Source Unknown";

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

  // Build Y-axis options
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

  // Final chart.js options
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
    <div className="p-4 pb-16 bg-white rounded-lg shadow-md w-full h-[400px] relative">
      <h2 className="text-xl font-bold mb-4">
        {metricName} Data for {countryName}
      </h2>
      <div className="h-full">
        <Line data={chartData} options={options} />
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

export default ChartCard;