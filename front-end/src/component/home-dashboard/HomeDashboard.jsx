import Header from "../header/header";
import LineChartTicket from "../line-chart-ticket/lineChartTicket";
import PieTicket from "../pie-ticket/pieTicket";
import PieUsers from "../pie-users/pieUsers";
import Statistiques from "../statistiques/statistiques";

const HomeDashboard = () => {
  return (
    <div className="w-full">
      <Header />
      <Statistiques />
      <div className="w-full container m-auto flex justify-between my-5">
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
