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
import type { FileUpload } from "primereact/fileupload";
import { DialogComponent } from "../components/DialogComponent";
import { usePostData } from "../hooks/usePostData";

export const LoginPage = () => {
  const initialFormState = useMemo(() => {
    return createInitialFormState([
      ...loginStrings.inputs,
      ...loginStrings.dialog!.inputs,
    ]);
  }, []);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClientFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { login, loading } = useAuth();
  const { trigger: forgotPasswordTrigger, isLoading: isSendingEmail } =
    usePostData("auth/forgot-password");
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const allInputs = [...loginStrings.inputs, ...loginStrings.dialog!.inputs];
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      allInputs,
      {}
    );

    const loginInputIds = loginStrings.inputs.map((i) => i.id);
    const loginErrors = Object.keys(newErrors).filter((key) =>
      loginInputIds.includes(key)
    );
    const isLoginValid =
      loginErrors.length === 0 &&
      loginInputIds.every((id) => {
        return !newErrors[id] || newErrors[id].length === 0;
      });

    setErrors(newErrors);
    setIsFormValid(isLoginValid);
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

  const fileUploadRef = useRef<FileUpload>(null);
  const handleOptionalFieldChange = (id: string, isChecked: boolean) => {};

  const formLayout = useFormLayout({
    inputs: loginStrings.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
    optionalFieldsEnabled: {},
    fileUploadRef: fileUploadRef,
    handleOptionalFieldChange: handleOptionalFieldChange,
  });

  const dialogFormLayout = useFormLayout({
    inputs: loginStrings.dialog!.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
    optionalFieldsEnabled: {},
    fileUploadRef: fileUploadRef,
    handleOptionalFieldChange: handleOptionalFieldChange,
  });

  const handleForgotPassword = async () => {
    try {
      await forgotPasswordTrigger({
        email: formData.forgotPasswordEmail,
      });
      showToast(
        toast,
        loginStrings.toastSuccess.severity,
        "Restablecimiento",
        "Si la cuenta existe, se ha enviado un correo de restablecimiento"
      );
    } catch (error) {
      console.error(error);
    }
    setShowDialog(false);
  };

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
              onClick={() => setShowDialog(true)}
            />
          </div>
        </form>
      </Card>

      <DialogComponent
        title={loginStrings.dialog!.title}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        confirmButtonLabel="Restablecer"
        confirmButtonAction={handleForgotPassword}
        confirmButtonLoading={isSendingEmail}
        cancelButtonLabel="Cancelar"
        cancelButtonAction={() => setShowDialog(false)}
        bodyComponent={
          <div className="text-center">
            <p className="p-5">
              Al presionar el botón de restablecer se te enviará un email para
              reiniciar tu contraseña
            </p>
            {dialogFormLayout}
          </div>
        }
      />
    </div>
  );
};
