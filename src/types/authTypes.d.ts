import type { NavigateFunction } from "react-router";
import type { ClientFormData } from "./formTypes";

export interface AuthUser {
  _id: string;
  firstname: string;
  lastname: string;
  birth_date: Date | null | string;
  email: string | null;
  password?: string;
  profile_picture: string;
  status: "active" | "inactive";
  is_verified: boolean;
  role: "admin" | "merchant" | "user";
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  updateUserFilesTrigger: (arg: { dataToPatch: any }) => Promise<any>;
  updateUserDataTrigger: (arg: { dataToPatch: any }) => Promise<any>;
  updateFilesMessage: string | undefined;
  updateDataMessage: string | undefined;
  refreshUser: KeyedMutator<AuthResponse>;

  login: (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => Promise<string>;

  signup: (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => Promise<string>;

  updateFilesUser: (data: {
    [key: string]: string | string[] | FormData | Date | null | undefined;
  }) => Promise<string | null | undefined>;

  updateDataUser: (data: {
    [key: string]: string | string[] | FormData | Date | null | undefined;
  }) => Promise<string | null | undefined>;

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

export interface GetUsersData {
  message: string;
  data: AuthUser[];
}
