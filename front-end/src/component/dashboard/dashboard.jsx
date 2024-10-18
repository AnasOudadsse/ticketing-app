import { Outlet } from "react-router-dom";
import SideBar from "../side-bar/side-bar";

const Dashboard = () => {
  return (
    <div className="flex w-full">
      <SideBar />
      <div className="container px-1 mx-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
