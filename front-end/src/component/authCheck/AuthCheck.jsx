import { useEffect } from "react";
import useHttp from "../customHook/useHttp";
import { useNavigate } from "react-router-dom";

const AuthCheck = () => {
  const { sendRequest, loading } = useHttp();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) navigate("login");

    const request = {
      url: "http://127.0.0.1:8000/api/authCheck",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, getData);
  }, []);

  const getData = (dataRec) => {
    console.log(dataRec);
    if (!dataRec.ok) navigate("login");
    else navigate("tickets");
  };

  if (loading) {
    return <div></div>;
  }
};

export default AuthCheck;