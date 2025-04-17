import { faLink, faLinkSlash, faTicket, faToolbox, faTools, faUsers } from "@fortawesome/free-solid-svg-icons";
import StatistiquesCard from "../statistiques-card/statistiques-card";
import useHttp from "../customHook/useHttp";
import { useEffect, useState } from "react";

const Statistiques = () => {
  const { loading, sendRequest } = useHttp();
  const [statistiques, setStatistiques] = useState({});
  // const []

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const request = {
      url: "http://127.0.0.1:8000/api/statistiques",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    sendRequest(request, getData);
  }, []);

  const getData = (data) => {
    setStatistiques(data);
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex w-full justify-between mx-auto my-5 gap-3 2xl:w-full">
      <StatistiquesCard
        icon={faUsers}
        title={"Total Users"}
        number={statistiques.users}
        isUp={true}
        pourcentage={1.3}
        iconColor={"text-violet-900"}
        bgColor={"bg-violet-300"}
      />
      <StatistiquesCard
        icon={faTicket}
        title={"Total Tickets"}
        number={statistiques.tickets}
        isUp={false}
        pourcentage={0.7}
        iconColor={"text-green-900"}
        bgColor={"bg-green-300"}
      />
      <StatistiquesCard
        icon={faToolbox}
        title={"Total Materiels"}
        number={statistiques.material}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-blue-900"}
        bgColor={"bg-blue-300"}
      />
      <StatistiquesCard
        icon={faLink}
        title={"Total Active Materiels"}
        number={statistiques.materialActive}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-orange-900"}
        bgColor={"bg-orange-300"}
      />
      <StatistiquesCard
        icon={faLinkSlash}
        title={"Total Inactive Material"}
        number={statistiques.materialInActive}
        isUp={false}
        pourcentage={0.8}
        iconColor={"text-pink-900"}
        bgColor={"bg-pink-300"}
      />
    </div>
  );
};

export default Statistiques;
