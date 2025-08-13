import axios from "axios";
import useSWR from "swr";
import { API_BASE_URL } from "../strings/env";
import type { FetchDataGet } from "../types/fetchTypes";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useGetData = <T>(route: string) => {
  const { data, error, isLoading } = useSWR<FetchDataGet<T>>(
    `${API_BASE_URL}/${route}`,
    fetcher
  );

  const dataMessage =  data?.message;
  const dataFetched = data?.data;

  return { data: dataFetched, message: dataMessage, isError: error, isLoading };
};
