import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useHttp from "../customHook/useHttp";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation after login
import axios from "axios";

const Login = () => {
  const { loading, sendRequest } = useHttp();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(""); // To handle and display login errors
  const navigate = useNavigate(); // Navigation hook for redirecting after login

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error before making the request
  
    const request = {
      url: "http://127.0.0.1:8000/api/login",
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    sendRequest(request, async  (response) => {
      console.log("Response received:", response); // Log the full response
  
      if (response && response.access_token) {
        console.log("Access Token:", response.access_token);
  
        // Store token and token type in localStorage
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("tokenType", response.token_type);


          // After login, fetch the user's profile (this includes the clientID)
        const profileResponse = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        const { id } = profileResponse.data; // Assume profileResponse.data contains the user's info including the clientID

        // Store clientID in localStorage
        localStorage.setItem('id', id);
  
        
        navigate("/dashboard"); 
      } else {
        setError("Login failed. Please check your credentials.");
      }
    });
  };

  return (
    <div className="grid grid-cols-2 w-full">
      <div className="bg-gradient-to-r from-green-600 to-green-700 w-full h-screen gap-10 flex justify-start flex-col items-center rounded-br-full">
        <h1 className="mt-10 text-white font-bold text-3xl">New Here?</h1>
        <p className="w-1/2 text-center text-white text-sm ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis
          quasi nesciunt maiores! Nam, id consectetur! Hic esse, rem quidem
        </p>
        <img className="w-72 h-72 " src="/assets/images/login.png" alt="Login Visual" />
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
              onBlur={handleBlur}
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
              onBlur={handleBlur}
              className="py-3 px-2 pl-10 w-96 rounded-md outline-none bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 focus:bg-gray-300"
              placeholder="Enter your Password"
              name="password"
              type="password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error if login fails */}
          <div className="mt-5 text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 px-10 py-1 pb-2 text-white rounded-lg"
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
