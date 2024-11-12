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
  Spinner,
} from "@chakra-ui/react";
import { FaPrint, FaDownload, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../header/header";
import { formatDistanceToNow } from "date-fns";

export const TicketView = () => {
  const [ticket, setTicket] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportUsers, setSupportUsers] = useState([]); // List of Support IT users
  const [selectedSupportUser, setSelectedSupportUser] = useState(""); // Selected user for assignment
  const toast = useToast();
  const { id } = useParams();
  const logged_id = localStorage.getItem("id");

  // Fetch the user's role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
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

  const handleAssign = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tickets/${id}/assign`,
        { assigned_to: selectedSupportUser },
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

  if (!ticket) return <Text>Loading ticket...</Text>;

  return (
    <div>
      <Header name={ticket.creator?.name} greeting={"Have a nice day"} role={userRole} />
      <Box textAlign="center" m={10}>
        <Heading size="lg">Ticket Details</Heading>
        <Text fontSize="md" color="gray.600" mt={2}>
          Here are the full details of the ticket, including the problem, creator, and status.
        </Text>
      </Box>
      <Box maxW="600px" mx="auto" p={6} shadow="lg" borderWidth="1px" rounded="lg" bg="white">
        <Flex align="center" mb={4}>
          <Avatar size="md" name={ticket.creator?.name} bg="teal.500" />
          <Box ml={4}>
            <Heading size="sm">{ticket.creator?.name}</Heading>
            <Text fontSize="sm" color="gray.500">Ticket Creator</Text>
          </Box>
        </Flex>
        <Flex mt={5} justify="space-between">
          <Heading size="md" mb={2}>
            {ticket?.problem?.specification || ticket?.problem?.name}
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={4}>
            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
          </Text>
        </Flex>
        <Text mb={4}>{ticket.description}</Text>

        {/* Assign button for Admin */}
        {userRole === "admin" && (
          <Button colorScheme="blue" size="sm" leftIcon={<FaUserPlus />} onClick={() => {
            setIsModalOpen(true);
            fetchSupportUsers();
          }}>
            Assign
          </Button>
        )}

        {/* Assign Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Assign Ticket</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Select a Support IT to assign this ticket:</Text>
              <Select placeholder="Select Support IT" onChange={(e) => setSelectedSupportUser(e.target.value)}>
                {supportUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAssign} isDisabled={!selectedSupportUser}>
                Assign
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};
