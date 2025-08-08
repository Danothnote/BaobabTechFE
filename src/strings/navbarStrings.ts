import type { NavbarStrings } from "../types/navbarTypes";
import { API_BASE_URL } from "./env";


export const navbarStrings: NavbarStrings = {
  logo: {
    src: `${API_BASE_URL}/static/images/logo/logo_one_line.webp`,
    alt: "logo",
  },
  avatar: {
    id: "avatar",
    alt: "avatar",
  },
  profileMenu: [
    {
      page: "/myProducts",
      label: "Mis Productos",
      id: "myProductsLink",
      icon: "pi pi-bookmark",
    },
    {
      page: "/allUsers",
      label: "Usuarios",
      id: "allUsersLink",
      icon: "pi pi-users",
    },
    {
      page: "/profile",
      label: "Mi Perfil",
      id: "profileLink",
      icon: "pi pi-user",
    },
    {
      page: "/login",
      label: "Cerrar Sesión",
      id: "logout",
      icon: "pi pi-sign-out",
    },
  ],
  greetings: {
    label: "Hola,",
    id: "greetings",
  },
  loginButton: {
    label: "Iniciar Sesión",
    id: "loginButton",
  },
  pages: [
    {
      page: "/",
      label: "Inicio",
      id: "homeLink",
      icon: "pi pi-home",
    },
    {
      page: "/allProducts",
      label: "Productos",
      id: "allProductsLink",
      icon: "pi pi-shopping-bag",
    },
    {
      page: "footer",
      label: "Nosotros",
      id: "aboutUsLink",
      icon: "pi pi-briefcase",
    },
  ],
};
