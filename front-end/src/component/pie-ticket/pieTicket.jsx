import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import useHttp from "../customHook/useHttp";

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
    const { loading, sendRequest } = useHttp();
    const [data, setData] = useState([]);

    const [chartData, setChartData] = useState({
      datasets: [
        {
          label: "Tickets state",
          data: [],
          backgroundColor: [
            "rgba(75,192,192,1)",
            "rgba(75,68,192,1)",
            "rgba(30,192,70,1)",
            "rgba(25,49,90,1)",
          ],
          borderColor: "black",
          borderWidth: 0,
        },
      ],
    });
  
  
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      const request = {
        url: "http://127.0.0.1:8000/api/ticketsStatus/count",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      sendRequest(request, getData);
    }, []);
  
    const getData = (data) => {
      setData(data);
      console.log(data);
  
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: data.map((ticket) => ticket.number), // Update the data for the pie chart
          },
        ],
      }));
    };


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
