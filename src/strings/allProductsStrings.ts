import type { AllProductsStrings } from "../types/productTypes";

export const allProductsStrings: AllProductsStrings = {
  paginatorRows: 10,
  emptyLabel: "No se ha agregado ningún elemento",
  searchBar: {
    placeholder: "Buscar",
    icon: "pi pi-search",
    type: "searchBar",
  },
  favoriteButton: {
    favoriteIcon: "src/assets/star.webp",
    favoriteTooltip: "Mostrar favoritos",
  },
  filter: {
    icon: "src/assets/filter.webp",
    label: "Filtros",
    filters: [
      {
        label: "Ciudad",
        type: "select",
        id: "cityFilter",
      },
      {
        label: "Rango de precio",
        type: "slider",
        id: "priceFilter",
        min: 0,
        max: 500,
        step: 10,
        defaultValue: [0, 500],
      },
      {
        label: "Rango de tamaño del área",
        type: "slider",
        id: "areaFilter",
        min: 0,
        max: 500,
        step: 10,
        defaultValue: [0, 500],
      },
    ],
  },
};
