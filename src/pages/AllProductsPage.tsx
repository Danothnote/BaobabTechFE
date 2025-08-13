import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import type { ProductData } from "../types/productTypes";
import { allProductsStrings } from "../strings/allProductsStrings";
import { useGetData } from "../hooks/useGetData";
import { useUpdateFavorite } from "../hooks/useUpdateFavorite";
import { mutate } from "swr";
import { API_BASE_URL } from "../strings/env";

export const AllProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  // const { data: products, isLoading: isLoadingProducts } =
  //   useGetData<ProductData[]>("products/");
  const { data: products, isLoading } = useGetData<
    ProductData[]
  >(
    selectedCategory
      ? `products/by_filter/?category=${selectedCategory}`
      : "products/"
  );
  const { data: favorites } = useGetData<string[]>("favorites/");
  const { addFavorite, removeFavorite } =
    useUpdateFavorite("favorites/update/");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (products) {
      let _filteredProducts = [...products];

      const globalFilterValue = (
        filters.global as { value: string | null; matchMode: FilterMatchMode }
      ).value;
      if (globalFilterValue) {
        _filteredProducts = _filteredProducts.filter((product) =>
          Object.keys(product).some((key) => {
            const value = (product as any)[key];
            return String(value)
              .toLowerCase()
              .includes(globalFilterValue.toLowerCase());
          })
        );
      }

      setFilteredProducts(_filteredProducts);
    }
  }, [products, filters]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex gap-5 justify-content-between align-items-center px-3">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            className="w-20rem"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder={allProductsStrings.searchBar.placeholder}
          />
        </IconField>
      </div>
    );
  };

  const onRowSelect = (product_id: string) => {
    navigate(`/products/${product_id}`);
  };

  const toggleFavorite = async (product_id: string, isFavorite: boolean) => {
    if (isFavorite) {
      await removeFavorite(product_id, "remove");
    } else {
      await addFavorite(product_id, "add");
    }
    mutate(`${API_BASE_URL}/favorites/`);
  };

  const favoriteTemplate = (product: ProductData) => {
    const isFavorite = favorites!.includes(product._id);
    return (
      <div
        className="h-auto flex justify-content-center align-items-center absolute top-0 right-0 m-3 z-1"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product._id, isFavorite);
        }}
      >
        <i
          className={`${
            isFavorite ? "pi pi-star-fill" : "pi pi-star"
          } text-2xl p-2 border-circle cursor-pointer`}
          style={{
            color: "yellow",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      </div>
    );
  };

  const listTemplate = (items: ProductData[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="grid grid-nogutter gap-5 mx-4 my-5">
        {items.map((product) => {
          return itemDataTemplate(product);
        })}
      </div>
    );
  };

  const itemDataTemplate = (product: ProductData) => {
    if (!product) {
      return;
    }

    return (
      <div
        className="border-round-lg p-2 cursor-pointer w-25rem"
        key={product._id}
        onClick={() => onRowSelect(product._id)}
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div className="p-4 border-round flex flex-column h-full">
          <div className="flex flex-column gap-3 py-2">
            <div className="flex justify-content-center align-items-center pb-5">
              <div className="w-min flex gap-5 relative">
                {isAuthenticated && favoriteTemplate(product)}
                <Image
                  className="shadow-2 border-round-lg overflow-hidden z-0"
                  imageClassName="h-15rem w-20rem"
                  imageStyle={{ objectFit: "cover" }}
                  src={product.image_url[0]}
                  alt="image"
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-center">
              {product.product_name}
            </div>
            <div className="flex flex-column gap-2">
              <div>
                <span className="font-bold">Descripción: </span>
                <span>{product.description}</span>
              </div>
              <div>
                <span className="font-bold">Marca: </span>
                <span>{product.brand}</span>
              </div>
              <div>
                <span className="font-bold">Modelo: </span>
                <span>{product.model}</span>
              </div>
              <div>
                <span className="font-bold">En stock: </span>
                <span
                  style={{
                    color: `${
                      product.quantity > 0 ? "greenyellow" : "orangered"
                    }`,
                  }}
                >
                  {product.quantity > 0 ? "Disponible" : "Sin Stock"}
                </span>
              </div>
            </div>
          </div>
          <div
            className="pt-3 text-center align-content-end h-full"
            style={{ color: "greenyellow" }}
          >
            <span className="text-2xl font-semibold">${product.price}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataView
      value={filteredProducts}
      listTemplate={listTemplate}
      header={renderHeader()}
      emptyMessage={allProductsStrings.emptyLabel}
      loading={isLoading}
      className="border-round-lg overflow-hidden my-5"
    />
  );
};
