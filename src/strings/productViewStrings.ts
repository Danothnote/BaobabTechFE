import { API_BASE_URL, background, WALLPAPER } from "./env";

export const productViewStrings = {
  imageUrl: `${API_BASE_URL}${WALLPAPER}${background.productView}`,
  notFound: "No se encontraron datos",
  errorSummary: "Hubo un problema",
  productLabels: {
    description: "Descripción:",
    brand: "Marca:",
    model: "Modelo:",
    category: "Categoría:",
    cpu: "Procesador:",
    gpu: "Tarjeta de Vídeo:",
    ram: "Memoria RAM:",
    storage_type: "Tipo de Almacenamiento:",
    storage: "Cantidad de Almacenamiento:",
    battery: "Batería:",
    display_size: "Tamaño de Pantalla:",
    display_resolution: "Resolución de Pantalla:",
    panel_type: "Tipo de pantalla:",
    sku: "SKU:",
    quantity: "En Stock:",
    price: "Precio:",
  },
};
