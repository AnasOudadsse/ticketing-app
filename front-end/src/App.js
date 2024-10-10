import SideBar from "./component/side-bar/side-bar";
import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";
import Statistiques from "./component/statistiques/statistiques";
import Header from "./component/header/header";


function App() {
  return (
    <ChakraProvider>
        <SideBar />
        <Header />
        <BrowserRouter>
          <Routes>
              <Route element={<NewTicket/>} path="newticket" />
              <Route element={<TicketList/>} path="ticketlist" />
              <Route element={<Statistiques />} path="statistiques" />
              <Route element={<Statistiques />} path="statistiques" />
          </Routes>
        </BrowserRouter>
    </ChakraProvider>
  )}

  export default App;
