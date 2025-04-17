import Header from "../header/header";
import LineChartTicket from "../line-chart-ticket/lineChartTicket";
import PieTicket from "../pie-ticket/pieTicket";
import PieUsers from "../pie-users/pieUsers";
import Statistiques from "../statistiques/statistiques";

const HomeDashboard = () => {
  return (
    <div className="w-full 3xl:w-3/4 overflow-x-hidden">
      <Header name={"Mezrioui Hakim"} greeting={"Have a nice day"} role={"super-admin"} profile={"https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"}  />
      <Statistiques />
      <div className="w-full m-auto flex justify-between my-5">
        <LineChartTicket />
        <div className="w-78">
          <PieTicket />
          <PieUsers />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
