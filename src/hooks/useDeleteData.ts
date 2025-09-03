import axios from "axios";
import useSWRMutation from "swr/mutation";
import { API_BASE_URL } from "../strings/env";
import type { FetchDataGet } from "../types/fetchTypes";

const deleter = async (url: string, { arg }: { arg: string }) => {
  return axios.delete(`${url}${arg}`).then((res) => res.data);
};

export const useDeleteData = <T>(route: string) => {
  const { trigger, data, error, isMutating } = useSWRMutation<
    FetchDataGet<T>,
    Error,
    string,
    string
  >(`${API_BASE_URL}/${route}`, deleter);

  const dataMessage = data?.message;
  const dataDeleted = data?.data;

  return {
    trigger,
    data: dataDeleted,
    message: dataMessage,
    isError: error,
    isLoading: isMutating,
  };
};
