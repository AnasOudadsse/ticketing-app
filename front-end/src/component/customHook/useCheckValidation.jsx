import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

const useCheckValidation = () => {
  const [response, setResponse] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (response === null || response.length === 0) return;
    toast({
      title: "Warning",
      description: response,
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
  }, [toast, response]);

  const checkName = (value) => {
    setResponse("");
    if (value.length === 0) {
      setResponse("The name field is required");
    } else if (value.length < 6) {
      setResponse("the length should greater than 6 caracter");
    }
  };

  const checkEmail = (value) => {
    setResponse("");
    if (value.length === 0) {
      setResponse("The email field is required");
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        setResponse("Please enter a valid email address");
      } else {
        setResponse(null);
      }
    }
  };

  const checkPassword = (value) => {
    setResponse("");

    if (value.length === 0) {
      setResponse("The password field is required");
    } else if (value.length < 8) {
      console.log(value);
      setResponse("Password should be at least 8 characters long");
    } else {
      const uppercasePattern = /[A-Z]/;
      const lowercasePattern = /[a-z]/;
      const numberPattern = /[0-9]/;
      const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

      if (!uppercasePattern.test(value)) {
        setResponse("Password should contain at least one uppercase letter");
      } else if (!lowercasePattern.test(value)) {
        setResponse("Password should contain at least one lowercase letter");
      } else if (!numberPattern.test(value)) {
        setResponse("Password should contain at least one number");
      } else if (!specialCharPattern.test(value)) {
        setResponse("Password should contain at least one special character");
      } else {
        setResponse(null); // Clear the error if valid
      }
    }
  };

  const checkRole = (value) => {
    setResponse("");
    if (value === null || value === "Select a role") {
      setResponse("Please select a role");
    } else {
      setResponse(null); // Clear the error if valid
    }
  };

  const checkSpecialisation = (role, selectedValues) => {
    if (role === "supportIt" && selectedValues.length === 0) {
      setResponse("Please select at least one specialization");
    } else {
      setResponse(null); // Clear error if at least one checkbox is selected or role is different
    }
  };

  const checkFonction = (value) => {
    console.log("fonction");
    setResponse("");
    if (!value || value === null || value === "Select a Fonction") {
      setResponse("Please select a function");
    } else {
      setResponse(null); // Clear the error if valid
    }
  };

  const checkDepartement = (value) => {
    setResponse("");
    if (!value || value === null || value === "Select a Departement") {
      setResponse("Please select a departement");
    } else {
      setResponse(null); // Clear the error if valid
    }
  };

  const checkLocalisation = (value) => {
    setResponse("");
    if (!value === null || value === "Select a Localisation") {
      setResponse("Please select a localisation");
    } else {
      setResponse(null); // Clear the error if valid
    }
  };

  return {
    response,
    checkName,
    checkEmail,
    checkPassword,
    checkRole,
    checkSpecialisation,
    checkFonction,
    checkDepartement,
    checkLocalisation,
  };
};

export default useCheckValidation;
