import { useEffect, useState } from "react";
import type { ProductData } from "../types/productTypes";
import axios from "axios";

export const useAllProducts = () => {
  const [allProducts, setAllProducts] = useState<ProductData[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const allProductsFetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products/`);
        if (response.status === 200 && response.data.data) {
          setAllProducts(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error obtener datos:",
            error.response?.data || error.message
          );
          throw new Error(
            error.response?.data?.detail || "Error obtener datos"
          );
        } else {
          console.error("Error inesperado:", error);
          throw new Error("Ha ocurrido un error inesperado");
        }
      } finally {
        setLoading(false);
      }
    };

    allProductsFetch();
  }, []);

  return { allProducts, loading };
};
