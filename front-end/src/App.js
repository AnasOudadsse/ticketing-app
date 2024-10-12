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
import { TicketView } from "./component/ticket-view/ticket-view";

function App() {
  return (
    <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Dashboard />} path="dashboard">
              <Route element={<HomeDashboard />} path="" />
            </Route>
            <Route element={<TicketList />} path="ticketlist" />
            <Route element={<NewTicket />} path="newticket" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<Login />} path="login" />
            <Route element={<TicketView />} path="ticketview/:id" />
          </Routes>
        </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
