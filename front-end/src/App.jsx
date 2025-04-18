import { ChakraProvider, Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewTicket } from "./pages/add-ticket/add-ticket";
import TicketList from "./pages/tickets-list/tickets-list";
import Statistiques from "./pages/statistiques/statistiques";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/dashboard";
import HomeDashboard from "./pages/home-dashboard/HomeDashboard";
import { TicketView } from "./pages/ticket-view/ticket-view";
import UsersList from "./pages/users-list/usersList";
import AddUser from "./pages/add-user/addUser";
import UpdateUser from "./pages/update-user/updateUser";
import PrintTicket from "./pages/print-ticket/PrintTicket";
import ExportTickets from "./pages/exportTickets/ExportTickets";
import RoleProtectedRoute from "./pages/Route-Protection/RoleProtectiongRoute";
import { ProtectedRoute } from "./pages/Route-Protection/ProtectedRoute";
import Unauthorized from "./pages/Route-Protection/Unauthorized";
import { ProfilePage } from "./pages/Profile/Profile";
import AuthCheck from "./pages/authCheck/AuthCheck";
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Flex fontFamily={"inter"} w={"100%"} bg={"#F9F9FB"}>
          <Routes>
            {/* Public Route */}

            <Route path="" element={<AuthCheck />} />
            <Route path="login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes: Only accessible by authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="tickets" element={<Dashboard />}>
                {/* Admin-only routes */}
                {/* <Route
                  path="exporttickets"
                  element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                      <ExportTickets />
                    </RoleProtectedRoute>
                  }
                /> */}

                <Route
                  path=""
                  element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                      <HomeDashboard />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="usersList"
                  element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                      <UsersList />
                    </RoleProtectedRoute>
                  }
                >
                  <Route
                    path="updateuser/:id"
                    element={
                      <RoleProtectedRoute allowedRoles={["admin"]}>
                        <UpdateUser />
                      </RoleProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path="addUser"
                  element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                      <AddUser />
                    </RoleProtectedRoute>
                  }
                />

                {/* Routes accessible by all logged-in users */}
                <Route path="ticketlist" element={<TicketList />} />
                <Route path="newticket" element={<NewTicket />} />
                <Route path="ticketview/:id" element={<TicketView />} />
                <Route path="printticket" element={<PrintTicket />} />
                <Route path="exporttickets" element={<ExportTickets />} />

                {/* Admin or SupportIT roles */}
                <Route
                  path="statistiques"
                  element={
                    <RoleProtectedRoute allowedRoles={["admin", "supportIt"]}>
                      <Statistiques />
                    </RoleProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Flex>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
