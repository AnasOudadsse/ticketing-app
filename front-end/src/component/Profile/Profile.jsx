import React from 'react';
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
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaGlobe, FaUserTie, FaCheck } from "react-icons/fa";

export const ProfilePage = () => {
  const userData = {
    name: "John Doe",
    role: "Support Agent",
    profileImage: "https://via.placeholder.com/150",
    department: "IT Support",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York Office",
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

  return (
    <Box maxW="1000px" mx="auto" mt={10} p={6} bg="white" shadow="md" rounded="lg">
      {/* Header Section */}
      <HStack spacing={6} alignItems="center">
        <Avatar
          size="2xl"
          src={userData.profileImage}
          name={userData.name}
        />
        <VStack alignItems="start" spacing={1}>
          <Heading>{userData.name}, {userData.role}</Heading>
          <HStack>
            <Tag colorScheme="blue">
              <TagLabel>{userData.department}</TagLabel>
            </Tag>
            <Badge colorScheme="green" px={2}>
              Online
            </Badge>
          </HStack>
          <Text color="gray.500">
            {userData.location} • <FaUserTie /> {userData.role}
          </Text>
        </VStack>
      </HStack>

      <Divider my={6} />

      {/* Contact Information */}
      <VStack align="start" spacing={4} mt={4}>
        <Heading size="md">Contact Information</Heading>
        <HStack>
          <FaEnvelope />
          <Text>{userData.email}</Text>
        </HStack>
        <HStack>
          <FaPhone />
          <Text>{userData.phone}</Text>
        </HStack>
        <HStack>
          <FaGlobe />
          <Text>{userData.location}</Text>
        </HStack>
      </VStack>

      <Divider my={6} />

      {/* Stats */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} textAlign="center">
        <Box>
          <Heading size="lg">{userData.ticketsHandled}</Heading>
          <Text color="gray.500">Tickets Handled</Text>
        </Box>
        <Box>
          <Heading size="lg">{userData.resolvedTickets}</Heading>
          <Text color="gray.500">Resolved Tickets</Text>
        </Box>
        <Box>
          <Heading size="lg">{userData.rating} / 5.0</Heading>
          <Text color="gray.500">Performance Rating</Text>
        </Box>
      </Grid>

      <Divider my={6} />

      {/* Recent Tickets */}
      <VStack align="start" spacing={4}>
        <Heading size="md">Recent Tickets</Heading>
        {userData.recentTickets.map((ticket) => (
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
          {userData.interests.map((interest) => (
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
  );
};

