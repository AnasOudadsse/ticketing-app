import { useState, useEffect, Fragment } from "react";
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
import Header from "../header/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";

export const NewTicket = () => {
  const [formData, setFormData] = useState({
    title: "",
    problem_id: "",
    description: "",
    status: "published",
    attachement: "",
    clientID: "",
  });

  console.log(formData);
  
  useEffect(() => {
    const storedClientID = localStorage.getItem("id"); // Get clientID from localStorage
    if (storedClientID) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        clientID: storedClientID, // Update clientID from localStorage
      }));
    }
  }, []);

  const [problems, setProblems] = useState({}); // Store grouped problems from API
  const [loading, setLoading] = useState(true); // For loading state

  const toast = useToast();

  // Fetch problems from API when component mounts
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/problems/getProblems"
        );
        setProblems(response.data); // Directly set the grouped problems
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast({
          title: "Error",
          description: "Failed to fetch problems from the server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false); // Stop loading even on error
      }
    };

    fetchProblems();
  }, [toast]);

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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tickets",
        formData
      );
      toast({
        title: "Ticket Created",
        description: "Your ticket has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the form after submission
      setFormData({
        title: "",
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
    <Fragment>
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />

      <Box w={"700px"} mx="auto" mt={10}>
        <VStack spacing={4} as="form" className="rounded-md p-5 shadow" onSubmit={handleSubmit} align="start">
          {/* Problem ID */}
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title" 
              placeholder="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Problem</FormLabel>
            <Select
              name="problem_id"
              placeholder={loading ? "Loading problems..." : "Select Problem"}
              value={formData.problem_id}
              onChange={handleChange}
              isDisabled={loading} // Disable select when loading
            >
              {/* Render optgroups based on problem type */}
              {Object.keys(problems).map((type) => (
                <optgroup key={type} label={type}>
                  {problems[type].map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.name}{" "}
                      {problem.specification
                        ? `- ${problem.specification}`
                        : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
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

          {/* Attachment */}
          <FormControl>
            <FormLabel htmlFor="file" className="bg-blue-500 hover:bg-blue-600 w-fit text-white px-5 py-2 rounded">
              <FontAwesomeIcon icon={faFileImport} className="mr-3" />
              Importer un fichier! </FormLabel>
            <Input id="file" className="hidden" type="file" name="attachement" onChange={handleChange} />
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="green" width="full">
            Create Ticket
          </Button>
        </VStack>
      </Box>
    </Fragment>
  );
};
