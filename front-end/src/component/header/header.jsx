import { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const Header = ({ greeting }) => {
  const [user, setUser] = useState(null); 

  console.log(user);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage

        if (!token) {
          console.error("No token found, please login.");
          return;
        }

        // Fetch the authenticated user's information
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the request header
          },
        });

        setUser(response.data); // Store user data in state
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!user) {
    return <p>Loading user info...</p>; 
  }

  return (
    <div className="flex justify-between rounded-xl items-start w-full h-fit p-5 my-15 bg-white">
      <div className="flex flex-col gap-1">
        <h3>Hello {user.name}</h3> 
        <p className="text-sm text-gray-500">{greeting}</p>
      </div>
      <div className="flex items-center gap-16">
        <span className="flex gap-3">
          <Avatar
            size="md"
            name={user.name} 
            bg="teal.500"
          />
          <div>
            <p>{user.name}</p> 
            <p className="text-sm text-gray-400">{user.function}</p> 
          </div>
        </span>
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
};

export default Header;
