import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { usePostData } from "../hooks/usePostData";
import { showToast } from "../helpers/showToast";
import { Dropdown } from "primereact/dropdown";
import { useGetData } from "../hooks/useGetData";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";
import { categoryCreationStrings } from "../strings/categoryCreationStrings";

interface Category {
  _id: string;
  name: string;
  parent_id: string | null;
}
interface CategoriesResponse {
  data: Category[];
}

export const CategoryCreationPage = () => {
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isSubcategory, setIsSubcategory] = useState<boolean>(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    mutate: refreshCategories,
  } = useGetData<CategoriesResponse>("categories");

  const mainCategories = categoriesData?.data.filter(
    (cat) => !cat.parent_id
  ) || [];

  const { trigger: createCategoryTrigger, isLoading: isCreating } =
    usePostData("categories/add");

  const resetForm = () => {
    setNewCategoryName("");
    setIsSubcategory(false);
    setSelectedParentId(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast(toast, "error", "Error", "El nombre de la categoría es obligatorio.");
      return;
    }

    if (isSubcategory && !selectedParentId) {
      showToast(
        toast,
        "error",
        "Error",
        "Debe seleccionar una categoría padre para una subcategoría."
      );
      return;
    }

    const categoryData: { name: string; parent_id?: string | null } = {
      name: newCategoryName.trim(),
    };

    if (isSubcategory && selectedParentId) {
      categoryData.parent_id = selectedParentId;
    }

    try {
      await createCategoryTrigger(categoryData);
      
      showToast(
        toast,
        "success",
        "Éxito",
        `${isSubcategory ? 'Subcategoría' : 'Categoría'} creada exitosamente.`
      );
      
      resetForm();
      await refreshCategories();
      
    } catch (error) {
      showToast(
        toast,
        "error",
        "Error",
        "No se pudo crear la categoría. Intente de nuevo."
      );
      console.error("Error al crear la categoría:", error);
    }
  };

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${categoryCreationStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title="Creación de Categorías"
        className="max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96, minWidth: '400px' }}
      >
        {isCreating || isLoadingCategories ? (
          <ProgressSpinner />
        ) : (
          <div className="flex flex-column justify-content-center gap-5 p-4">
            
            <div className="flex flex-column gap-3">
              <span className="p-float-label">
                <InputText
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full"
                />
                <label htmlFor="category-name">Nueva Categoría</label>
              </span>
            </div>

            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="isSubcategory"
                checked={isSubcategory}
                onChange={(e: CheckboxChangeEvent) => {
                  setIsSubcategory(e.checked || false);
                  if (!e.checked) {
                    setSelectedParentId(null);
                  }
                }}
              />
              <label htmlFor="isSubcategory" className="ml-2">
                Es Subcategoría
              </label>
            </div>

            {isSubcategory && (
              <div className="flex flex-column gap-3">
                <span className="p-float-label">
                  <Dropdown
                    id="parent-category"
                    value={selectedParentId}
                    options={mainCategories}
                    onChange={(e) => setSelectedParentId(e.value)}
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="Seleccione Categoría Padre"
                    className="w-full"
                    emptyMessage="No hay categorías principales disponibles"
                  />
                  <label htmlFor="parent-category">Categoría Padre</label>
                </span>
                {isLoadingCategories && <small className="p-error">Cargando categorías...</small>}
              </div>
            )}

            <Button
              label={isSubcategory ? "Crear Subcategoría" : "Crear Categoría"}
              icon="pi pi-plus"
              onClick={handleCreateCategory}
              loading={isCreating}
              className="w-full mt-4"
            />
          </div>
        )}
      </Card>
    </div>
  );
};