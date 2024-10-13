import { Outlet } from "react-router-dom";
import SideBar from "../side-bar/side-bar";

const Dashboard = () => {
  return (
    <div className="flex w-full gap-5">
      <SideBar />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
