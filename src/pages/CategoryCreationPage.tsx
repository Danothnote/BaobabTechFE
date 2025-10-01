import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef, useState, useMemo } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { usePostData } from "../hooks/usePostData";
import { showToast } from "../helpers/showToast";
import { Dropdown } from "primereact/dropdown";
import { useGetData } from "../hooks/useGetData";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";
import { TabView, TabPanel } from "primereact/tabview";
import { categoryCreationStrings } from "../strings/categoryCreationStrings";
import { useUpdateData } from "../hooks/useUpdateData";
import { useDeleteData } from "../hooks/useDeleteData";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FloatLabel } from "primereact/floatlabel";

interface Category {
  _id: string;
  name: string;
  parent_id: string | null;
}

interface APIBaseCategory {
  _id: string;
  name: string;
  subcategories: Category[];
}

interface CategoriesResponse {
  data: APIBaseCategory[];
}

export const CategoryCreationPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const toast = useRef<Toast>(null);

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isSubcategory, setIsSubcategory] = useState<boolean>(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modifiedCategoryName, setModifiedCategoryName] = useState<string>("");
  const [modifiedParentId, setModifiedParentId] = useState<string | null>(null);

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    mutate: refreshCategories,
  } = useGetData<CategoriesResponse>("categories/");

  const apiCategories = categoriesResponse?.data || [];

  const allFlatCategories = useMemo(() => {
    const flatList: Category[] = [];

    apiCategories.forEach((mainCat) => {
      flatList.push({
        _id: mainCat._id,
        name: mainCat.name,
        parent_id: null,
      });

      mainCat.subcategories.forEach((subCat) => {
        flatList.push(subCat);
      });
    });

    return flatList;
  }, [apiCategories]);

  const mainCategories = useMemo(
    () => allFlatCategories.filter((cat) => !cat.parent_id) || [],
    [allFlatCategories]
  );

  const { trigger: createCategoryTrigger, isLoading: isCreating } =
    usePostData("categories/add");
  const { trigger: updateCategoryTrigger, isLoading: isUpdating } =
    useUpdateData("categories/update/");
  const { trigger: deleteCategoryTrigger, isLoading: isDeleting } =
    useDeleteData("categories/delete/");

  const resetCreationForm = () => {
    setNewCategoryName("");
    setIsSubcategory(false);
    setSelectedParentId(null);
  };

  const resetModificationForm = () => {
    setSelectedCategory(null);
    setModifiedCategoryName("");
    setModifiedParentId(null);
  };

  const handleCategorySelection = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      setModifiedCategoryName(category.name);
      setModifiedParentId(category.parent_id || null);
    } else {
      resetModificationForm();
    }
  };

  const categoryOptionTemplate = (option: Category) => {
    const isSub = !!option.parent_id;
    const indentationClass = isSub ? "pl-4" : "";

    return (
      <div className={`flex align-items-center ${indentationClass}`}>
        <span className="text-sm">
          {isSub ? "— " : ""}
          {option.name}
          {isSub ? " (Subcategoría)" : " (Principal)"}
        </span>
      </div>
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast(
        toast,
        "error",
        "Error",
        "El nombre de la categoría es obligatorio."
      );
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
        `${isSubcategory ? "Subcategoría" : "Categoría"} creada exitosamente.`
      );

      resetCreationForm();
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

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    const newName = modifiedCategoryName.trim();
    if (!newName) {
      showToast(
        toast,
        "error",
        "Error",
        "El nombre de la categoría es obligatorio."
      );
      return;
    }

    const currentParentId = selectedCategory.parent_id;

    const dataToPatch: { name: string; parent_id?: string | null } = {
      name: newName,
    };

    if (currentParentId !== modifiedParentId) {
      dataToPatch.parent_id = modifiedParentId;
    }

    if (
      newName === selectedCategory.name &&
      currentParentId === modifiedParentId
    ) {
      showToast(toast, "info", "Información", "No hay cambios para guardar.");
      return;
    }

    try {
      await updateCategoryTrigger({
        data_id: selectedCategory._id,
        dataToPatch,
      });

      showToast(
        toast,
        "success",
        "Éxito",
        `Categoría "${newName}" modificada exitosamente.`
      );

      resetModificationForm();
      await refreshCategories();
    } catch (error) {
      showToast(
        toast,
        "error",
        "Error",
        "No se pudo modificar la categoría. Intente de nuevo."
      );
      console.error("Error al modificar la categoría:", error);
    }
  };

  const confirmDelete = () => {
    if (!selectedCategory) return;

    const hasChildren = allFlatCategories.some(
      (cat) => cat.parent_id === selectedCategory._id
    );
    if (hasChildren) {
      showToast(
        toast,
        "error",
        "Error",
        "No se puede eliminar una categoría que tiene subcategorías asociadas."
      );
      return;
    }

    confirmDialog({
      message: `¿Está seguro de que desea eliminar la categoría "${selectedCategory.name}"? Esta acción es irreversible.`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: handleDeletion,
      reject: () =>
        showToast(toast, "info", "Cancelado", "Eliminación cancelada."),
    });
  };

  const handleDeletion = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryTrigger(selectedCategory._id);

      showToast(
        toast,
        "success",
        "Éxito",
        `Categoría "${selectedCategory.name}" eliminada exitosamente.`
      );

      resetModificationForm();
      await refreshCategories();
    } catch (error) {
      showToast(
        toast,
        "error",
        "Error",
        "No se pudo eliminar la categoría. Intente de nuevo."
      );
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const createCategoryContent = (
    <div className="flex flex-column justify-content-center gap-5 p-4">
      <div className="flex flex-column gap-3">
        <span className="p-float-label">
          <InputText
            id="category-name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full"
            disabled={isCreating}
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
          disabled={isCreating}
        />
        <label htmlFor="isSubcategory" className="ml-2">
          Es Subcategoría
        </label>
      </div>

      {isSubcategory && (
        <div className="flex flex-column gap-3 text-left">
          <span className="p-float-label">
            <Dropdown
              id="parent-category-create"
              value={selectedParentId}
              options={mainCategories}
              onChange={(e) => setSelectedParentId(e.value)}
              optionLabel="name"
              optionValue="_id"
              placeholder="Seleccione Categoría Padre"
              className="w-full"
              emptyMessage="No hay categorías principales disponibles"
              disabled={isCreating}
            />
            <label htmlFor="parent-category-create">Categoría Padre</label>
          </span>
          {isLoadingCategories && (
            <small className="p-error">Cargando categorías...</small>
          )}
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
  );

  const modifyCategoryContent = (
    <div className="flex flex-column justify-content-center gap-5 p-4">
      <div className="flex flex-column gap-3 text-left">
        <div className="w-full">
          <FloatLabel className={"block m-auto w-12"}>
            <Dropdown
              className="w-12"
              id="category-select"
              value={selectedCategory}
              options={allFlatCategories}
              onChange={(e) => handleCategorySelection(e.value)}
              optionLabel="name"
              itemTemplate={categoryOptionTemplate}
              placeholder="Seleccione Categoría a Modificar"
              disabled={isUpdating || isDeleting}
              emptyMessage="No hay categorías disponibles"
            />
            <label htmlFor="category-select">Categoría a Modificar</label>
          </FloatLabel>
        </div>

        {isLoadingCategories && (
          <small className="p-error">Cargando categorías...</small>
        )}
      </div>

      {selectedCategory && (
        <>
          <div className="w-full">
            <FloatLabel className={"block m-auto w-12"}>
              <InputText
                className="w-12"
                id="modified-category-name"
                value={modifiedCategoryName}
                onChange={(e) => setModifiedCategoryName(e.target.value)}
                disabled={isUpdating || isDeleting}
              />
              <label htmlFor="modified-category-name">Nuevo Nombre</label>
            </FloatLabel>
          </div>

          <div className="flex flex-column gap-3 text-left">
            <div className="w-full">
              <FloatLabel className={"block m-auto w-12"}>
                <Dropdown
                  className="w-12"
                  id="parent-category-modify"
                  value={modifiedParentId}
                  options={mainCategories}
                  showClear={true}
                  onChange={(e) => setModifiedParentId(e.value)}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Cambiar Categoría Padre"
                  emptyMessage="No hay categorías principales disponibles"
                  disabled={isUpdating || isDeleting}
                />
                <label htmlFor="parent-category-modify">
                  Nueva Categoría Padre
                </label>
              </FloatLabel>
            </div>

            <small className="text-left text-500">
              Seleccione "Sin Categoría Padre" para convertirla en categoría
              principal.
            </small>
          </div>

          <div className="flex justify-content-between gap-3 mt-4">
            <Button
              label="Guardar Cambios"
              icon="pi pi-save"
              onClick={handleUpdateCategory}
              loading={isUpdating}
              className="p-button-success flex-grow-1"
            />
            <Button
              label="Eliminar Categoría"
              icon="pi pi-trash"
              onClick={confirmDelete}
              loading={isDeleting}
              className="p-button-danger flex-grow-1"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${categoryCreationStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <ConfirmDialog />

      <Card
        title="Gestión de Categorías"
        className="max-h-max text-center px-2 pt-4 pb-4"
        style={{ opacity: 0.96, minWidth: "450px" }}
      >
        {isCreating || isLoadingCategories || isUpdating || isDeleting ? (
          <ProgressSpinner />
        ) : (
          <TabView
            className="flex flex-column justify-content-center align-items-center"
            activeIndex={activeIndex}
            onTabChange={(e) => {
              setActiveIndex(e.index);
              if (e.index === 0) resetModificationForm();
              if (e.index === 1) resetCreationForm();
            }}
          >
            <TabPanel header="Crear Nueva Categoría">
              {createCategoryContent}
            </TabPanel>
            <TabPanel header="Modificar Categoría">
              {modifyCategoryContent}
            </TabPanel>
          </TabView>
        )}
      </Card>
    </div>
  );
};
