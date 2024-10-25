import { useEffect, useState } from "react";
import { Avatar, Box, Button } from "@chakra-ui/react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useHttp from "../customHook/useHttp";
import axios from "axios";

const Header = ({ greeting }) => {
  const [user, setUser] = useState({});
  const { loading, sendRequest } = useHttp();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request = {
      url: "http://127.0.0.1:8000/api/user",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    
    sendRequest(request, getData);
  }, []);
  
  const handleLogout = async () => {
    try{
      const response = await axios.post("http://127.0.0.1:8000/api/logout")
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id");
        window.location.reload();

    }catch(err){
      console.log(err)
    }
  }
  const getData = (data) => {
    setUser(data);
  };

  if (loading) {
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
          <Avatar size="md" name={user.name} bg="teal.500" />
          <div>
            <p>{user.name}</p>
            <p className="text-sm text-gray-400">{user.function}</p>
          </div>
        </span>
        <FontAwesomeIcon icon={faAngleUp} />
        {/* logout */}
        <Box>
          <Button colorScheme="teal" variant="solid" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Header;
