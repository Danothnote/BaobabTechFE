import type { NavigateFunction } from "react-router";
import type { ClientFormData } from "./formTypes";

export interface AuthUser {
  _id: string;
  firstname: string;
  lastname: string;
  birth_date: Date | null;
  email: string | null;
  password?: string;
  profile_picture: string;
  favorite_products: string[];
  role: "admin" | "user";
  createdAt: Date | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => Promise<string>;
  signup: (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => Promise<string>;
  updateUser: (data: {
    [key: string]: string | string[] | null | undefined;
  }) => Promise<string>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

export interface UpdateResponse {
  message: string;
  user?: AuthUser;
}
