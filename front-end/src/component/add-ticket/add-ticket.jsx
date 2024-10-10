import { Box, Button, Text, FormControl, FormLabel, Input, Select, Textarea, Heading, VStack } from "@chakra-ui/react";
import React from "react";

export const NewTicket = () => {

    return(
    <Box p={50}  w={'full'} bg={'#F9F9FB'}>
        <Heading maxW="600px" mx="auto" as='h1' size='xl' mb={4}>
            New Ticket
        </Heading>
        <Box bg={'white'} borderRadius={15} p={50} maxW="600px" mx="auto" mt={10}>
        <Heading as="h2" size="lg" mb={2}>
            Create Quick Ticket
        </Heading>
        <Box mb={4} color="gray.500">
            Write and address new queries and issues
        </Box>
        <VStack spacing={4} align="start">

            <FormControl isRequired>
            <FormLabel>Subject</FormLabel>
            <Input placeholder="Type Subject" />
            </FormControl>

            <FormControl isRequired>
            <FormLabel>Request Ticket Type</FormLabel>
            <Select placeholder="Choose Type">
                <option value="bug">Bug</option>
                <option value="feature">Equipment Problem</option>
                <option value="support">Support</option>
                <option value="support">Platform problem</option>
            </Select>
            </FormControl>

            
            <FormControl isRequired>
            <FormLabel>Priority</FormLabel>
            <Select placeholder="Select Status">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </Select>
            </FormControl>

            
            <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Type ticket issue here..." />
            </FormControl>

            <FormControl>
                <FormLabel>Attachment</FormLabel>
                <Input type="file" />
            </FormControl>

            
            <Button colorScheme="green" width="full">
            Send Ticket
            </Button>
        </VStack>
        </Box>
    </Box>
    )
}