import { useState, useEffect } from "react";
import axios from "axios";

const useHttp = (url, method = "GET", data = null) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const config = {
  //         method,
  //         url,
  //         data,
  //       };

  //       const res = await axios(config);
  //       setResponse(res.data);
  //       setError(null);
  //     } catch (err) {
  //       setResponse(null);
  //       setError(err.response ? err.response.data : err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [url, method, data]);

  return { response, error, isLoading };
};

export default useHttp;
