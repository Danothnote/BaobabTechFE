import React, { useEffect, useMemo, useRef, useState } from "react";
import { showToast } from "../helpers/showToast";
import { signupStrings } from "../strings/signupStrings";
import type { ClientFormData } from "../types/formTypes";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { validateFormData } from "../helpers/validateFormData";
import { createInitialFormState } from "../helpers/createInitialFormState";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useFormLayout } from "../hooks/useFormLayout";

export const SignupPage = () => {
  const initialFormState = useMemo(() => {
    return createInitialFormState(signupStrings.inputs);
  }, []);

  const [formData, setFormData] = useState<ClientFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      signupStrings.inputs
    );

    setErrors(newErrors);
    setIsFormValid(overallIsValid);
  }, [formData]);

  const handleChange = (
    id: keyof ClientFormData,
    value: string | Date | number | File[] | null | undefined
  ) => {
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      [id]: true,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await signup(formData, navigate);
      showToast(
        toast,
        signupStrings.toastSuccess.severity,
        signupStrings.toastSuccess.summary,
        response
      );
      setFormData(initialFormState);
      setTouchedFields({});
    } catch (error: any) {
      showToast(
        toast,
        signupStrings.toastError.severity,
        signupStrings.toastError.summary,
        error.message || "Error desconocido al registrar el usuario"
      );
    }
  };

  const handleNavigateBack = () => {
    setFormData(initialFormState);
    setTouchedFields({});
    navigate(-1);
  };

  const formLayout = useFormLayout({
    inputs: signupStrings.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
  });

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${signupStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={signupStrings.title}
        className="max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        <form onSubmit={handleSubmit}>
          {formLayout}

          <div className="flex flex-column justify-content-center">
            <div className="flex flex-wrap gap-5 mt-4 mb-3 justify-content-center">
              <Button type="submit" loading={loading} disabled={!isFormValid}>
                {signupStrings.primaryButton}
              </Button>
              <Button type="button" onClick={handleNavigateBack}>
                {signupStrings.secondaryButton}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
