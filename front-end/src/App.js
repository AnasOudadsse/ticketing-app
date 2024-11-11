import { ChakraProvider, Flex } from "@chakra-ui/react";
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
import RoleProtectedRoute from "./component/Route-Protection/RoleProtectiongRoute";
import { ProtectedRoute } from "./component/Route-Protection/ProtectedRoute";
import Unauthorized from "./component/Route-Protection/Unauthorized";
import { ProfilePage } from "./component/Profile/Profile";
import AuthCheck from "./component/authCheck/AuthCheck";


function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Flex fontFamily={"inter"} w={"100%"} bg={"#F9F9FB"}>
          <Routes>
            {/* Public Route */}
            
            <Route path="" element={<AuthCheck />} />
            <Route path="login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized/>} />

            {/* Protected Routes: Only accessible by authenticated users */}
            <Route element={<ProtectedRoute />}>

            <Route path="/profile" element={<ProfilePage/>} />


              <Route path="tickets" element={<Dashboard />}>
                {/* Admin-only routes */}
                <Route
                  path="exporttickets"
                  element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                      <ExportTickets />
                    </RoleProtectedRoute>
                  }
                />

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
