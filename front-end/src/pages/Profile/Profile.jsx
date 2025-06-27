import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Heading,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  Divider,
  Grid,
  IconButton,
  Tag,
  TagLabel,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUserTie,
  FaCheck,
} from "react-icons/fa";
import Header from "../header/header";
import axios from "axios";
import SideBar from "../side-bar/side-bar";

export const ProfilePage = () => {
  const [userData, setUserData] = useState();
  const [stats, setStats] = useState({
    ticketsHandled: 0,
    resolvedTickets: 0,
    recentTickets: [],
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.error("Token is missing. Please log in.");
          //   navigate("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("user :", response.data);

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // navigate("/login"); // Redirect to login if user fetching fails
      }
    };

    fetchUser();
  }, [toast]);

  useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Use token for authorization
        console.log("Access Token:", token);

        const response = await axios.get(
          "http://127.0.0.1:8000/api/getUserStats",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("stats :", response.data);
        console.log("response :", response);

        setStats(response.data); // Save the data in state
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch statistics.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchClientStats();
  }, [toast]);

  if (loading)
    return (
      <Flex w={"full"} h={"container.md"} justify={"center"} align={"center"}>
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <div className="flex w-full">
      <SideBar />
      <div className="container px-1 mx-auto overflow-x-hidden">
        <Box w={"full"}>
          <Header />
          <Box
            transform={"scale(0.94)"}
            maxW="700px"
            mx="auto"
            p={6}
            bg="white"
            shadow="md"
            rounded="lg"
          >
            {/* Header Section */}
            <HStack spacing={6} alignItems="center">
              <Avatar
                size="xl"
                // src={userData?.profileImage}
                name={userData?.name}
              />
              <VStack alignItems="start" gap={3}>
                <Heading size={"lg"}>{userData?.name}</Heading>
                <HStack>
                  <Tag colorScheme="blue">
                    <TagLabel>{userData?.departement}</TagLabel>
                  </Tag>
                  <Badge colorScheme="green" px={2}>
                    Online
                  </Badge>
                </HStack>
                <Text color="gray.500">{userData?.localisation}</Text>
                <Flex align={"center"} gap={2}>
                  <FaUserTie />
                  <Text color="gray.500">{userData?.role}</Text>
                </Flex>
              </VStack>
            </HStack>

            <Divider my={6} />

            {/* Contact Information */}
            <VStack align="start" spacing={4} mt={4}>
              <Heading size="md">Contact Information</Heading>
              <HStack>
                <FaEnvelope />
                <Text>{userData?.email}</Text>
              </HStack>
              <HStack>
                <FaPhone />
                <Text>+ 222 4478596</Text>
              </HStack>
              <HStack>
                <FaGlobe />
                <Text>{userData?.localisation}</Text>
              </HStack>
            </VStack>

            {userData?.role === "supportIt" && (
              <>
                <Divider my={6} />
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  gap={6}
                  textAlign="center"
                >
                  <Box>
                    <Heading size="lg">{stats.ticketsReserved}</Heading>
                    <Text color="gray.500">Reserved Tickets</Text>
                  </Box>
                  <Box>
                    <Heading size="lg">{stats.ticketsResolved}</Heading>
                    <Text color="gray.500">Resolved Tickets</Text>
                  </Box>
                </Grid>
                <Divider my={6} />
                <VStack align="start" spacing={4}>
                  <Heading size="md">Recent Tickets</Heading>
                  {stats.recentTickets.map((ticket) => (
                    <HStack
                      key={ticket.id}
                      w="full"
                      p={4}
                      bg="gray.100"
                      rounded="md"
                      justifyContent="space-between"
                    >
                      <Box>
                        {ticket.problem && (
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            {ticket.problem.name}
                          </Text>
                        )}
                        <Text fontWeight="bold">{ticket.title}</Text>
                        <Badge
                          colorScheme={
                            ticket.status === "resolved"
                              ? "red"
                              : ticket.status === "reserved"
                              ? "yellow"
                              : "black"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              </>
            )}
            {/* Logout */}
            <Box mt={10} textAlign="center">
              <Button
                colorScheme="green"
                size="md"
                onClick={() => console.log("Logout clicked")}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
