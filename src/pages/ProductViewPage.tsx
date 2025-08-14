import { useParams } from "react-router";
import { useGetData } from "../hooks/useGetData";
import type { ProductData } from "../types/productTypes";
import { productViewStrings } from "../strings/productViewStrings";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";
import { useGoBack } from "../hooks/useGoBack";
import { mutate } from "swr";
import { API_BASE_URL } from "../strings/env";
import { useUpdateFavorite } from "../hooks/useUpdateFavorite";

export const ProductViewPage = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const goBack = useGoBack();
  const { user } = useAuth();
  const { data: product, isLoading } = useGetData<ProductData>(
    `products/by_id/${product_id}`
  );
  const { data: favorites } = useGetData<string[]>("favorites/");
  const { addFavorite, removeFavorite } =
    useUpdateFavorite("favorites/update/");

  const toast = useRef<Toast>(null);

  const itemTemplate = (item: any) => {
    return <Image src={item} alt={item} imageClassName="w-12" preview />;
  };

  const thumbnailTemplate = (item: any) => {
    return <Image src={item} alt={item} imageClassName="w-11" />;
  };

  const toggleFavorite = async (product_id: string) => {
    const isFavorite = favorites!.includes(product_id);
    if (isFavorite) {
      await removeFavorite(product_id, "remove");
    } else {
      await addFavorite(product_id, "add");
    }
    mutate(`${API_BASE_URL}/favorites/`);
  };

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${productViewStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        className="w-12 px-3 flex justify-content-center align-items-center"
        style={{ opacity: 0.96 }}
      >
        {isLoading ? (
          <p>Cargando...</p>
        ) : product ? (
          <>
            <div className="flex align-items-center justify-content-between">
              <Button
                className="w-max h-max"
                icon="pi pi-arrow-left"
                onClick={goBack}
              >
                <span className="hidden md:inline font-bold ml-2">
                  Regresar
                </span>
              </Button>
              {user && user._id == product.owner && (
                <Button
                  className="w-max h-max"
                  icon="pi pi-pencil"
                  iconPos="right"
                  severity="warning"
                >
                  <span className="hidden md:inline font-bold ml-2">
                    Editar
                  </span>
                </Button>
              )}
            </div>
            <h1 className="text-center">{product.product_name}</h1>
            <div>
              <div className="flex flex-column md:flex-row gap-5">
                <div className="w-12 md:w-5">
                  <Galleria
                    value={product.image_url}
                    numVisible={5}
                    className="w-12"
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                  />
                </div>
                <div className="w-12 md:w-9 flex flex-column justify-content-between">
                  <div>
                    {Object.keys(productViewStrings.productLabels).map(
                      (key) => {
                        const dataKey =
                          key as keyof typeof productViewStrings.productLabels &
                            keyof ProductData;

                        if (product[dataKey] !== undefined) {
                          return (
                            <div
                              key={dataKey}
                              className={`flex gap-2 ${
                                dataKey === "price"
                                  ? "text-3xl font-bold my-5"
                                  : "text-xl my-2"
                              }`}
                              style={{
                                color: `${
                                  dataKey === "price" && "greenyellow"
                                }`,
                              }}
                            >
                              <span className="font-bold">
                                {productViewStrings.productLabels[dataKey]}
                              </span>
                              <span
                                style={{
                                  color: `${
                                    dataKey !== "quantity"
                                      ? ""
                                      : product.quantity > 0
                                      ? "greenyellow"
                                      : "orangered"
                                  }`,
                                }}
                              >
                                {dataKey !== "quantity"
                                  ? product[dataKey]
                                  : product.quantity > 0
                                  ? "Disponible"
                                  : "Sin Stock"}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>
                  <div className="flex flex-column md:flex-row align-items-center md:justify-content-evenly gap-3 mt-5">
                    <Button
                      className="w-max"
                      label={`${
                        favorites?.includes(product._id)
                          ? "Quitar de"
                          : "Añadir a"
                      } favoritos`}
                      icon="pi pi-star"
                      severity="warning"
                      onClick={() => toggleFavorite(product._id)}
                    />
                    <Button
                      className="w-max"
                      label="Agregar al carrito"
                      icon="pi pi-shopping-cart"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h1>No se encontraron datos</h1>
        )}
      </Card>
    </div>
  );
};
