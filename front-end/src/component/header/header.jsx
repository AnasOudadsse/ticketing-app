import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useHttp from "../customHook/useHttp";
import { CgProfile } from "react-icons/cg";
import { SlLogout } from "react-icons/sl";

const Header = ({ greeting }) => {
  const [user, setUser] = useState({});
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { loading, sendRequest } = useHttp();
  const navigate = useNavigate();
  const toast = useToast();

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
  }, []);

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

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      rounded="xl"
      p={5}
      mb={5}
      bg="white"
    >
      {/* Greeting Section */}
      <VStack align="start" spacing={0}>
        <Text fontSize="lg">Hello {user.name}</Text>
        <Text fontSize="sm" color="gray.500">
          {greeting}
        </Text>
      </VStack>

      {/* User Info and Dropdown Menu */}
      <Box  position="relative">
        <Menu>
          <MenuButton
            as={Flex}
            alignItems="center"
            gap={3}
            cursor="pointer"
            _hover={{ bg: "gray.100", rounded: "md" }}
          >
            <Flex>
              <Avatar mx={3} size="md" name={user.name} bg="teal.500" />
              <VStack align="start" spacing={0}>
                <Text>{user.name}</Text>
                <Text fontSize="sm" color="gray.400">
                  {user.function}
                </Text>
              </VStack>
              <Flex ml={'65px'} mr={5} alignItems={'center'}>
                <FontAwesomeIcon
                  icon={isMenuOpen ? faAngleDown : faAngleUp}
                  className="cursor-pointer"
                />
              </Flex>
              
            </Flex>
          </MenuButton>

          <MenuList
            mt={2}
            shadow="lg"
            rounded="md"
            border="1px solid"
            borderColor="gray.200"
            animation="ease-in-out 0.2s"
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
    </Flex>
  );
};

export default Header;
