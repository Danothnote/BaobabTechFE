import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { cartStrings } from "../strings/cartStrings";
import { useGetData } from "../hooks/useGetData";
import { usePostData } from "../hooks/usePostData";
import { useDeleteData } from "../hooks/useDeleteData";
import { mutate } from "swr";
import { API_BASE_URL } from "../strings/env";
import type { CartItem, CartListItem } from "../types/productTypes";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { useUpdateData } from "../hooks/useUpdateData";
import { ProgressSpinner } from "primereact/progressspinner";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const CartPage = () => {
  const { data: cartData } = useGetData<{ message: string; data: CartItem[] }>(
    "cart/"
  );
  const [products, setProducts] = useState<CartListItem[]>([]);
  const { trigger: updateTrigger } = usePostData("cart/add/");
  const { trigger: deleteTrigger } = useDeleteData("cart/remove/");
  const { trigger: updateProductTrigger, isLoading: isProductUpdating } =
    useUpdateData("products/data/");
  const { trigger: clearCartTrigger, isLoading: isClearingCart } =
    useDeleteData("cart/clear");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [productsAreLoading, setProductsAreLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (cartData) {
      setProductsAreLoading(true);
      const productPromises = cartData.data.map((item) => {
        return fetcher(
          `${API_BASE_URL}/products/by_id/${item.product_id}`
        ).then((result) => {
          if (result && result.data) {
            const productData = result.data;
            let quantityInCart = item.quantity;

            if (productData.quantity === 0) {
              quantityInCart = 0;
              toast.current!.show({
                severity: "error",
                summary: "Error de Stock",
                detail: `En su carrito hay un producto fuera de stock.`,
              });
            } else if (quantityInCart > productData.quantity) {
              quantityInCart = productData.quantity;
              toast.current!.show({
                severity: "error",
                summary: "Error de Stock",
                detail: `No hay suficientes artículos en stock.`,
              });
            }

            return {
              quantity: item.quantity,
              product: result.data,
            };
          }
          throw new Error("Producto no encontrado.");
        });
      });

      Promise.all(productPromises)
        .then((results) => {
          setProducts(results);
          setProductsAreLoading(false);

          const initialQuantities: { [key: string]: number } = {};
          let shouldDisableCheckout = false;

          results.forEach((item) => {
            initialQuantities[item.product._id] = item.quantity;
            if (item.product.quantity === 0) {
              shouldDisableCheckout = true;
            }
          });

          setQuantities(initialQuantities);
          setIsCheckoutDisabled(shouldDisableCheckout);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setProductsAreLoading(false);
        });
    }
  }, [cartData]);

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
    productStock: number
  ) => {
    if (newQuantity > productStock) {
      toast.current!.show({
        severity: "error",
        summary: "Error de Stock",
        detail: `No hay suficientes artículos en stock. Stock disponible: ${productStock}`,
      });
      return;
    }

    try {
      await updateTrigger({ product_id: productId, quantity: newQuantity });
    } catch (error) {
      toast.current!.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la cantidad.",
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await deleteTrigger(productId);
      mutate(`${API_BASE_URL}/cart/`);
      toast.current!.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto eliminado del carrito.",
      });
    } catch (error) {
      toast.current!.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el producto.",
      });
    }
  };

  const handleBuy = async () => {
    try {
      if (products.length === 0) {
        toast.current!.show({
          severity: "warn",
          summary: "Carrito Vacío",
          detail: "Carrito vaciado correctamente.",
        });
        return;
      }

      const updatePromises = products.map((item) => {
        const currentQuantity = quantities[item.product._id] ?? item.quantity;
        const newStock = item.product.quantity - currentQuantity;

        return updateProductTrigger({
          data_id: item.product._id,
          dataToPatch: { quantity: newStock },
        });
      });

      await Promise.all(updatePromises);

      await clearCartTrigger("");
      mutate(`${API_BASE_URL}/cart/`);

      toast.current!.show({
        severity: "success",
        summary: "¡Compra Realizada!",
        detail: "Tu compra ha sido procesada con éxito.",
      });

      navigate("/allProducts");
    } catch (error) {
      toast.current!.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un problema al procesar la compra.",
      });
    }
  };

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${cartStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        className="w-12 px-3 flex justify-content-center align-items-center"
        style={{ opacity: 0.96 }}
      >
        <h1 className="text-center">{cartStrings.title}</h1>
        {products && products.length > 0 && <h2>{cartStrings.subtitle}</h2>}
        <div className="flex flex-column px-5 gap-2">
          {products && products.length > 0 ? (
            products.map((item) => {
              const currentQuantity =
                quantities[item.product._id] ?? item.quantity;
              const isOverStock = currentQuantity === item.product.quantity;
              const isOutOfStock = item.product.quantity === 0;

              return productsAreLoading ? (
                <ProgressSpinner key={item.product._id} />
              ) : (
                <div key={item.product._id}>
                  <div className="flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="flex align-items-center gap-3">
                      <img
                        src={item.product.image_url[0]}
                        alt={item.product.product_name}
                        className="w-6rem cursor-pointer"
                        onClick={() =>
                          navigate(`/products/${item.product._id}`)
                        }
                      />
                      <div className="flex flex-wrap flex-column">
                        <h3 className="m-0">{item.product.product_name}</h3>
                        <p>{item.product.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <InputNumber
                        value={currentQuantity}
                        inputClassName="w-4rem text-right"
                        min={isOutOfStock ? 0 : 1}
                        max={item.product.quantity}
                        disabled={isOutOfStock}
                        onValueChange={(e) => {
                          e.stopPropagation();
                          if (e.value !== null && e.value !== undefined) {
                            setQuantities({
                              ...quantities,
                              [item.product._id]: e.value,
                            });
                            handleUpdateQuantity(
                              item.product._id,
                              e.value,
                              item.product.quantity
                            );
                          }
                        }}
                        showButtons
                      />
                      <Button
                        icon={"pi pi-trash"}
                        severity="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.product._id);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <small
                      className={"font-bold text-sm"}
                      style={{
                        color: `${
                          isOverStock
                            ? "orangered"
                            : item.product.quantity === 0
                            ? "orangered"
                            : item.product.quantity > 10
                            ? "greenyellow"
                            : "orange"
                        }`,
                      }}
                    >
                      {isOutOfStock
                        ? "Fuera de stock. Por favor, elimina este producto."
                        : isOverStock
                        ? `Máximo de artículos alcanzado. Disponibles: ${item.product.quantity}`
                        : item.product.quantity === 0
                        ? "Fuera de Stock"
                        : item.product.quantity > 10
                        ? "Stock: más de 10"
                        : "Stock: menos de 10"}
                    </small>
                  </div>
                  <Divider />
                </div>
              );
            })
          ) : (
            <h1>No hay elementos en el carrito</h1>
          )}
        </div>
        <div
          className={`flex ${
            products.length > 0
              ? "justify-content-end"
              : "justify-content-center"
          } gap-5 p-5`}
        >
          {products && products.length > 0 && (
            <Button
              label={cartStrings.primaryButton}
              onClick={handleBuy}
              loading={isProductUpdating || isClearingCart}
              disabled={isCheckoutDisabled}
            />
          )}
          <Button
            label={cartStrings.secondaryButton}
            severity="warning"
            onClick={() => navigate(-1)}
          />
        </div>
      </Card>
    </div>
  );
};
