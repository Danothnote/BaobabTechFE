import type { FormStrings } from "../types/formTypes";
import { API_BASE_URL, background, WALLPAPER } from "./env";

export const resetPasswordStrings: FormStrings = {
  title: "Restablecimiento de contraseña",
  imageUrl: `${API_BASE_URL}${WALLPAPER}${background.login}`,
  inputs: [
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
    summary: "¡Contraseña cambiada exitosamente!",
  },
  toastError: {
    severity: "error",
    summary: "Error al cambiar la contraseña",
  },
  primaryButton: "Cambiar Contraseña",
  secondaryButton: "Cancelar",
};
