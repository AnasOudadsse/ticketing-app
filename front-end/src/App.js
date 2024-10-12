import SideBar from "./component/side-bar/side-bar";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";
import Statistiques from "./component/statistiques/statistiques";
import PieTicket from "./component/pie-ticket/pieTicket";
import { TicketView } from "./component/ticket-view/ticket-view";

function App() {
  return (
    <ChakraProvider>
      <div className="flex w-full">
        <SideBar  />
        {/* <PieTicket /> */}
        <BrowserRouter>
          <Routes>
            <Route element={<NewTicket />} path="newticket" />
            <Route element={<TicketList />} path="ticketlist" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<TicketView />} path="ticketview/:id" />
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
