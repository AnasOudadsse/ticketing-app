import { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  VStack,
  Avatar,
  Badge,
  Spacer,
  Tabs,
  Tab,
  TabList,
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import { formatDistanceToNow } from 'date-fns';

// Utility to check if a date is today, this week, or this month
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isThisWeek = (date) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  return date >= startOfWeek;
};

const isThisMonth = (date) => {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// TicketItem Component
const TicketItem = ({
  statusColor,
  problemName,
  ticketNumber,
  priority,
  postedTime,
  name,
  description,
  status,
  created_by,
  reserved_by
}) => {
  const navigate = useNavigate();

  const handleOpenTicket = () => {
    navigate(`/tickets/ticketview/${ticketNumber}`);
  };


  
  return (
    <Fragment>

      <Box p={5} my={2} w={"full"} shadow="md" borderWidth="1px" rounded="md">
        <HStack>
          <Box bg={statusColor} boxSize={3} borderRadius="full" />
          <Flex  gap={350} >
            <Heading  size="md">Ticket: #{ticketNumber}</Heading>
            <Badge   alignContent={'center'} colorScheme={statusColor}>{status} {status === 'reserved' && (
              <span>by</span>
            )} {reserved_by}</Badge>
          </Flex>
          {priority && <Badge colorScheme="red">{priority}</Badge>}
          <Spacer />
          <Text  color="gray.500">
            Posted{" "}
            {formatDistanceToNow(new Date(postedTime), { addSuffix: true })}

          </Text>
        </HStack>

        <Heading  my={5} size="sm">
          Problem: {problemName}
        </Heading>
        <Text mb={4} mt={2} noOfLines={2}>
          {description}
        </Text>
        <hr />
        <HStack mt={4}>
          <Avatar size={"sm"}  mr={2} name={name} />
          <Text color={"#7B7B7B"}>{name}</Text>

          <Spacer />
          <Button
            variant="link"
            colorScheme="purple"  
            onClick={handleOpenTicket}
          >
            Open Ticket
          </Button>
        </HStack>
      </Box>
    </Fragment>
  );
};

export default function TicketList() {
  const [tickets, setTickets] = useState([]); // All tickets
  const [filteredTickets, setFilteredTickets] = useState([]); // Tickets after search or filter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [timeFilter, setTimeFilter] = useState(""); // Time filter state
  const [selectedTab, setSelectedTab] = useState("all"); // Manage selected tab state
  const toast = useToast();

  console.log(tickets);
  

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/tickets/getTicketsWithProblems"
        );
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

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, timeFilter, selectedTab);
  };

  // Handle time filter
  const handleTimeFilter = (e) => {
    const filter = e.target.value;
    setTimeFilter(filter);
    applyFilters(searchTerm, filter, selectedTab);
  };

  // Handle Tab Change for status filtering
  const handleTabChange = (index) => {
    let tab = "all";
    if (index === 1) {
      tab = "opened";
    } else if (index === 2) {
      tab = "reserved";
    } else if (index === 3) {
      tab = "resolved";
    } else if (index === 4) {
      tab = "closed";
    }
    setSelectedTab(tab);
    applyFilters(searchTerm, timeFilter, tab);
  };

  // Function to apply all filters (search, time, status)
  const applyFilters = (term, time, tab) => {
    let filtered = tickets;

    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        (ticket) =>
          ticket?.name?.toLowerCase().includes(term) ||
          ticket?.description?.toLowerCase().includes(term) ||
          ticket?.problem?.name?.toLowerCase().includes(term)
      );
    }

    // Apply time filter
    if (time) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        if (time === "today") {
          return isToday(ticketDate);
        } else if (time === "this-week") {
          return isThisWeek(ticketDate);
        } else if (time === "this-month") {
          return isThisMonth(ticketDate);
        }
        return true;
      });
    }

    // Apply tab filter (status)
    if (tab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === tab);
    }

    setFilteredTickets(filtered);
  };

  return (
    <Fragment >
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}k
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <Box px={25}>

        <Flex p={25}  my={25} justify={'space-between'} >
            <Heading size={"lg"}>
                Ticket List
            </Heading>

            <Button colorScheme="green" >
                  <a href="newticket">New Ticket</a>
            </Button>
        </Flex>
        <Box borderRadius={15} bg={'white'} p={50}  w={"full"}>
          {/* Search and Filters */}
          <Flex mb={4} alignItems="center">
            <Input
              placeholder="Search for ticket"
              width="300px"
              value={searchTerm}
              onChange={handleSearch} // Handle search input
            />
            <Spacer />
            <Select
              ml={4}
              placeholder="Select Time"
              width="150px"
              onChange={handleTimeFilter}
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </Select>
          </Flex>

          {/* Tabs for Status Filter */}
          <Tabs variant="enclosed-colored" onChange={handleTabChange}>
            <TabList>
              <Tab>All Tickets</Tab>
              <Tab>Opened</Tab>
              <Tab>Reserved</Tab>
              <Tab>Resolved</Tab>
              <Tab>Closed</Tab>
            </TabList>
          </Tabs>

          {/* Ticket Items */}
          <VStack spacing={4} mt={6}>
            {!loading && filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  statusColor={
                    ticket.status === "opened"
                      ? "green"
                      : ticket.status === "reserved"
                      ? "yellow"
                      :ticket.status === "resolved"
                      ? "orange"
                      : "red"
                  }
                  status={ticket.status}
                  ticketNumber={ticket.id}
                  problemName={ticket?.problem?.specification || ticket?.problem?.name}
                  priority={ticket.priority}
                  postedTime={ticket.created_at}
                  name={ticket.creator.name}
                  description={ticket.description}
                  created_by={ticket.created_by}
                  reserved_by={ticket?.support_it?.name}

                />
              ))
            ) : (
              <Text>No tickets found.</Text>
            )}
          </VStack>
        </Box>
      </Box>
    </Fragment>
  );
}
