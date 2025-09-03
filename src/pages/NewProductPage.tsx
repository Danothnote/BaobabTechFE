import React, { useEffect, useRef, useState } from "react";
import { showToast } from "../helpers/showToast";
import type { ClientFormData, FormInput } from "../types/formTypes";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";
import { validateFormData } from "../helpers/validateFormData";
import { createInitialFormState } from "../helpers/createInitialFormState";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useFormLayout } from "../hooks/useFormLayout";
import type { FileUpload } from "primereact/fileupload";
import { newProductStrings } from "../strings/newProductStrings";
import { useNewProduct } from "../hooks/useNewProduct";
import { useGetData } from "../hooks/useGetData";
import type { CategoriesData, FetchDataGet } from "../types/fetchTypes";

export const NewProductPage = () => {
  const { data: categoriesData } =
    useGetData<FetchDataGet<CategoriesData[]>>("categories/");

  const [inputs, setInputs] = useState<FormInput[]>(newProductStrings.inputs);
  const [formData, setFormData] = useState<ClientFormData>(
    createInitialFormState(inputs)
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { newProduct, loading } = useNewProduct();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const [optionalFieldsEnabled, setOptionalFieldsEnabled] = useState<
    Record<string, boolean>
  >(
    newProductStrings.inputs
      .filter((input) => input.optional)
      .reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
  );

  useEffect(() => {
    if (categoriesData?.data) {
      const subcategories = categoriesData.data.flatMap((category) =>
        category.subcategories.map((subcat) => subcat.name)
      );

      const updatedInputs = newProductStrings.inputs.map((input) => {
        if (input.id === "category") {
          return { ...input, options: subcategories };
        }
        return input;
      });
      setInputs(updatedInputs);
    }
  }, [categoriesData]);

  useEffect(() => {
    setFormData(createInitialFormState(inputs));
    setErrors({});
    setTouchedFields({});
  }, [inputs]);

  useEffect(() => {
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      inputs,
      optionalFieldsEnabled
    );

    setErrors(newErrors);
    setIsFormValid(overallIsValid);
  }, [formData, inputs, optionalFieldsEnabled]);
  

  const handleChange = (
    id: keyof ClientFormData,
    value: string | Date | number | File[] | boolean | null | undefined
  ) => {
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      [id]: true,
    }));

    if (id === "air_conditioning") {
      value = value === "Si" ? true : false;
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleOptionalFieldChange = (id: string, isChecked: boolean) => {
    setOptionalFieldsEnabled((prev) => ({ ...prev, [id]: isChecked }));
    if (!isChecked) {
      setFormData((prevData) => ({ ...prevData, [id]: undefined }));
      setTouchedFields((prevTouched) => ({ ...prevTouched, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await newProduct(formData, navigate);
      showToast(
        toast,
        newProductStrings.toastSuccess.severity,
        newProductStrings.toastSuccess.summary,
        response
      );
      setFormData(createInitialFormState(inputs));
      setTouchedFields({});
      fileUploadRef.current?.clear();
    } catch (error: any) {
      showToast(
        toast,
        newProductStrings.toastError.severity,
        newProductStrings.toastError.summary,
        error.message || "Error desconocido al iniciar sesión"
      );
    }
  };

  const handleNavigateBack = () => {
    setFormData(createInitialFormState(inputs));
    setTouchedFields({});
    fileUploadRef.current?.clear();
    navigate(-1);
  };

  const formLayout = useFormLayout({
    inputs: inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
    fileUploadRef: fileUploadRef,
    optionalFieldsEnabled: optionalFieldsEnabled,
    handleOptionalFieldChange: handleOptionalFieldChange,
  });

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${newProductStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={newProductStrings.title}
        className="max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        <form onSubmit={handleSubmit} className="text-left">
          {formLayout}
          <div className="flex flex-column justify-content-center">
            <div className="flex flex-wrap gap-5 mt-4 mb-3 justify-content-center">
              <Button type="submit" loading={loading} disabled={!isFormValid}>
                {newProductStrings.primaryButton}
              </Button>
              <Button type="button" onClick={handleNavigateBack}>
                {newProductStrings.secondaryButton}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
