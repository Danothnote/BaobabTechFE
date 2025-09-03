import { useNavigate, useParams } from "react-router";
import { useGetData } from "../hooks/useGetData";
import type { ProductData } from "../types/productTypes";
import { productViewStrings } from "../strings/productViewStrings";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Galleria } from "primereact/galleria";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";
import { useGoBack } from "../hooks/useGoBack";
import { mutate } from "swr";
import { API_BASE_URL } from "../strings/env";
import { useUpdateFavorite } from "../hooks/useUpdateFavorite";
import { usePostData } from "../hooks/usePostData";
import { DialogComponent } from "../components/DialogComponent";
import { InputNumber } from "primereact/inputnumber";
import { useUpdateData } from "../hooks/useUpdateData";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import type { CategoriesData, FetchDataGet } from "../types/fetchTypes";
import { useDeleteData } from "../hooks/useDeleteData";

export const ProductViewPage = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const goBack = useGoBack();
  const { user } = useAuth();
  const { data: product, isLoading } = useGetData<{
    message: string;
    data: ProductData;
  }>(`products/by_id/${product_id}`);
  const { data: favorites } = useGetData<{ message: string; data: string[] }>(
    "favorites/"
  );
  const { addFavorite, removeFavorite } =
    useUpdateFavorite("favorites/update/");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { trigger, isLoading: isAddingToCart } = usePostData("cart/add");
  const { data: categoriesData } =
    useGetData<FetchDataGet<CategoriesData[]>>("categories/");
  const subcategories =
    categoriesData?.data?.flatMap((category) =>
      category.subcategories.map((subcat) => subcat.name)
    ) || [];
  const { trigger: updateProductDataTrigger, isLoading: isUpdatingData } =
    useUpdateData("products/data/");
  const { trigger: updateProductFilesTrigger, isLoading: isUpdatingFiles } =
    useUpdateData("products/files/");
  const { trigger: deleteProductTrigger } = useDeleteData("products/delete/");
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);
  const [editingImages, setEditingImages] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct(product.data);
      setCurrentImages(product.data.image_url || []);
    }
  }, [product]);

  const handleEditClick = (dataKey: keyof ProductData) => {
    setEditMode({ ...editMode, [dataKey]: true });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dataKey: keyof ProductData
  ) => {
    setEditedProduct((prev) => {
      if (!prev) return null;
      return { ...prev, [dataKey]: e.target.value };
    });
  };

  const handleDropdownChange = (e: any, dataKey: keyof ProductData) => {
    setEditedProduct((prev) => {
      if (!prev) return null;
      return { ...prev, [dataKey]: e.value };
    });
  };

  const handleConfirmClick = async (dataKey: keyof ProductData) => {
    if (!editedProduct || !user) return;
    try {
      const dataToPatch = { [dataKey]: editedProduct[dataKey] };
      await updateProductDataTrigger({
        data_id: product_id,
        dataToPatch,
      });
      mutate(`${API_BASE_URL}/products/by_id/${product_id}`);
      setEditMode({ ...editMode, [dataKey]: false });
      toast.current?.show({
        severity: "success",
        summary: "¡Actualizado!",
        detail: "El producto se ha actualizado exitosamente.",
      });
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar el producto.",
      });
    }
  };

  const handleCancelClick = (dataKey: keyof ProductData) => {
    if (product) {
      setEditedProduct(product.data);
    }
    setEditMode({ ...editMode, [dataKey]: false });
  };

  const handleImageFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setNewImageFiles((prev) => [...prev, ...Array.from(event.target.files!)]);
      event.target.value = "";
    }
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    setCurrentImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleDeleteNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmImageEdit = async () => {
    if (!product_id || !user) return;

    const formData = new FormData();
    formData.append(
      "images_to_delete",
      JSON.stringify(
        product!.data.image_url.filter((url) => !currentImages.includes(url))
      )
    );
    newImageFiles.forEach((file) => {
      formData.append("new_img_upload", file);
    });

    try {
      await updateProductFilesTrigger({
        data_id: product_id,
        dataToPatch: formData,
      });
      mutate(`${API_BASE_URL}/products/by_id/${product_id}`);
      setEditingImages(false);
      setNewImageFiles([]);
      toast.current?.show({
        severity: "success",
        summary: "¡Imágenes Actualizadas!",
        detail: "Las imágenes del producto se han actualizado exitosamente.",
      });
    } catch (error) {
      console.error("Error al actualizar imágenes:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron actualizar las imágenes del producto.",
      });
    }
  };

  const handleCancelImageEdit = () => {
    if (product) {
      setCurrentImages(product.data.image_url || []);
    }
    setNewImageFiles([]);
    setEditingImages(false);
  };

  const handleAddToCart = async () => {
    if (!user || !product) return;
    try {
      const dataToSend = {
        product_id: product.data._id,
        quantity,
      };
      await trigger(dataToSend);

      mutate(`${API_BASE_URL}/cart/`);

      toast.current?.show({
        severity: "success",
        summary: "¡Producto Añadido!",
        detail: `Se agregaron ${quantity} unidades de ${product.data.product_name} al carrito`,
        life: 3000,
      });
      setDialogVisible(false);
      setQuantity(1);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error al añadir el producto",
        detail: "No se pudo agregar al carrito",
      });
    }
  };

  const itemTemplate = (item: any) => {
    return (
      <Image
        src={item}
        alt={item}
        imageClassName="w-full"
        imageStyle={{ objectFit: "cover" }}
        preview
      />
    );
  };

  const thumbnailTemplate = (item: any) => {
    return <Image src={item} alt={item} imageClassName="w-11" />;
  };

  const toggleFavorite = async (product_id: string) => {
    const isFavorite = favorites!.data.includes(product_id);
    if (isFavorite) {
      await removeFavorite(product_id, "remove");
    } else {
      await addFavorite(product_id, "add");
    }
    mutate(`${API_BASE_URL}/favorites/`);
  };

  const isOwner = user && product?.data.owner === user._id;

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
        {isLoading || !editedProduct ? (
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
              {isOwner && (
                <Button
                  className="w-max h-max"
                  icon="pi pi-trash"
                  iconPos="right"
                  severity="danger"
                  onClick={() => {
                    deleteProductTrigger(product.data._id);
                    navigate("/allProducts");
                  }}
                >
                  <span className="hidden md:inline font-bold ml-2">
                    Eliminar
                  </span>
                </Button>
              )}
            </div>
            <h1 className="text-center">{editedProduct.product_name}</h1>
            <div>
              <div className="flex flex-column md:flex-row gap-5">
                <div className="w-12 md:w-5 relative">
                  {isOwner && (
                    <Button
                      icon="pi pi-images"
                      className="absolute top-0 right-0 z-2"
                      rounded
                      onClick={() => setEditingImages(true)}
                    />
                  )}
                  <Galleria
                    value={currentImages}
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

                        if (editedProduct[dataKey] !== undefined) {
                          const isEditing = editMode[dataKey];
                          const isEditableField = [
                            "title",
                            "product_name",
                            "description",
                            "brand",
                            "model",
                            "price",
                            "quantity",
                            "category",
                            "cpu",
                            "gpu",
                            "ram",
                            "storage_type",
                            "storage",
                            "battery",
                            "display_size",
                            "display_resolution",
                            "panel_type",
                            "quantity",
                            "price",
                          ].includes(dataKey);

                          return (
                            <div
                              key={dataKey}
                              className={`flex gap-2 py-1 align-items-center ${
                                dataKey === "price"
                                  ? "text-3xl font-bold my-5"
                                  : "text-xl my-2"
                              }`}
                            >
                              <span className="font-bold">
                                {productViewStrings.productLabels[dataKey]}
                              </span>
                              {isEditing && isEditableField ? (
                                <div className="flex gap-2 align-items-center">
                                  {dataKey === "category" ? (
                                    <Dropdown
                                      value={editedProduct.category}
                                      options={subcategories}
                                      onChange={(e) =>
                                        handleDropdownChange(e, dataKey)
                                      }
                                      placeholder="Selecciona una subcategoría"
                                      className="w-full"
                                    />
                                  ) : (
                                    <InputText
                                      value={editedProduct[dataKey] as string}
                                      onChange={(e) => handleChange(e, dataKey)}
                                    />
                                  )}
                                  <div className="flex gap-3">
                                    <Button
                                      icon="pi pi-check"
                                      rounded
                                      severity="success"
                                      onClick={() =>
                                        handleConfirmClick(dataKey)
                                      }
                                      loading={isUpdatingData}
                                    />
                                    <Button
                                      icon="pi pi-times"
                                      rounded
                                      severity="danger"
                                      onClick={() => handleCancelClick(dataKey)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2 align-items-center">
                                  <span
                                    style={{
                                      color: `${
                                        dataKey === "price"
                                          ? "greenyellow"
                                          : dataKey === "quantity"
                                          ? editedProduct.quantity > 0
                                            ? "greenyellow"
                                            : "orangered"
                                          : ""
                                      }`,
                                    }}
                                  >
                                    {dataKey !== "quantity"
                                      ? editedProduct[dataKey]
                                      : editedProduct.quantity > 0
                                      ? "Disponible"
                                      : "Sin Stock"}
                                  </span>
                                  {isOwner && isEditableField && (
                                    <Button
                                      icon="pi pi-pencil"
                                      rounded
                                      text
                                      onClick={() => handleEditClick(dataKey)}
                                    />
                                  )}
                                </div>
                              )}
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
                        favorites?.data.includes(product.data._id)
                          ? "Quitar de"
                          : "Añadir a"
                      } favoritos`}
                      icon="pi pi-star"
                      severity="warning"
                      onClick={() => toggleFavorite(product.data._id)}
                    />
                    <Button
                      className="w-max"
                      label="Agregar al carrito"
                      icon="pi pi-shopping-cart"
                      loading={isAddingToCart}
                      onClick={() => setDialogVisible(true)}
                      disabled={product.data.quantity > 0 ? false : true}
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

      <DialogComponent
        title="Editar Imágenes del Producto"
        visible={editingImages}
        onHide={handleCancelImageEdit}
        confirmButtonLabel="Guardar Cambios"
        confirmButtonAction={handleConfirmImageEdit}
        confirmButtonLoading={isUpdatingFiles}
        cancelButtonLabel="Cancelar"
        cancelButtonAction={handleCancelImageEdit}
        bodyComponent={
          <div className="flex flex-column p-4 gap-3">
            <h3>Imágenes Actuales</h3>
            <div className="flex flex-wrap gap-3">
              {currentImages.map((imageUrl, index) => (
                <div key={imageUrl} className="relative w-8rem h-8rem">
                  <Image
                    src={imageUrl}
                    alt={`Imagen ${index}`}
                    imageClassName="w-full h-full"
                    imageStyle={{ objectFit: "cover" }}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-rounded p-button-sm absolute top-0 right-0"
                    onClick={() => handleDeleteExistingImage(imageUrl)}
                  />
                </div>
              ))}
            </div>

            <h3>Nuevas Imágenes a Añadir</h3>
            <div className="flex flex-wrap flex-column gap-2">
              <div className="flex flex-wrap gap-3">
                {newImageFiles.map((file, index) => (
                  <div key={index} className="relative w-8rem h-8rem">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Nueva Imagen ${index}`}
                      imageStyle={{ objectFit: "cover" }}
                      imageClassName="w-full h-full"
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-rounded p-button-sm absolute top-0 right-0"
                      onClick={() => handleDeleteNewImage(index)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Button
                  icon="pi pi-plus"
                  label="Añadir Imagen"
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageFileSelect}
              />
            </div>
          </div>
        }
      />

      <DialogComponent
        title="Añadir al Carrito"
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        bodyComponent={
          !user ? (
            <p className="text-xl px-5">
              Para agregar artículos primero debe iniciar sesión
            </p>
          ) : (
            <div className="px-5">
              <div className="flex align-items-center gap-3">
                <img
                  src={product?.data.image_url[0]}
                  alt={product?.data.product_name}
                  className="w-6rem"
                />
                <div>
                  <h3 className="m-0 text-2xl">{product?.data.product_name}</h3>
                  <p className="text-xl">{product?.data.description}</p>
                </div>
              </div>
              <div className="flex justify-content-end align-items-center mt-7 mb-3">
                <label htmlFor="quantity" className="font-bold text-xl mr-4">
                  Cantidad:
                </label>
                <InputNumber
                  id="quantity"
                  inputClassName="w-5rem"
                  value={quantity}
                  onValueChange={(e) => setQuantity(e.value ?? 1)}
                  min={1}
                  showButtons
                  decrementButtonIcon="pi pi-minus"
                  incrementButtonIcon="pi pi-plus"
                />
              </div>
            </div>
          )
        }
        confirmButtonLabel={!user ? "Ir al inicio de sesión" : "Confirmar"}
        confirmButtonAction={!user ? () => navigate("/login") : handleAddToCart}
        confirmButtonLoading={isAddingToCart}
        cancelButtonLabel="Cancelar"
        cancelButtonAction={() => setDialogVisible(false)}
      />
    </div>
  );
};
