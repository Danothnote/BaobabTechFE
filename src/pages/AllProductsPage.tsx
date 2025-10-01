import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useMemo, useState } from "react";
import type {
  GetCategoriesData,
  GetProductData,
  ProductData,
} from "../types/productTypes";
import { allProductsStrings } from "../strings/allProductsStrings";
import { useGetData } from "../hooks/useGetData";
import { useUpdateFavorite } from "../hooks/useUpdateFavorite";
import { mutate } from "swr";
import { API_BASE_URL } from "../strings/env";
import { Slider } from "primereact/slider";
import { PanelMenu } from "primereact/panelmenu";
import { Divider } from "primereact/divider";
import { usePostData } from "../hooks/usePostData";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

export const AllProductsPage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isCategoryFiltered, setIsCategoryFiltered] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<
    [number, number]
  >([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const { data: products, isLoading } = useGetData<GetProductData>("products/");
  const {
    trigger: postProductsByCategory,
    data: postedData,
    isLoading: isPosting,
  } = usePostData<ProductData[]>("products/by_filter/");
  const { data: categories, isLoading: isLoadingCategories } =
    useGetData<GetCategoriesData>("categories/");
  const { data: favorites } = useGetData<{ message: string; data: string[] }>(
    "favorites/"
  );
  const { addFavorite, removeFavorite } =
    useUpdateFavorite("favorites/update/");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    if (!categories?.data) return [];
    return categories.data.map((category) => ({
      label: category.name,
      items: category.subcategories.map((subCategorie) => ({
        label: subCategorie.name,
        command: () => {
          postProductsByCategory({ category: subCategorie.name });
          setIsCategoryFiltered(true);
        },
      })),
    }));
  }, [categories, postProductsByCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [priceRange]);

  useEffect(() => {
    if (products && products.data.length > 0) {
      const highestPrice = Math.max(
        ...products.data.map((product) => product.price)
      );
      const roundedMaxPrice = Math.ceil(highestPrice);
      setMaxPrice(roundedMaxPrice);
      setPriceRange([0, roundedMaxPrice]);
    }
  }, [products]);

  useEffect(() => {
    const sourceProducts = postedData || products?.data || [];
    if (sourceProducts) {
      let _filteredProducts = [...sourceProducts];

      _filteredProducts = _filteredProducts.filter(
        (product) =>
          product.price >= debouncedPriceRange[0] &&
          product.price <= debouncedPriceRange[1]
      );

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
  }, [products, filters, debouncedPriceRange, postedData]);

  const clearCategoryFilter = () => {
    setIsCategoryFiltered(false);
    setFilteredProducts(products?.data || []);
  };

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
      <div className="flex flex-wrap gap-5 justify-content-between align-items-center px-3 my-3">
        <div className="flex gap-3">
          <Button
            icon="pi pi-book"
            className="mr-2 block md:hidden"
            onClick={() => setVisible(true)}
          />
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              className="w-20rem"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={allProductsStrings.searchBar.placeholder}
            />
          </IconField>
          {isCategoryFiltered && (
            <Button
              icon="pi pi-filter-slash"
              onClick={clearCategoryFilter}
              severity="warning"
            >
              <span className="hidden md:inline font-bold ml-2">
                Eliminar Categoría
              </span>
            </Button>
          )}
        </div>
        <div className="w-20rem">
          <div className="text-white mb-2">{`Rango de precios: $${priceRange[0]} - $${priceRange[1]}`}</div>
          <Slider
            value={priceRange}
            onChange={(e) => setPriceRange(e.value as [number, number])}
            range
            min={0}
            max={maxPrice}
          />
        </div>
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
    const isFavorite = favorites!.data.includes(product._id);
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
      <div className="grid grid-nogutter gap-5 mx-4 mb-5 mt-3">
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
        className="border-round-lg cursor-pointer w-25rem product-card"
        key={product._id}
        onClick={() => onRowSelect(product._id)}
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div className="p-4 border-round flex flex-column h-full product-card-content">
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
    <div>
      {renderHeader()}
      <Divider />
      <div className="flex">
        <div className="w-20rem mr-5 ml-3 hidden md:block">
          {isLoadingCategories ? (
            <p>Cargando categorías...</p>
          ) : (
            <div>
              <h2>Categorías</h2>
              <PanelMenu model={menuItems} className="w-full" />
            </div>
          )}
        </div>
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          {isLoadingCategories ? (
            <p>Cargando categorías...</p>
          ) : (
            <div>
              <h2>Categorías</h2>
              <PanelMenu model={menuItems} className="w-full" />
            </div>
          )}
        </Sidebar>
        <div className="flex-1">
          <DataView
            value={filteredProducts}
            listTemplate={listTemplate}
            emptyMessage={allProductsStrings.emptyLabel}
            loading={isLoading || isPosting}
            paginator
            rows={15}
            className="border-round-lg overflow-hidden my-3 products-data-view"
          />
        </div>
      </div>
    </div>
  );
};
