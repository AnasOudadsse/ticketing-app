import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";

Chart.register(CategoryScale);

const Data = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
    userLost: 823,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
    userLost: 345,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
    userLost: 555,
  },
];

const PieUsers = () => {
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
        backgroundColor: ["rgba(75,192,192,1)", "&quot;#ecf0f1", "#50AF95"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  return (
    <div className="shadow-md h-fit flex flex-col gap-5 rounded-lg py-4">
      <div className="px-3 py-2 mt-2">
        <p className="text-xs font-bold">Users</p>
        <h3 className="mt-2 text-4xl font-bold">1438</h3>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-fit ml-4">
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-red-800"></div>
            <p>admin</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-green-800"></div>
            <p>supportIt</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-blue-500"></div>
            <p>client</p>
          </div>
        </div>
        <div style={{ height: "150px", width: "150px" }}>
          <Doughnut
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: false,
                  text: "Users Gained between 2016-2020",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PieUsers;