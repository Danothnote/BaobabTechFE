import { substractYears } from "../helpers/substractYears";
import type { FormStrings } from "../types/formTypes";
import { API_BASE_URL, background, WALLPAPER } from "./env";

export const signupStrings: FormStrings = {
  title: "Registro de Usuario",
  imageUrl: `${API_BASE_URL}${WALLPAPER}${background.signup}`,
  inputs: [
    {
      id: "firstname",
      type: "text",
      label: "Nombre",
      placeholder: "Ej: Juan",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      id: "lastname",
      type: "text",
      label: "Apellido",
      placeholder: "Ej: Castillo",
      validation: "Debe tener al menos 2 caracteres",
    },
    {
      id: "birth_date",
      type: "date",
      label: "Fecha de nacimiento",
      placeholder: "Ej: 01/01/1990",
      validation: "Debes ser mayor de 18 años",
      min: substractYears(120),
      max: substractYears(18),
    },
    {
      id: "email",
      type: "email",
      label: "Ingresa tu email",
      placeholder: "Ej: usuario@correo.com",
      validation: "Por favor, ingresa un email válido.",
    },
    {
      id: "password",
      type: "password",
      label: "Ingresa tu contraseña",
      placeholder: "Ej: Secreto123*",
    },
    {
      id: "confirmPassword",
      type: "password",
      label: "Confirmar contraseña",
      placeholder: "Ej: Secreto123*",
    },
  ],
  toastSuccess: {
    severity: "success",
    summary: "¡Registro Exitoso!",
  },
  toastError: {
    severity: "error",
    summary: "Error al registrar el usuario",
  },
  primaryButton: "Registrarse",
  secondaryButton: "Regresar",
};
