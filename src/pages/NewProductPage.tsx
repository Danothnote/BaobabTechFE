import React, { useEffect, useMemo, useRef, useState } from "react";
import { showToast } from "../helpers/showToast";
import type { ClientFormData } from "../types/formTypes";
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

export const NewProductPage = () => {
  const initialFormState = useMemo(() => {
    return createInitialFormState(newProductStrings.inputs);
  }, []);

  const [formData, setFormData] = useState<ClientFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { newProduct, loading } = useNewProduct();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  useEffect(() => {
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      newProductStrings.inputs
    );

    setErrors(newErrors);
    setIsFormValid(overallIsValid);
  }, [formData]);

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
      setFormData(initialFormState);
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
    setFormData(initialFormState);
    setTouchedFields({});
    fileUploadRef.current?.clear();
    navigate(-1);
  };

  const formLayout = useFormLayout({
    inputs: newProductStrings.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
    fileUploadRef: fileUploadRef,
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
