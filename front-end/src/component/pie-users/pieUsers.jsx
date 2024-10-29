import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import useHttp from "../customHook/useHttp";

Chart.register(CategoryScale);

const PieUsers = () => {
  const { loading, sendRequest } = useHttp();
  const [data, setData] = useState([]);

  const [chartData, setChartData] = useState({
    labels: data.map((users) => users.title),
    datasets: [
      {
        label: "Users Gained",
        data: data.map((users) => users.number),
        backgroundColor: ["rgba(75,192,192,1)", "&quot;#ecf0f1", "#50AF95"],
        borderColor: "black",
        borderWidth: 1,
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

  const getData = (dataRec) => {
    console.log(dataRec);
    setData(dataRec);
    setChartData({
      ...chartData,
      labels: dataRec.map((users, index) => index !== 3 && users.title),
      datasets: [
        {
          ...chartData.datasets,
          data: dataRec.map((users, index) => index !== 3 && users.number),
        },
      ],
    });
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
            <div className="w-6 h-3 rounded" style={{backgroundColor: "#249cfb"}}></div>
            <p>admin</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded" style={{backgroundColor: "#fc9030"}}></div>
            <p>supportIt</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-6 h-3 rounded" style={{backgroundColor: "#fb4468"}}></div>
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
