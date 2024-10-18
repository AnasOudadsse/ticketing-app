import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";
import Statistiques from "./component/statistiques/statistiques";
import Login from "./component/login/Login";
import Dashboard from "./component/dashboard/dashboard";
import HomeDashboard from "./component/home-dashboard/HomeDashboard";
import { TicketView } from "./component/ticket-view/ticket-view";
import UsersList from "./component/users-list/usersList";
import AddUser from "./component/add-user/addUser";
import UpdateUser from "./component/update-user/updateUser";
import PrintTicket from "./component/print-ticket/PrintTicket";
import ExportTickets from "./component/exportTickets/ExportTickets";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
      <Flex fontFamily={'inter'} w={'100%'} bg={"#F9F9FB"} >
        <Routes>
          <Route element={<Dashboard />} path="tickets">
            <Route element={<ExportTickets />} path="exporttickets" />
            <Route element={<HomeDashboard />} path="" />
            <Route element={<TicketList />} path="ticketlist" />
            <Route element={<NewTicket />} path="newticket" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<TicketView />} path="ticketview/:id" />
            <Route element={<UsersList />} path="usersList">
              <Route element={<UpdateUser />} path="updateuser/:role" />
            </Route>
            <Route element={<PrintTicket />} path="printticket" />
            <Route element={<AddUser />} path="addUser" />
          </Route>
          <Route element={<Login />} path="login" />
        </Routes>
      </Flex>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
