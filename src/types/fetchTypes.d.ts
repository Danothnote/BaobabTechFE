export interface FetchDataGet<T> {
  message: string;
  data: T | undefined | null;
}

export interface FetchDataMessage {
  message: string;
}

export interface UpdateFavoriteData {
  product_id: string;
  action: "add" | "remove";
}