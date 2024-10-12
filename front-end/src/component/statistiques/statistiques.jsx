import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import StatistiquesCard from "../statistiques-card/statistiques-card";

const Statistiques = () => {
  return (
    <div className="flex w-full justify-between my-5 px-5">
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
