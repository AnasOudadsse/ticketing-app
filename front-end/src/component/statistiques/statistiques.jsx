import {
  faArrowUpWideShort,
  faU,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import StatistiquesCard from "../statistiques-card/statistiques-card";

const Statistiques = () => {
  return (
    <div className="flex justify-center gap-3">
      <StatistiquesCard
        icon={faUsers}
        title={"Total Users"}
        number={2089}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-violet-900"}
        bgColor={"bg-violet-300"}
      />
      <StatistiquesCard
        icon={faUsers}
        title={"Total Users"}
        number={2089}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-violet-900"}
        bgColor={"bg-violet-300"}
      />
      <StatistiquesCard
        icon={faUsers}
        title={"Total Users"}
        number={2089}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-violet-900"}
        bgColor={"bg-violet-300"}
      />
      <StatistiquesCard
        icon={faUsers}
        title={"Total Users"}
        number={2089}
        isUp={true}
        pourcentage={1.8}
        iconColor={"text-violet-900"}
        bgColor={"bg-violet-300"}
      />
    </div>
  );
};

export default Statistiques;
