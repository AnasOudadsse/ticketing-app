import {
  faHome,
  faUsers,
  faTicket,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import LinkSideBar from "../link-side-bar/link-side-bar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [role, setRole] = useState("");
  const [isLargerScreen] = useMediaQuery("(min-width: 1000px)"); // Chakra's media query hook

  // Fetch the role from localStorage or API (in case it changes dynamically)
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  // Only render the sidebar if the screen is larger than 768px
  if (!isLargerScreen) return null;

  return (
    <div className="min-w-60 bg-white w-70 h-screen sticky top-0 left-0">
      {/* Logo */}
      <div className="flex justify-center w-full h-40 grid grid-cols content-center">
        <img src="/assets/images/UM6SS.webp" className="w-full h-16 px-4" alt="Logo" />
      </div>

      {/* Links */}
      <div className="flex justify-center pl-10">
        <ul className="w-full">
          <Box>
            {/* Dashboard: Admin-only */}
            {role === "admin" && (
              <LinkSideBar link={"tickets"} title={"Dashboard"} icon={faHome} />
            )}

            {/* Users: Admin-only */}
            {role === "admin" && (
              <LinkSideBar
                link={"tickets/usersList"}
                title={"Users"}
                icon={faUsers}
              />
            )}

            {/* Tickets: Visible to all roles */}
            <LinkSideBar
              link={"tickets/ticketlist"}
              title={"Tickets"}
              icon={faTicket}
            />

            {/* Export Tickets: Admin-only */}
            <LinkSideBar
              link={"tickets/exporttickets"}
              title={"Export Tickets"}
              icon={faFileExport}
            />
          </Box>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
