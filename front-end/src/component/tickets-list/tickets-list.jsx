import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
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
    Divider,
    useColorModeValue,
    Select,
    Stack,
    Pagination,
  } from "@chakra-ui/react";
  import { ChevronDownIcon } from "@chakra-ui/icons";
  
  const TicketItem = ({ statusColor, ticketNumber, priority, postedTime, name, description }) => {
    const priorityColor = {
      "High Priority": "red.500",
      "Medium Priority": "orange.400",
      "Low Priority": "green.400",
    };
  
    return (
      <Box p={5} w={'800px'} shadow="md" borderWidth="1px" rounded="md">
        <HStack>
          <Box bg={statusColor} boxSize={3} borderRadius="full" />
          <Heading size="md">Ticket# {ticketNumber}</Heading>
          {priority && <Badge colorScheme="red">{priority}</Badge>}
          <Spacer />
          <Text color="gray.500">Posted at {postedTime}</Text>
        </HStack>
        <Text fontWeight="bold" mt={2}>
          How to deposit money to my portal?
        </Text>
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
    return (
      <Box mx='20' p={6}>
        {/* Search and Filters */}
        <Flex mb={4} alignItems="center">
          <Input placeholder="Search for ticket" width="300px" />
          <Spacer />
          <Menu>
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
                On-Going Tickets
              </MenuItem>
              <MenuItem>
                <Box boxSize={2} bg="green.400" borderRadius="full" mr={2} />
                Resolved Tickets
              </MenuItem>
            </MenuList>
          </Menu>
          <Select ml={4} placeholder="This Week" width="150px">
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
          </Select>
          <Button colorScheme="purple" ml={4}>
            New Ticket
          </Button>
        </Flex>
  
        {/* Tabs */}
        <Tabs variant="enclosed-colored">
          <TabList>
            <Tab>All Tickets</Tab>
            <Tab>New</Tab>
            <Tab>On-Going</Tab>
            <Tab>Resolved</Tab>
          </TabList>
        </Tabs>
  
        {/* Ticket Items */}
        <VStack spacing={4} mt={6}>
          <TicketItem
            statusColor="blue.400"
            ticketNumber="2023-CS123"
            postedTime="12:45 AM"
            name="John Snow"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            status = ''
          />
          <TicketItem
            statusColor="orange.400"
            ticketNumber="2023-CS123"
            priority="High Priority"
            postedTime="12:45 AM"
            name="John Snow"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          />
          <TicketItem
            statusColor="green.400"
            ticketNumber="2023-CS123"
            postedTime="12:45 AM"
            name="John Snow"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          />
        </VStack>
  
        {/* Pagination */}
        <Flex mt={8} justifyContent="center" alignItems="center">
          <Button variant="link">Previous</Button>
          <Button mx={2} colorScheme="purple">
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
  