import {
  Avatar,
  Box,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  useToast,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useHttp from "../customHook/useHttp";
import { CgProfile } from "react-icons/cg";
import { SlLogout } from "react-icons/sl";
import { useEffect, useState } from "react";
import LinkSideBar from "../link-side-bar/link-side-bar";
import { faHome, faUsers, faTicket, faFileExport } from "@fortawesome/free-solid-svg-icons";

const Header = ({ greeting }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { loading, sendRequest } = useHttp();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Drawer

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request = {
      url: "http://127.0.0.1:8000/api/user",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, (data) => setUser(data));
    setRole(localStorage.getItem("role")); // Fetch role from localStorage
  }, [sendRequest]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("id");
      localStorage.removeItem("role");

      navigate("/login");

      toast({
        title: "Logout successful",
        description: "You've been logged out successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Unable to log out. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return null;

  const SidebarLinks = () => (
    <VStack align="stretch" spacing={4}>
      {role === "admin" && (
        <LinkSideBar link={"tickets"} title={"Dashboard"} icon={faHome} />
      )}
      {role === "admin" && (
        <LinkSideBar link={"tickets/usersList"} title={"Users"} icon={faUsers} />
      )}
      <LinkSideBar link={"tickets/ticketlist"} title={"Tickets"} icon={faTicket} />
      <LinkSideBar
        link={"tickets/exporttickets"}
        title={"Export Tickets"}
        icon={faFileExport}
      />
    </VStack>
  );

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      rounded="xl"
      p={4}
      bg="white"
      shadow="sm"
    >
      {/* Left Section: Greeting and Hamburger Icon */}
      <HStack spacing={4}>
        {/* Hamburger Menu for Small Screens */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: "block", lg: "none" }}
          onClick={onOpen}
          variant="outline"
        />
        <VStack align="start" spacing={0} display={{ base: "none", md: "block" }}>
          <Text fontSize="lg">Hello {user.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {greeting}
          </Text>
        </VStack>
      </HStack>

      {/* Right Section: User Info and Dropdown */}
      <Box position="relative">
        <Menu>
          <MenuButton
            alignItems="center"
            cursor="pointer"
            _hover={{ bg: "gray.100", rounded: "md" }}
          >
            <Flex             
              gap={3} // Spacing between items
            >
                <Avatar mx={3} size="md" name={user.name} bg="teal.500" />
                <VStack
                  align="start"
                  spacing={0}
                  display={{ base: "none", sm: "block",  }} // Hide on small screens
                >
                  <Text>{user.name}</Text>
                  <Text fontSize="sm" color="gray.400">
                    {user.function}
                  </Text>
                </VStack>
                <FontAwesomeIcon
                  icon={isMenuOpen ? faAngleDown : faAngleUp}
                  className="cursor-pointer"
              />
            </Flex>
          </MenuButton>

          <MenuList
            mt={2}
            shadow="lg"
            rounded="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <MenuItem gap={3} onClick={() => navigate("/profile")}>
              <CgProfile />
              Profile
            </MenuItem>
            <MenuDivider />
            <MenuItem
              gap={3}
              onClick={handleLogout}
              _hover={{ bg: "red.50", color: "red.500" }}
            >
              <SlLogout />
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Drawer for Sidebar Links on Small Screens */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <div className="flex justify-center w-full h-40 grid grid-cols content-center">
              <img src="/assets/images/UM6SS.webp" className="w-full h-16 px-4" alt="Logo" />
            </div>
            <SidebarLinks />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
