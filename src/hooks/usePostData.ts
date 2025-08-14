import axios from "axios";
import useSWRMutation from "swr/mutation";
import { API_BASE_URL } from "../strings/env";
import type { FetchDataGet } from "../types/fetchTypes";

const poster = async (url: string, { arg }: { arg: object }) => {
  return axios.post(url, arg).then((res) => res.data);
};

export const usePostData = <T>(route: string) => {
  const { trigger, data, error, isMutating } = useSWRMutation<
    FetchDataGet<T>,
    Error,
    string,
    object
  >(`${API_BASE_URL}/${route}`, poster);

  const dataMessage = data?.message;
  const dataPosted = data?.data;

  return {
    trigger,
    data: dataPosted,
    message: dataMessage,
    isError: error,
    isLoading: isMutating,
  };
};
