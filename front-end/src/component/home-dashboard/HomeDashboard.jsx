import Header from "../header/header";
import LineChartTicket from "../line-chart-ticket/lineChartTicket";
import PieTicket from "../pie-ticket/pieTicket";
import Statistiques from "../statistiques/statistiques";

const HomeDashboard = () => {
  return (
    <div className="w-full">
      <Header />
      <Statistiques />
      <div className="w-full flex justify-between my-5">
        <LineChartTicket />
        <PieTicket />
      </div>
    </div>
  );
};

export default HomeDashboard;
