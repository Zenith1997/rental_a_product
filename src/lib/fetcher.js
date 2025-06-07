import { useCallback } from "react";
import useAxiosAuth from "/src/lib/auth.js";

const useFetcher = () => {
  const axiosAuth = useAxiosAuth();

  const fetcher = useCallback(async (url) => {
    const res = await axiosAuth.get(url);
    return res.data;
  }, [axiosAuth]);

  return fetcher;
};

export default useFetcher;
