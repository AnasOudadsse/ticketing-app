import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../customHook/useHttp";

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
  const { loading, sendRequest } = useHttp();
  const [data, setData] = useState([]);

  const [chartData, setChartData] = useState({
    labels: data.map((data) => data.title),
    datasets: [
      {
        label: "Users",
        data: data.map((user) => user.number),
        backgroundColor: ["rgb(74 222 128)", "rgb(34 211 238)", "rgb(251 146 60)"],
        borderColor: "white",
        borderWidth: 0,
      },
    ],
  });


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request = {
      url: "http://127.0.0.1:8000/api/users/roles",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, getData);
  }, []);

  const getData = (data) => {
    setData(data);

    setChartData((prevData) => ({
      ...prevData,
      labels: data.map((label) => label.title),
      datasets: [
        {
          ...prevData.datasets[0],
          data: data.map((user, index) => index!=3 && user.number), // Update the data for the pie chart
        },
      ],
    }));
  };

  if (loading) {
    return null;
  }

  return (
    <div className="shadow-md h-fit flex flex-col gap-5 rounded-lg py-4">
      <div className="px-3 py-2 mt-2">
        <p className="text-xs font-bold">{data[3]?.title}</p>
        <h3 className="mt-2 text-4xl font-bold">{data[3]?.number}</h3>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-fit ml-4">
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-green-400"></div>
            <p>admin</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-orange-400"></div>
            <p>supportIt</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded bg-cyan-400"></div>
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
