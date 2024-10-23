import { useCallback } from "react";
import { useState } from "react";

const useHttp = () => {
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(async (request, applayData = () => {}) => {
    setLoading(true);
    console.log(request);
    const response = await fetch(request.url, {
      method: request.method ? request.method : "GET",
      body: request.body,
        headers: request.headers ? request.headers : null,
      // headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    await applayData(data);
    setLoading(false);
  }, []);
  return {
    loading,
    sendRequest,
  };
};

export default useHttp;
