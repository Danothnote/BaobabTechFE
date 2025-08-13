import axios from "axios";
import { API_BASE_URL } from "../strings/env";
import useSWRMutation from "swr/mutation";
import type { FetchDataMessage, UpdateFavoriteData } from "../types/fetchTypes";

const fetcher = (url: string, { arg }: { arg: UpdateFavoriteData }) => {
  return axios
    .put(url, {
      product_id: arg.product_id,
      action: arg.action,
    })
    .then((res) => res.data);
};

export const useUpdateFavorite = (route: string) => {
  const { data, error, isMutating, trigger } = useSWRMutation<
    FetchDataMessage,
    Error,
    string,
    UpdateFavoriteData
  >(`${API_BASE_URL}/${route}`, fetcher);

  const dataMessage = data?.message;

  return {
    message: dataMessage,
    isError: error,
    isMutating,
    addFavorite: (product_id: string, action: "add" | "remove") =>
      trigger({ product_id, action: action }),
    removeFavorite: (product_id: string, action: "add" | "remove") =>
      trigger({ product_id, action: action }),
  };
};
