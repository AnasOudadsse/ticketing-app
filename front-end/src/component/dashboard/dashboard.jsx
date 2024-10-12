import { Outlet } from "react-router-dom";
import SideBar from "../side-bar/side-bar";

const Dashboard = () => {
  return (
    <div className="flex w-full">
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
