import type { CategoriesData } from "./fetchTypes";

export interface ProductData {
  _id: string;
  product_name: string;
  description: string;
  brand: string;
  model: string;
  category: string;
  image_url: string[];
  price: number;
  quantity: number;
  sku?: string;
  owner?: string;
  cpu?: string;
  gpu?: string;
  ram?: number;
  storage_type?: string;
  storage?: number;
  battery?: number;
  display_size?: number;
  display_resolution?: string;
  panel_type?: string;
}

interface SearchBar {
  placeholder: string;
  icon: string;
  type: string;
}

interface FavoriteButton {
  favoriteIcon: string;
  favoriteTooltip: string;
}

interface ProductHeader {
  field: string;
  header: string;
}

interface ProductFilters {
  label: string;
  type: "select" | "slider";
  id: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
}

interface SidebarFilter {
  icon: string;
  label: string;
  filters: ProductFilters[];
}

export interface AllProductsStrings {
  paginatorRows: number;
  emptyLabel: string;
  searchBar: SearchBar;
  favoriteButton: FavoriteButton;
  filter: SidebarFilter;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface CartListItem {
  quantity: number;
  product: ProductData;
}

export interface GetProductData {
  message: string;
  data: ProductData[];
}

export interface GetCategoriesData {
  message: string;
  data: CategoriesData[];
}
