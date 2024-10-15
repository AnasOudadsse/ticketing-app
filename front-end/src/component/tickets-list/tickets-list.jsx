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
}) => {
  const navigate = useNavigate();

  const handleOpenTicket = () => {
    navigate(`/tickets/ticketview/${ticketNumber}`);
  };

  return (
    <Fragment>

      <Box p={5} w={"500px"} shadow="md" borderWidth="1px" rounded="md">
        <HStack>
          <Box bg={statusColor} boxSize={3} borderRadius="full" />
          <Flex gap={20}>
            <Heading size="md">Ticket: #{ticketNumber}</Heading>
            <Badge colorScheme={statusColor}>{status}</Badge>
          </Flex>
          {priority && <Badge colorScheme="red">{priority}</Badge>}
          <Spacer />
          <Text color="gray.500">
            Posted at{" "}
            {new Date(postedTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </HStack>

        <Heading mt={3} size="sm">
          Problem: {problemName}
        </Heading>
        <Text mt={2} noOfLines={2}>
          {description}
        </Text>
        <HStack mt={4}>
          <Avatar name={name} src="https://bit.ly/broken-link" />
          <Text>{name}</Text>
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
      tab = "reserved";
    } else if (index === 2) {
      tab = "resolved";
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
    <Fragment>
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <Box mx="20" w={"1000px"} p={6}>
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
          <Button colorScheme="green" ml={4}>
            <a href="newticket">New Ticket</a>
          </Button>
        </Flex>

        {/* Tabs for Status Filter */}
        <Tabs variant="enclosed-colored" onChange={handleTabChange}>
          <TabList>
            <Tab>All Tickets</Tab>
            <Tab>Reserved</Tab>
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
                problemName={ticket?.problem?.name}
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
      </Box>
    </Fragment>
  );
}
