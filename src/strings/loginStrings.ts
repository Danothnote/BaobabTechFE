import type { FormStrings } from "../types/formTypes";
import { API_BASE_URL, WALLPAPER, background } from "./env";

export const loginStrings: FormStrings = {
  title: "Inicio de Sesión",
  imageUrl: `${API_BASE_URL}${WALLPAPER}${background.login}`,
  inputs: [
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
      validation: "Este campo es obligatorio",
    },
  ],
  toastSuccess: {
    severity: "success",
    summary: "¡Inicio de Sesión Exitoso!",
  },
  toastError: {
    severity: "error",
    summary: "Error al Iniciar Sesión",
  },
  primaryButton: "Iniciar Sesión",
  secondaryButton: "Registrarse",
  optional: "Olvidé mi contraseña",
};
