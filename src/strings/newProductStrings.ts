import type { FormStrings } from "../types/formTypes";
import { API_BASE_URL } from "./env";

export const newProductStrings: FormStrings = {
  title: "Publica tu departamento",
  imageUrl: `${API_BASE_URL}/static/images/wallpapers/newProduct.webp`,
  inputs: [
    {
      label: "Categoría",
      placeholder: "Ej: Teclado",
      type: "select",
      options: ["No", "Si"],
      id: "category",
      validation: "Debe seleccionar una opción",
    },
    {
      label: "Nombre",
      placeholder: "Ej: Teclado Pro BT-250",
      type: "text",
      id: "product_name",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      label: "Marca",
      placeholder: "Ej: Intel",
      type: "text",
      id: "city",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      label: "Modelo",
      placeholder: "Ej: Pro BT-250",
      type: "text",
      id: "model",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      label: "SKU",
      placeholder: "Ej: 90HY425-BT1563",
      type: "text",
      id: "sku",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      label: "Descripción",
      placeholder: "Ej: Teclado mecánico con luces RGB",
      type: "textarea",
      id: "description",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      label: "Precio",
      placeholder: "Ej: $150",
      type: "number",
      min: 1,
      id: "rent_price",
      validation: "Debe ser mayor a $1",
    },
    {
      label: "Suba fotos del Producto",
      uploadButtonLabel: "Subir fotos",
      placeholder: "Arrastra y suelta tus fotos aquí",
      type: "file",
      id: "img_upload",
      validation: "Se requiere al menos un archivo",
    },
  ],
  toastSuccess: {
    severity: "success",
    summary: "Publicación completa",
  },
  toastError: {
    severity: "error",
    summary: "Error al publicar",
  },
  primaryButton: "Publicar",
  secondaryButton: "Cancelar",
};
