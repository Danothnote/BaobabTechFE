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

interface SubCategoriesData {
  _id: string;
  name: string;
  parent_id: string;
}

export interface CategoriesData {
  _id: string;
  name: string;
  subcategories: SubCategoriesData[];
}
