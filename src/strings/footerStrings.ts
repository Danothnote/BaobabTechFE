import type { FooterStrings } from "../types/footerTypes";
import { API_BASE_URL } from "./env";

export const footerStrings: FooterStrings = {
  title: "Acerca de Nosotros",
  about: {
    title: "¿Por qué elegirnos?",
    list: [
      "Cada equipo es rigurosamente probado y restaurado para asegurar su funcionamiento impecable.",
      "Obtén el rendimiento que deseas a una fracción del costo de un equipo nuevo.",
      "Al comprar equipos de segunda mano, contribuyes a reducir los residuos electrónicos y a cuidar el medio ambiente",
    ],
  },
  social: {
    title: "Síguenos en nuestras redes sociales",
    list: [
      {
        name: "YouTube",
        iconUrl: `${API_BASE_URL}/static/images/socials/youtube.webp`,
        socialUrl: "https://youtube.com",
      },
      {
        name: "Instagram",
        iconUrl: `${API_BASE_URL}/static/images/socials/instagram.webp`,
        socialUrl: "https://instagram.com",
      },
      {
        name: "TikTok",
        iconUrl: `${API_BASE_URL}/static/images/socials/tiktok.webp`,
        socialUrl: "https://tiktok.com",
      },
      {
        name: "Facebook",
        iconUrl: `${API_BASE_URL}/static/images/socials/facebook.webp`,
        socialUrl: "https://facebook.com",
      },
    ],
  },
  contact: {
    title: "Escríbenos a nuestro WhatsApp",
    list: [
      {
        number: "+593 998678181",
        iconUrl: `${API_BASE_URL}/static/images/socials/whatsapp.webp`,
      },
    ],
  },
  copyright: "BaobabTech. Todos los derechos reservados.",
};
