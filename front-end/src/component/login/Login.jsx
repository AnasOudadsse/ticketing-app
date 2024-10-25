import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation after login
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for button
  const [error, setError] = useState(""); // To handle and display login errors
  const navigate = useNavigate(); // Navigation hook for redirecting after login
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before making the request
    setLoading(true); // Start loading

    try {
      // Send login request using axios
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token, token_type, role } = response.data;
      console.log("Access Token:", access_token);

      // Store token, token type, and role in localStorage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("role", role);

      // Fetch the user's profile and store user ID in localStorage
      const profileResponse = await axios.get(
        "http://127.0.0.1:8000/api/user",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const { id } = profileResponse.data;
      localStorage.setItem("id", id); // Store user ID

      toast({
        title: "Login successful",
        description: "You are now logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/tickets/ticketlist"); // Redirect to tickets

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );

      toast({
        title: "Error during login",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="grid grid-cols-2 w-full">
      <div className="bg-gradient-to-r from-green-600 to-green-700 w-full h-screen gap-10 flex justify-start flex-col items-center rounded-br-full">
        <h1 className="mt-10 text-white font-bold text-3xl">New Here?</h1>
        <p className="w-1/2 text-center text-white text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elitLorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <img
          className="w-72 h-72"
          src="/assets/images/login.png"
          alt="Login Visual"
        />
      </div>
      <div className="w-full flex flex-col gap-36 items-center justify-start">
        <div className="text-center mt-9">
          <img
            src="https://um6ss.ma/wp-content/uploads/2024/02/UM6SS.png"
            className="w-full h-36"
            alt="UM6SS"
          />
        </div>
        <form className="p-4 scale-150" onSubmit={handleSubmit}>
          <div className="px-2 text-center mb-3 font-bold text-white text-3xl">
            <h3 className="text-black">Login</h3>
          </div>
          <div className="mb-3 relative">
            <FontAwesomeIcon
              className="absolute left-3 top-3 text-gray-500"
              icon={faEnvelope}
            />
            <input
              onChange={handleChange}
              className="py-3 px-2 pl-10 w-96 rounded-md outline-none bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 focus:bg-gray-300"
              placeholder="Enter your Email"
              name="email"
              type="email"
            />
          </div>
          <div className="mb-3 relative">
            <FontAwesomeIcon
              className="absolute left-3 top-3 text-gray-500"
              icon={faKey}
            />
            <input
              onChange={handleChange}
              className="py-3 px-2 pl-10 w-96 rounded-md outline-none bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 focus:bg-gray-300"
              placeholder="Enter your Password"
              name="password"
              type="password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-5 text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 px-10 py-1 pb-2 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
