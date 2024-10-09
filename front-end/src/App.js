import SideBar from "./component/side-bar/side-bar";
import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";


function App() {
  return (
    <ChakraProvider>
        <SideBar />
        <BrowserRouter>
          <Routes>
              <Route element={<NewTicket/>} path="newticket" />
              <Route element={<TicketList/>} path="ticketlist" />
          </Routes>
        </BrowserRouter>
    </ChakraProvider>
  )}

  export default App;
