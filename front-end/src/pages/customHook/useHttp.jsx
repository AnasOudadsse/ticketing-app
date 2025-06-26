import { useCallback } from "react";
import { useState } from "react";

const useHttp = () => {
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(async (request, applayData = () => {}) => {
    setLoading(true);
    try {
      const response = await fetch(request.url, {
        method: request.method ? request.method : "GET",
        body: request.body,
        headers: request.headers ? request.headers : {},
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { ok: false, message: "Invalid response format" };
      }

      data.ok = response.ok;
      await applayData(data);
    } catch (error) {
      await applayData({ ok: false, message: error.message });
    }
    setLoading(false);
  }, []);
  return {
    loading,
    sendRequest,
  };  
};

export default useHttp;
