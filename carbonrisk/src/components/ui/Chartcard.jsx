// components/ui/ChartCard.jsx
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

const ChartCard = ({ metricName, metricData = [], countryName }) => {
  // 1) Fixed range of years (2015–2021) in ascending order
  const allYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021];

  // 2) Dictionary { year: value }
  const dataByYear = {};
  metricData.forEach((item) => {
    dataByYear[item.year] = item.value;
  });

  // 3) Build chartData
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full h-[400px]">
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
