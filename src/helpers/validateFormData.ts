import { errorStrings } from "../strings/errorPasswordStrings";
import type { ClientFormData, FormInput } from "../types/formTypes";
import { validatePassword } from "./validatePassword";

export const validateFormData = (
  formData: ClientFormData,
  inputs: FormInput[]
): { errors: Record<string, string[]>; isValid: boolean } => {
  let hasEmptyOrInvalidFields = false;
  const newErrors: Record<string, string[]> = {};
  const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

  const isSignupForm = inputs.some((input) => input.id === "confirmPassword");

  for (const input of inputs) {
    const value = formData[input.id];

    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty && input.validation) {
      if (!newErrors[input.id as string]) newErrors[input.id as string] = [];
      newErrors[input.id as string].push(input.validation);
      hasEmptyOrInvalidFields = true;
    }

    if (input.type === "email") {
      const emailValue = value as string;
      if (!isEmpty && !emailRegex.test(emailValue)) {
        if (!newErrors[input.id as string]) newErrors[input.id as string] = [];
        newErrors[input.id as string].push(input.validation!);
        hasEmptyOrInvalidFields = true;
      }
    }

    if (input.type === "text") {
      const textValue = value as string;
      if (
        !isEmpty &&
        input.validation &&
        input.validation.includes("al menos 2 caracteres") &&
        typeof textValue === "string" &&
        textValue.length < 2
      ) {
        if (!newErrors[input.id as string]) newErrors[input.id as string] = [];
        newErrors[input.id as string].push(input.validation);
        hasEmptyOrInvalidFields = true;
      }
    }

    if (input.type === "number") {
      const numberValue = value as number;
      if (!isEmpty) {
        if (
          input.min !== undefined &&
          typeof input.min === "number" &&
          numberValue < input.min
        ) {
          if (!newErrors[input.id as string])
            newErrors[input.id as string] = [];
          newErrors[input.id as string].push(input.validation!);
          hasEmptyOrInvalidFields = true;
        }
        if (
          input.max !== undefined &&
          typeof input.max === "number" &&
          numberValue > input.max
        ) {
          if (!newErrors[input.id as string])
            newErrors[input.id as string] = [];
          newErrors[input.id as string].push(input.validation!);
          hasEmptyOrInvalidFields = true;
        }
      }
    }

    if (input.type === "date") {
      const dateValue = value as Date | null;
      if (!isEmpty && dateValue) {
        if (
          input.min &&
          input.min instanceof Date &&
          dateValue < input.min
        ) {
          if (!newErrors[input.id as string])
            newErrors[input.id as string] = [];
          newErrors[input.id as string].push(input.validation!);
          hasEmptyOrInvalidFields = true;
        }
        if (
          input.max &&
          input.max instanceof Date &&
          dateValue > input.max
        ) {
          if (!newErrors[input.id as string])
            newErrors[input.id as string] = [];
          newErrors[input.id as string].push(input.validation!);
          hasEmptyOrInvalidFields = true;
        }
      }
    }

    if (input.id === "password" && isSignupForm) {
      const password = (formData.password as string | undefined | null) || "";
      if (!isEmpty) {
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
          if (!newErrors.password) newErrors.password = [];
          newErrors.password = [...newErrors.password, ...passwordErrors];
          hasEmptyOrInvalidFields = true;
        }
      }
    }

    if (input.id === "confirmPassword" && isSignupForm) {
      const password = (formData.password as string | undefined | null) || "";
      const confirmPassword =
        (formData.confirmPassword as string | undefined | null) || "";

      if (!isEmpty && password !== confirmPassword) {
        if (!newErrors.confirmPassword) {
          newErrors.confirmPassword = [];
        }
        newErrors.confirmPassword.push(errorStrings.confirmPasswordError);
        hasEmptyOrInvalidFields = true;
      } else if (isEmpty) {
        if (!newErrors.confirmPassword) {
          newErrors.confirmPassword = [];
        }
        newErrors.confirmPassword.push(errorStrings.pleaseConfirmPassword);
        hasEmptyOrInvalidFields = true;
      }
    }
  }

  return { errors: newErrors, isValid: !hasEmptyOrInvalidFields };
};
