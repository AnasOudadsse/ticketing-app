import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export  const NewTicket = () => {
  const [formData, setFormData] = useState({
    problem_id: "",
    description: "",
    status: "",
    attachement: "",
    clientID: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/tickets", formData);
      toast({
        title: "Ticket Created",
        description: "Your ticket has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the form after submission
      setFormData({
        problem_id: "",
        description: "",
        status: "",
        attachement: "",
        clientID: "",
      });
    } catch (error) {
      console.error("There was an error creating the ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w={'700px'} mx="auto" mt={10}>
      <VStack spacing={4} as="form" onSubmit={handleSubmit} align="start">
        {/* Problem ID */}
        <FormControl isRequired>
          <FormLabel>Problem ID</FormLabel>
          <Input
            name="problem_id"
            placeholder="Enter Problem ID"
            value={formData.problem_id}
            onChange={handleChange}
          />
        </FormControl>

        {/* Description */}
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            placeholder="Describe the issue"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        {/* Status */}
        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            placeholder="Select Status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </Select>
        </FormControl>

        {/* Attachment */}
        <FormControl>
          <FormLabel>Attachment</FormLabel>
          <Input
            name="attachement"
            placeholder="Attachment (URL)"
            value={formData.attachement}
            onChange={handleChange}
          />
        </FormControl>

        {/* Client ID */}
        <FormControl isRequired>
          <FormLabel>Client ID</FormLabel>
          <Input
            name="clientID"
            placeholder="Enter Client ID"
            value={formData.clientID}
            onChange={handleChange}
          />
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" colorScheme="purple" width="full">
          Create Ticket
        </Button>
      </VStack>
    </Box>
  );
}
