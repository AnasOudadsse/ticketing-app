import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  Avatar,
  Badge,
  Spacer,
  Select,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";

// TicketItem Component
const TicketItem = ({ statusColor,problemName, ticketNumber, priority, postedTime, name, description, status }) => {
  return (
    <Box p={5} w={'500px'} shadow="md" borderWidth="1px" rounded="md">
      <HStack>
        <Box bg={statusColor} boxSize={3} borderRadius="full" />
        <Flex gap={20}>
          <Heading size="md">Ticket: #{ticketNumber}</Heading>
          <Badge colorScheme={statusColor} >
            {status}
          </Badge>
        </Flex>
        {priority && <Badge colorScheme="red">{priority}</Badge>}
        <Spacer />
        <Text color="gray.500">
          Posted at {new Date(postedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </HStack>

      <Heading mt={3} size="sm">Problem: {problemName}</Heading>
      <Text mt={2} noOfLines={2}>
        {description}
      </Text>
      <HStack mt={4}>
        <Avatar name={name} src="https://bit.ly/broken-link" />
        <Text>{name}</Text>
        <Spacer />
        <Button variant="link" colorScheme="purple">
          Open Ticket
        </Button>
      </HStack>
    </Box>
  );
};

export default function TicketList() {
  const [tickets, setTickets] = useState([]); // Store fetched tickets
  const [filteredTickets, setFilteredTickets] = useState([]); // Store filtered tickets based on tabs
  const [loading, setLoading] = useState(true); 
  const [problemName, setProblemName] = useState("");
  const [selectedTab, setSelectedTab] = useState("all"); // Manage selected tab state
  const toast = useToast();

  console.log(tickets);
  console.log(problemName);

  
  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tickets/getTicketsWithProblems");
        setTickets(response.data);
        setFilteredTickets(response.data); 
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tickets from the server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchTickets();
  }, [toast]);


  // Handle Tab Change
  const handleTabChange = (index) => {
    if (index === 0) {
      // All Tickets Tab: show all tickets
      setFilteredTickets(tickets);
    } else if (index === 1) {
      // reserved Tab: show tickets with status 'reserved'
      const filtered = tickets.filter(ticket => ticket.status === 'reserved');
      setFilteredTickets(filtered);
    } else if (index === 2) {
      // Resolved Tab: show tickets with status 'resolved'
      const filtered = tickets.filter(ticket => ticket.status === 'resolved');
      setFilteredTickets(filtered);
    }
  };

  return (
    <Box mx="20" w={"1000px"} p={6}>
      {/* Search and Filters */}
      <Flex mb={4} alignItems="center">
        <Input placeholder="Search for ticket" width="300px" />
        <Spacer />
        {/* <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Select Priority
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Box boxSize={2} bg="blue.400" borderRadius="full" mr={2} />
              New Tickets
            </MenuItem>
            <MenuItem>
              <Box boxSize={2} bg="orange.400" borderRadius="full" mr={2} />
              reserved Tickets
            </MenuItem>
            <MenuItem>
              <Box boxSize={2} bg="green.400" borderRadius="full" mr={2} />
              Resolved Tickets
            </MenuItem>
          </MenuList>
        </Menu> */}
        <Select ml={4} placeholder="This Week" width="150px">
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </Select>
        <Button colorScheme="green" ml={4}>
          <a href="newticket">New Ticket</a>
          
        </Button>
      </Flex>

      {/* Tabs */}
      <Tabs variant="enclosed-colored" onChange={handleTabChange}>
        <TabList>
          <Tab>All Tickets</Tab>
          <Tab>reserved</Tab>
          <Tab>Resolved</Tab>
        </TabList>
      </Tabs>

      {/* Ticket Items */}
      <VStack spacing={4} mt={6}>
  {!loading && filteredTickets.length > 0 ? (
    filteredTickets.map((ticket) => (
      <TicketItem
        key={ticket.id}
        statusColor={
          ticket.status === "published"
            ? "green"
            : ticket.status === "reserved"
            ? "orange"
            : "red"
        }
        status={ticket.status}
        ticketNumber={ticket.id}
        problemName={ticket?.problem?.name }
        priority={ticket.priority}
        postedTime={ticket.created_at}
        name={ticket.name}
        description={ticket.description}
      />
    ))
  ) : (
    <Text>No tickets found.</Text>
  )}
</VStack>

      {/* Pagination (if necessary) */}
      <Flex mt={8} justifyContent="center" alignItems="center">
        <Button variant="link">Previous</Button>
        <Button mx={2} colorScheme="green">
          1
        </Button>
        <Button variant="link">2</Button>
        <Button variant="link" ml={4}>
          Next
        </Button>
      </Flex>
    </Box>
  );
}
