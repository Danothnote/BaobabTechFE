export interface ClientFormData {
  [key: string]: string | Date | number | File[] | boolean | null | undefined;
}

export interface FormToast {
  severity:
    | "success"
    | "info"
    | "warn"
    | "error"
    | "secondary"
    | "contrast"
    | undefined;
  summary: string;
}

export interface FormInput {
  id: string;
  type: "text" | "textarea" | "email" | "password" | "number" | "date" | "file" | "select";
  label?: string;
  uploadButtonLabel?: string;
  placeholder?: string;
  validation?: string;
  options?: string[];
  min?: Date | number;
  max?: Date | number;
}

export interface FormStrings {
  title: string;
  imageUrl: string;
  inputs: FormInput[];
  toastSuccess: FormToast;
  toastError: FormToast;
  primaryButton: string;
  secondaryButton: string;
  optional?: string;
}

export interface CreateInputsProps {
  input: FormInput;
  formData: ClientFormData;
  errors: string | string[] | undefined;
  handleChange: (
    id: keyof ClientFormData,
    value: string | Date | number | File[] | null | undefined
  ) => void;
  isTouched?: boolean;
  fileUploadRef?: React.RefObject<FileUpload>;
}

export interface UseFormLayoutProps {
  inputs: FormInput[];
  formData: ClientFormData;
  errors: Record<string, string[]>;
  handleChange: CreateInputsProps["handleChange"];
  touchedFields: Record<string, boolean>;
  threshold?: number;
  fileUploadRef?: React.RefObject<FileUpload>;
}