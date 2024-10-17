import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../header/header";

export const TicketView = () => {
  const [ticket, setTicket] = useState(null); // Store fetched ticket
  const toast = useToast();
  const { id } = useParams();
  const supportItID = localStorage.getItem("id");

  console.log(ticket);

  // Fetch ticket details when the component mounts
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/tickets/get/${id}`
        );
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast({
          title: "Error",
          description: "Failed to fetch the ticket.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchTicket();
  }, [toast]);

  // Function to handle reserving a ticket
  const handleReserve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/reserve`, {
        supportItID: supportItID, // Send the supportItID in the request body
      });
      toast({
        title: "Success",
        description: "The ticket has been reserved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally refetch ticket data to reflect the new status
      setTicket({ ...ticket, status: "reserved" });
    } catch (error) {
      console.error("Error reserving the ticket:", error);
      toast({
        title: "Error",
        description: "Failed to reserve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlerResolve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/resolve`, {
        supportItID: supportItID, // Send the supportItID in the request body
      });
      toast({
        title: "Success",
        description: "The ticket has been reserved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally refetch ticket data to reflect the new status
      setTicket({ ...ticket, status: "reserved" });
    } catch (error) {
      console.error("Error reserving the ticket:", error);
      toast({
        title: "Error",
        description: "Failed to reserve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    window.print(); 
  };

  if (!ticket) {
    return <Text>Loading ticket...</Text>; 
  }

  return (
    <div>
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <Box
        alignContent={"center"}
        maxW="800px"
        w={"500px"}
        h={"fit-content"}
        mx="auto"
        mt={10}
        p={6}
        shadow="md"
        borderWidth="1px"
        rounded="md"
      >
        {/* Ticket Info */}
        <Heading size="lg" mb={4}>
          Ticket #{ticket.id} - {ticket?.problem?.specification}
        </Heading>

        <VStack align="start" spacing={4}>
          <HStack>
            <Text fontWeight="bold">Status:</Text>
            <Text>{ticket.status}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Posted Time:</Text>
            <Text>
              {new Date(ticket.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
            </Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">Name:</Text>
            <Text>{ticket.problem?.specification}</Text>
          </HStack>
          <Text fontWeight="bold">Description:</Text>
          <Text>{ticket.description}</Text>

          {/* Display image if available */}
          {ticket.image && (
            <Box mt={4}>
              <Image
                src={ticket.image}
                alt="Ticket Image"
                boxSize="300px"
                objectFit="cover"
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Flex w="full" mt={6}>
            {/* Show Reserve button if status is published */}
            {ticket.status === "published" && (
              <Button colorScheme="blue" onClick={handleReserve}>
                Reserve Ticket
              </Button>
            )}

            <Spacer />

            {/* Show Print button if status is resolved */}
            {ticket.status === "resolved" && (
              <Button colorScheme="green" onClick={handlePrint}>
                Print Ticket
              </Button>
            )}

            {ticket.status === "reserved" && (
              <Button colorScheme="red" onClick={handlerResolve}>
                Close ticket
              </Button>
            )}
          </Flex>
        </VStack>
      </Box>
    </div>
  );
};
