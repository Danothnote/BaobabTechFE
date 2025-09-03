import axios from "axios";
import useSWRMutation from "swr/mutation";
import type { FetchDataGet } from "../types/fetchTypes";
import { API_BASE_URL } from "../strings/env";

const updater = async (
  url: string,
  {
    arg,
  }: {
    arg: { data_id?: string; dataToPatch: any };
  }
) => {
  const { data_id, dataToPatch } = arg;
  const finalUrl = data_id ? `${url}${data_id}` : url;

  return axios.patch(finalUrl, dataToPatch).then((res) => res.data);
};

export const useUpdateData = <T>(route: string) => {
  const { trigger, data, error, isMutating } = useSWRMutation<
    FetchDataGet<T>,
    Error,
    string,
    { data_id?: string; dataToPatch: any }
  >(`${API_BASE_URL}/${route}`, updater);

  const dataMessage = data?.message;
  const dataUpdated = data?.data;
  const isError = error;
  const isLoading = isMutating;

  return {
    trigger,
    data: dataUpdated,
    message: dataMessage,
    isError,
    isLoading,
  };
};
