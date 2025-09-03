import { API_BASE_URL, background, WALLPAPER } from "./env";

export const userProfileStrings = {
  imageUrl: `${API_BASE_URL}${WALLPAPER}${background.profile}`,
  title: "Perfil de usuario",
  userLabels: {
    firstname: "Nombre:",
    lastname: "Apellido:",
    birth_date: "Fecha de nacimiento:",
    email: "Email:",
    role: "Rol:"
  },
  primaryButton: "Cerrar Sesión",
  secondaryButton: "Cambiar Contraseña",
  deactivateButton: "Desactivar Cuenta",
};
