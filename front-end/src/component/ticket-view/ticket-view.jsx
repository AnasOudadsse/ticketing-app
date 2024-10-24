import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Tag,
  Text,
  VStack,
  Avatar,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaPrint, FaDownload, FaHeart, FaShareAlt } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import { formatDistanceToNow } from "date-fns";

export const TicketView = () => {
  const [ticket, setTicket] = useState(null);
  const toast = useToast();
  const { id } = useParams();
  const supportItID = localStorage.getItem("id");

  console.log(ticket);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/tickets/get/${id}`
        );
        setTicket(response.data);
      } catch (error) {
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

  const handleReserve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/reserve`, {
        supportItID: supportItID,
      });
      toast({
        title: "Success",
        description: "The ticket has been reserved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTicket({ ...ticket, status: "reserved" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase()) // Get the first letter of each part
      .join(""); // Combine them
    return initials.length > 2 ? initials.slice(0, 2) : initials; // Limit to 2 letters
  };

  const handlerResolve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/resolve`, {
        supportItID: supportItID,
      });
      toast({
        title: "Success",
        description: "The ticket has been resolved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTicket({ ...ticket, status: "resolved" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = ticket.image;
    link.download = "ticket_image.jpg";
    link.click();
  };

  if (!ticket) {
    return <Text>Loading ticket...</Text>;
  }

  return (
    <div>
      <Header
        name={ticket.creator?.name}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <Box textAlign="center" m={10}>
        <Heading size="lg">Ticket Details</Heading>
        <Text fontSize="md" color="gray.600" mt={2}>
          Here are the full details of the ticket, including the problem, creator, and status.
        </Text>
      </Box>
      <Box
        maxW="600px"
        w="full"
        mx="auto"
        mt={10}
        p={6}
        shadow="lg"
        borderWidth="1px"
        rounded="lg"
        bg="white"
      >
        
        <Flex align="center" mb={4}>
        <Avatar
          size="md"
          name={ticket.creator?.name}
          bg="teal.500"
        />
          <Box ml={4}>
            <Heading size="md">{ticket.creator?.name}</Heading>
            <Text fontSize="sm" color="gray.500">
              Ticket Creator
            </Text>
          </Box>
        </Flex>

        <Flex justify={'space-between'}>
          <Heading size="md" mb={2}>
            {ticket?.problem?.specification || ticket?.problem?.name}
          </Heading>

          <Text fontSize="sm" color="gray.500" mb={4}>
            {formatDistanceToNow(new Date(ticket.created_at), {
              addSuffix: true,
            })}
          </Text>


        </Flex>

          <Text mb={4}>{ticket.description}</Text>
        {ticket.image && (
          <Box mt={4} textAlign="center">
            <Image
              src={ticket.image}
              alt="Ticket Image"
              boxSize="300px"
              objectFit="cover"
              cursor="pointer"
              onClick={downloadImage} // Download image on click
              rounded="md"
            />
            <IconButton
              mt={2}
              icon={<FaDownload />}
              aria-label="Download Image"
              onClick={downloadImage}
              colorScheme="blue"
              size="sm"
            />
          </Box>
        )}

        <HStack spacing={2} mt={6}>
          <Tag colorScheme="green">{ticket?.problem?.type}</Tag>
          <Tag colorScheme="yellow">{ticket?.problem?.specification || ticket?.problem?.name }</Tag>
        </HStack>

        <Flex mt={6} justifyContent="end" align="center">

          <HStack spacing={4}>
            {ticket.status === "published" && (
              <Button colorScheme="blue" onClick={handleReserve} size="sm">
                Reserve Ticket
              </Button>
            )}
            {ticket.status === "resolved" && (
              <Button colorScheme="green" onClick={handlePrint} size="sm">
                Print Ticket
              </Button>
            )}
            {ticket.status === "reserved" && (
              <Button colorScheme="red" onClick={handlerResolve} size="sm">
                Close Ticket
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>
    </div>
  );
};
