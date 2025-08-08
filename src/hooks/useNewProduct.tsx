import type { NavigateFunction } from "react-router";
import type { ClientFormData } from "../types/formTypes";
import { useState } from "react";
import axios from "axios";
import type { AuthResponse } from "../types/authTypes";

export const useNewProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = "http://localhost:8000";
  axios.defaults.withCredentials = true;

  const newProduct = async (
    formData: ClientFormData,
    navigate: NavigateFunction
  ) => {
    setLoading(true);

    try {
      const payload = new FormData();

      for (const key in formData) {
        const value = formData[key];

        if (key === "img_upload" && Array.isArray(value)) {
          for (const file of value) {
            payload.append(key, file);
          }
        } else if (value !== null && value !== undefined) {
          if (
            typeof value === "object" &&
            value.hasOwnProperty("_isAMomentObject")
          ) {
            payload.append(key, (value as Date).toISOString());
          } else {
            payload.append(key, String(value));
          }
        }
      }

      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/all_products/new_product`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        navigate("/myProducts");
        return response.data.message;
      }

      setLoading(false);
      return response.data.message;
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        console.error(
          "Error al publicar:",
          error.response?.data || error.message
        );
        throw new Error(error.response?.data?.detail || "Error al publicar");
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Ha ocurrido un error inesperado");
      }
    }
  };

  return { newProduct, loading };
};
