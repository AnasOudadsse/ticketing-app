import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState } from "react";

Chart.register(CategoryScale);

const Data = [
  {
    id: 1,
    state: "open",
    number: 80000,
  },
  {
    id: 2,
    state: "resolved",
    number: 45677,
  },
  {
    id: 3,
    state: "non-resolved",
    number: 78888,
  },
  {
    id: 4,
    state: "going",
    number: 90000,
  },
];

const PieTicket = () => {
  //   const Data = {
  //     labels: ["Red", "Orange", "Blue"],
  //     // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
  //     datasets: [
  //       {
  //         label: "Popularity of colours",
  //         data: [55, 23, 96],
  //         // you can set indiviual colors for each bar
  //         backgroundColor: [
  //           "rgba(255, 255, 255, 0.6)",
  //           "rgba(255, 255, 255, 0.6)",
  //           "rgba(255, 255, 255, 0.6)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.state),
    datasets: [
      {
        label: "Tickets state",
        data: Data.map((data) => data.number),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "&quot;#ecf0f1",
          "#50AF95",
          "#f3ba2f",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  return (
    <div className="shadow-md h-fit w-fit flex flex-col gap-5 rounded-lg">
      <div className="flex justify-between items-center gap-5 px-3 py-2 mt-2">
        <p className="text-xs font-bold">Title of Pie Tickets</p>
        <p className="bg-gray-200 px-5 py-1 rounded-xl text-xs">Something</p>
      </div>
      <div>
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Users Gained between 2016-2020",
              },
            },
          }}
        />
      </div>
      <div className="mb-2">
        <div className="grid grid-cols-4 text-xs bg-gray-200 px-5 gap-3">
          <p className="col-span-2">Title 1</p>
          <p>Title 2</p>
          <p>Title 3</p>
        </div>
        <div className="grid grid-cols-4 text-xs py-3 px-5 gap-3">
          <span className="col-span-2 font-bold flex gap-1 items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <p>lorem</p>
          </span>
          <p>53235</p>
          <p>75392</p>
        </div>
        <div className="grid grid-cols-4 text-xs py-3 px-5 gap-3">
          <span className="col-span-2 font-bold flex gap-1 items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p>lorem</p>
          </span>
          <p>53235</p>
          <p>75392</p>
        </div>
        <div className="grid grid-cols-4 text-xs py-3 px-5 gap-3">
          <span className="col-span-2 font-bold flex gap-1 items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <p>lorem</p>
          </span>
          <p>53235</p>
          <p>75392</p>
        </div>
      </div>
    </div>
  );
};

export default PieTicket;
