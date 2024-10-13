import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./component/add-ticket/add-ticket";
import TicketList from "./component/tickets-list/tickets-list";
import Statistiques from "./component/statistiques/statistiques";
import Login from "./component/login/Login";
import Dashboard from "./component/dashboard/dashboard";
import HomeDashboard from "./component/home-dashboard/HomeDashboard";
import { TicketView } from "./component/ticket-view/ticket-view";
import UsersList from "./component/users-list/usersList";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard />} path="dashboard">
            <Route element={<HomeDashboard />} path="" />
            <Route element={<TicketList />} path="ticketlist" />
            <Route element={<NewTicket />} path="newticket" />
            <Route element={<Statistiques />} path="statistiques" />
            <Route element={<TicketView />} path="ticketview/:id" />
            <Route element={<UsersList />} path="usersList" />
          </Route>
          <Route element={<Login />} path="login" />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
