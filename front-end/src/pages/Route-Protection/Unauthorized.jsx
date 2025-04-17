import { Button, Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/tickets/ticketlist"); // Redirect to dashboard or tickets list
  };

  return (
    <Box
    w={'full'}
      textAlign="center"
      py={10}
      px={6}
      h="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <Heading as="h1" size="2xl" mb={6} color="green">
          403
        </Heading>
        <Text fontSize="xl" mb={4}>
          Unauthorized Access
        </Text>
        <Text color="gray.600" mb={6}>
          You don't have permission to view this page.
        </Text>
        <Button colorScheme="green" onClick={handleBackToHome}>
          Go Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default Unauthorized;
