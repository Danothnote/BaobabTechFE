import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePostData } from "../hooks/usePostData";
import { resetPasswordStrings } from "../strings/resetPasswordStrings";
import { createInitialFormState } from "../helpers/createInitialFormState";
import type { ClientFormData } from "../types/formTypes";
import { useFormLayout } from "../hooks/useFormLayout";
import type { FileUpload } from "primereact/fileupload";
import { validateFormData } from "../helpers/validateFormData";
import { showToast } from "../helpers/showToast";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const initialFormState = useMemo(() => {
    return createInitialFormState(resetPasswordStrings.inputs);
  }, []);
  const [formData, setFormData] = useState<ClientFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { trigger: forgotPasswordTrigger, isLoading: loading } = usePostData(
    "auth/reset-password"
  );
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const { errors: newErrors, isValid: overallIsValid } = validateFormData(
      formData,
      resetPasswordStrings.inputs,
      {}
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

  const fileUploadRef = useRef<FileUpload>(null);
  const handleOptionalFieldChange = (id: string, isChecked: boolean) => {};

  const formLayout = useFormLayout({
    inputs: resetPasswordStrings.inputs,
    formData: formData,
    errors: errors,
    handleChange: handleChange,
    touchedFields: touchedFields,
    optionalFieldsEnabled: {},
    fileUploadRef: fileUploadRef,
    handleOptionalFieldChange: handleOptionalFieldChange,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPasswordTrigger({
        token: token,
        new_password: formData.password,
      });
      showToast(
        toast,
        resetPasswordStrings.toastSuccess.severity,
        "Restablecimiento",
        resetPasswordStrings.toastSuccess.summary
      );
      navigate("/login");
    } catch (error) {
      showToast(
        toast,
        resetPasswordStrings.toastError.severity,
        "Restablecimiento",
        resetPasswordStrings.toastError.summary
      );
      console.error(error);
    }
  };

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${resetPasswordStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={resetPasswordStrings.title}
        className="max-w-30rem max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        <form onSubmit={handleSubmit}>
          {formLayout}

          <div className="flex flex-column justify-content-center">
            <div className="flex flex-wrap gap-5 mt-4 mb-3 justify-content-center">
              <Button type="submit" loading={loading} disabled={!isFormValid}>
                {resetPasswordStrings.primaryButton}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
