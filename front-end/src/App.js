import SideBar from "./component/side-bar/side-bar";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";
import Statistiques from "./component/statistiques/statistiques";
import PieTicket from "./component/pie-ticket/pieTicket";
import Login from "./component/login/Login";
import Header from "./component/header/header";
import Dashboard from "./component/dashboard/dashboard";
import HomeDashboard from "./component/home-dashboard/HomeDashboard";

function App() {
  return (
    <ChakraProvider>
      <div className="flex w-full bg-slate-100">
        <BrowserRouter>
          <Routes>
            <Route element={<Dashboard />} path="dashboard">
              <Route element={<HomeDashboard />} path="" />
              <Route element={<TicketList />} path="ticketlist" />
            </Route>
            <Route element={<NewTicket />} path="newticket" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<Login />} path="login" />
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
