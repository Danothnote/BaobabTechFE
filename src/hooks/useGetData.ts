import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_BASE_URL } from "../strings/env";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useGetData = <T>(route: string | null) => {
  const swrKey = route ? `${API_BASE_URL}/${route}` : null;

  const { data, error, isLoading, mutate } = useSWR<T | null>(swrKey, fetcher, {
    shouldRetryOnError: (error: AxiosError) => {
      if (
        error.response?.status === 400 ||
        error.response?.status === 401 ||
        error.response?.status === 404
      ) {
        return false;
      }
      return true;
    },
  });

  return { data, error, isLoading, mutate };
};
