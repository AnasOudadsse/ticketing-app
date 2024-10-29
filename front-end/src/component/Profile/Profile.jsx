import React, { useState, useEffect } from 'react';
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
  Spinner
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaGlobe, FaUserTie, FaCheck } from "react-icons/fa";
import Header from '../header/header';
import axios from 'axios';

export const ProfilePage = () => {

    const [userData, setUserData] = useState()
    const [stats, setStats] = useState({ ticketsHandled: 0, resolvedTickets: 0, performanceRating: "0 / 5.0" });
    const [loading, setLoading] = useState(true);
    const toast = useToast();

  const fakeUserData = {
    name: "John Doe",
    role: "Support Agent",
    profileImage: "https://via.placeholder.com/150",
    departement: "IT Support",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    localisation: "New York Office",
    ticketsHandled: 76,
    resolvedTickets: 72,
    rating: 4.8,
    recentTickets: [
      { id: 101, status: "Resolved", title: "PC not starting", priority: "High" },
      { id: 102, status: "In Progress", title: "Email not syncing", priority: "Medium" },
      { id: 103, status: "Open", title: "VPN Access issue", priority: "Low" },
    ],
    interests: ["Problem-solving", "Technical Support", "Customer Service"],
  };


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
            console.log('user :',response.data);
            
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
        const response = await axios.get("http://127.0.0.1:8000/api/user/getUserStats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('stats :',response.data);
        
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

  if (loading) return(
    <Flex w={'full'} h={'container.md'} justify={'center'} align={'center'}>
        <Spinner size="lg" /> 
    </Flex>
    )
  

  return (
    <Box w={'full'}>
        <Header/>
        <Box maxW="700px" mx="auto" mt={10} p={6} bg="white" shadow="md" rounded="lg">
        {/* Header Section */}
        <HStack spacing={6} alignItems="center">
            <Avatar
            size="xl"
            // src={userData?.profileImage}
            name={userData?.name}
            />
            <VStack alignItems="start" gap={3}>
            <Heading size={'lg'}>{userData?.name}, {userData?.role}</Heading>
            <HStack>
                <Tag colorScheme="blue">
                <TagLabel>{userData?.departement}</TagLabel>
                </Tag>
                <Badge colorScheme="green" px={2}>
                Online
                </Badge>
            </HStack>
            <Text color="gray.500">
                {userData?.localisation} 
            </Text>
            <Flex align={'center'} gap={2}>
                <FaUserTie /> 
                <Text color="gray.500">
                    {userData?.role}
                </Text>

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
            <Text>{fakeUserData?.phone}</Text>
            </HStack>
            <HStack>
            <FaGlobe />
            <Text>{userData?.localisation}</Text>
            </HStack>
        </VStack>

        <Divider my={6} />

        {/* Stats */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6} justifyContent={"space-around"} textAlign="center">
            <Box>
            <Heading size="lg">{stats?.ticketsReserved}</Heading>
            <Text color="gray.500">Tickets opened</Text>
            </Box>
            <Box>
            <Heading size="lg">{stats?.ticketsResolved}</Heading>
            <Text color="gray.500">Resolved Tickets</Text>
            </Box>
        </Grid>
        <Divider my={6} />

        {/* Recent Tickets */}
        <VStack align="start" spacing={4}>
            <Heading size="md">Recent Tickets</Heading>
            {fakeUserData?.recentTickets.map((ticket) => (
            <HStack
                key={ticket.id}
                w="full"
                p={4}
                bg="gray.100"
                rounded="md"
                justifyContent="space-between"
            >
                <Box>
                <Text fontWeight="bold">{ticket.title}</Text>
                <Badge colorScheme={
                    ticket.status === "Resolved"
                    ? "green"
                    : ticket.status === "In Progress"
                    ? "yellow"
                    : "red"
                }>
                    {ticket.status}
                </Badge>
                </Box>
                <Tag size="sm" colorScheme="red">
                {ticket.priority} Priority
                </Tag>
            </HStack>
            ))}
        </VStack>

        <Divider my={6} />

        {/* Interests */}
        <VStack align="start" spacing={4}>
            <Heading size="md">Interests</Heading>
            <HStack spacing={2}>
            {fakeUserData?.interests.map((interest) => (
                <Badge key={interest} colorScheme="purple" px={3} py={1} rounded="md">
                {interest}
                </Badge>
            ))}
            </HStack>
        </VStack>

        <Divider my={6} />

        {/* Logout */}
        <Box mt={6} textAlign="center">
            <Button
            colorScheme="red"
            size="lg"
            onClick={() => console.log("Logout clicked")}
            >
            Logout
            </Button>
        </Box>
        </Box>
    </Box>
  );
};

