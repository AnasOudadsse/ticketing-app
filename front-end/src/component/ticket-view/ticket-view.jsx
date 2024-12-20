import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
  Avatar,
  IconButton,
  useToast,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from "@chakra-ui/react";
import { FaPrint, FaDownload, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import { formatDistanceToNow } from "date-fns";

export const TicketView = () => {
  const [ticket, setTicket] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the assignment modal
  const [supportUsers, setSupportUsers] = useState([]); // List of Support IT users
  const [selectedSupportUser, setSelectedSupportUser] = useState(""); // Selected user for assignment
  const toast = useToast();
  const { id } = useParams();
  const logged_id = localStorage.getItem("id");

  console.log(ticket);
  
  // Fetch the user's role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Get access token from localStorage
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in the request header
          },
        });
        console.log('response' ,response.data);
        
        setUserRole(response.data.role); // Store user role in state
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchUserRole();
  }, [toast]);

  // Fetch ticket details
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
  }, [id, toast]);

  // Fetch list of Support IT users
  const fetchSupportUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getSuppotIts"); // Adjust endpoint as necessary
      setSupportUsers(response.data);
    } catch (error) {
      console.error("Error fetching support users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch support users.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Assign ticket
  const handleAssign = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tickets/${id}/assign`,
        { reserved_by: selectedSupportUser },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      toast({
        title: "Success",
        description: "Ticket assigned successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReserve = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/tickets/${id}/reserve`, {
        reserved_by: logged_id,
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

  const handlerResolve = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tickets/${id}/resolve`, {
        resolved_by: logged_id,
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

  const handleCloseTicket = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tickets/${id}/close`, {
        closed_by: logged_id,
      });
      toast({
        title: "Success",
        description: "The ticket has been closed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTicket({ ...ticket, status: "closed" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close the ticket.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadImage = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tickets/${ticket.id}/download-attachment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        responseType: 'blob', // Expect a binary file
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attachment_${ticket.id}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      toast({
        title: "Error",
        description: "Failed to download attachment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  if (!ticket) {
    return <Text>Loading ticket...</Text>;
  }

  return (
    <div>
      <Header
        name={ticket.creator?.name}
        greeting={"Have a nice day"}
        role={userRole}
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
          <Avatar size="md" name={ticket.creator?.name} bg="teal.500" />
          <Box ml={4}>
            <Heading size="sm">{ticket.creator?.name}</Heading>
            <Text fontSize="sm" color="gray.500">
              Ticket Creator
            </Text>
          </Box>
        </Flex>

        <hr />

        <Flex mt={5} justify="space-between">
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
              onClick={downloadImage}
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
          <Tag colorScheme="yellow">
            {ticket?.problem?.specification || ticket?.problem?.name}
          </Tag>
        </HStack>

        {ticket.attachement && (
          <Box mt={4} textAlign="start">
            <Button
              size="sm"
              title="Download Attachment"
              colorScheme="green"
              onClick={downloadImage}
            >
              Download Attachment
              <Icon as={FaDownload} ml={3} />
            </Button>
          </Box>
        )}

        <Flex mt={6} justifyContent="end" align="center">
          <HStack spacing={4}>
            {userRole === "client" && ticket.status === "opened" && (
              <Button colorScheme="red" onClick={handleCloseTicket} size="sm">
                Close Ticket
              </Button>
            )}
            {["admin", "supportIt"].includes(userRole) && (
              <>
                {ticket.status === "opened" && (
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
                    Resolve Ticket
                  </Button>
                )}
              </>
            )}
            {userRole === "admin" && ticket.status === 'opened' && (
              <Button
                colorScheme="blue"
                size="sm"
                leftIcon={<FaUserPlus />}
                onClick={() => {
                  setIsModalOpen(true);
                  fetchSupportUsers();
                }}
              >
                Assign
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Assign Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Select a Support IT to assign this ticket:</Text>
            <Select
              placeholder="Select Support IT"
              onChange={(e) => setSelectedSupportUser(e.target.value)}
            >
              {supportUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleAssign}
              isDisabled={!selectedSupportUser}
            >
              Assign
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
