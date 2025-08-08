import { useEffect, useMemo, useRef, useState } from "react";
import type { ClientFormData } from "../types/formTypes";
import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { loginStrings } from "../strings/loginStrings";
import { createInitialFormState } from "../helpers/createInitialFormState";
import { validateFormData } from "../helpers/validateFormData";
import { showToast } from "../helpers/showToast";
import { useFormLayout } from "../hooks/useFormLayout";

export const LoginPage = () => {
  const initialFormState = useMemo(() => {
    return createInitialFormState(loginStrings.inputs);
  }, []);

  const [formData, setFormData] = useState<ClientFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      loginStrings.inputs
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
      const response = await login(formData, navigate);
      showToast(
        toast,
        loginStrings.toastSuccess.severity,
        loginStrings.toastSuccess.summary,
        response
      );
      setFormData(initialFormState);
      setTouchedFields({});
    } catch (error: any) {
      showToast(
        toast,
        loginStrings.toastError.severity,
        loginStrings.toastError.summary,
        error.message || "Error desconocido al iniciar sesión"
      );
    }
  };

  const handleNavigateSignup = () => {
    setFormData(initialFormState);
    setTouchedFields({});
    navigate("/signup");
  };

  const handleNavigateResetPassword = () => {
    console.log("Reset Password");
  };

  const formLayout = useFormLayout({
    inputs: loginStrings.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
  });

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${loginStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={loginStrings.title}
        className="max-w-30rem max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        <form onSubmit={handleSubmit}>
          {formLayout}

          <div className="flex flex-column justify-content-center">
            <div className="flex flex-wrap gap-5 mt-4 mb-3 justify-content-center">
              <Button type="submit" loading={loading} disabled={!isFormValid}>
                {loginStrings.primaryButton}
              </Button>
              <Button type="button" onClick={handleNavigateSignup}>
                {loginStrings.secondaryButton}
              </Button>
            </div>
            <Button
              type="button"
              label={loginStrings.optional}
              link
              onClick={handleNavigateResetPassword}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};
