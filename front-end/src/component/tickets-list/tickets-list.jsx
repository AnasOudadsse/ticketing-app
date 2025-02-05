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
import { formatDistanceToNow } from "date-fns";

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
  reserved_by,
}) => {
  const navigate = useNavigate();

  const handleOpenTicket = () => {
    navigate(`/tickets/ticketview/${ticketNumber}`);
  };

  return (
    <Fragment>
      <Box
        p={5}
        my={2}
        w="full"
        shadow="md"
        borderWidth="1px"
        rounded="md"
        bg="white"
      >
        <HStack
          spacing={4}
          flexDirection={{ base: "column", md: "row" }}
          alignItems="flex-start"
        >
          <Box bg={statusColor} boxSize={3} borderRadius="full" />
          <Flex
            flex="1"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Heading size="md" isTruncated>
              Ticket: #{ticketNumber}
            </Heading>
            <Badge
              alignSelf={{ base: "flex-start", md: "center" }}
              colorScheme={statusColor}
            >
              {status} {status === "reserved" && <span>by {reserved_by}</span>}
            </Badge>
          </Flex>
           <Spacer />
          <Text
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            textAlign="right"
          >
            Posted {formatDistanceToNow(new Date(postedTime), { addSuffix: true })}
          </Text>
        </HStack>

        <Heading my={5} size="sm" isTruncated>
          Problem: {problemName}
        </Heading>
        <Text mb={4} mt={2} noOfLines={2}>
          {description}
        </Text>
        <hr />
        <HStack
          mt={4}
          spacing={4}
          flexDirection={{ base: "column", sm: "row" }}
          alignItems="flex-start"
        >
          <HStack spacing={4} flex="1">
            <Avatar size="sm" mr={2} name={name} />
            <Text color="#7B7B7B" fontSize={{ base: "sm", md: "md" }}>
              {name}
            </Text>
          </HStack>
          <Spacer />
          <Button
            variant="link"
            color={"#008000"}
            onClick={handleOpenTicket}
            size={{ base: "sm", md: "md" }}
            mt={{ base: 2, sm: 0 }}
          >
            Open Ticket
          </Button>
        </HStack>
      </Box>
    </Fragment>
  );
};

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const toast = useToast();

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, timeFilter, selectedTab);
  };

  const handleTimeFilter = (e) => {
    const filter = e.target.value;
    setTimeFilter(filter);
    applyFilters(searchTerm, filter, selectedTab);
  };

  const handleTabChange = (index) => {
    const tabs = ["all", "opened", "reserved", "resolved", "closed"];
    setSelectedTab(tabs[index]);
    applyFilters(searchTerm, timeFilter, tabs[index]);
  };

  const applyFilters = (term, time, tab) => {
    let filtered = tickets;

    if (term) {
      filtered = filtered.filter(
        (ticket) =>
          ticket?.name?.toLowerCase().includes(term) ||
          ticket?.description?.toLowerCase().includes(term) ||
          ticket?.problem?.name?.toLowerCase().includes(term)
      );
    }

    if (time) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return (
          (time === "today" && isToday(ticketDate)) ||
          (time === "this-week" && isThisWeek(ticketDate)) ||
          (time === "this-month" && isThisMonth(ticketDate))
        );
      });
    }

    if (tab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === tab);
    }

    setFilteredTickets(filtered);
  };

  return (
    <Fragment>
      <Header
        name="Mezrioui Hakim"
        greeting="Have a nice day"
        role="super-admin"
        profile="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
      />
      <Box px={{ base: 4, md: 8 }} py={4}>
        <Flex
          justify="space-between"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Heading size="lg" mb={{ base: 4, md: 0 }}>
            Ticket List
          </Heading>
          <Button colorScheme="green" size={{ base: "sm", md: "md" }}>
            <a href="newticket">New Ticket</a>
          </Button>
        </Flex>
        <Box
          borderRadius={15}
          bg="white"
          p={{ base: 4, md: 8 }}
          w="full"
          mt={6}
        >
          <Flex
            mb={4}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
          >
            <Input
              placeholder="Search for ticket"
              width={{ base: "full", md: "300px" }}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Spacer />
            <Select
              placeholder="Select Time"
              width={{ base: "full", md: "150px" }}
              onChange={handleTimeFilter}
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </Select>
          </Flex>

          <Tabs variant="enclosed-colored" onChange={handleTabChange}>
            <TabList flexWrap="wrap">
              <Tab>All Tickets</Tab>
              <Tab>Opened</Tab>
              <Tab>Reserved</Tab>
              <Tab>Resolved</Tab>
              <Tab>Closed</Tab>
            </TabList>
          </Tabs>

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
