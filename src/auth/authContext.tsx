import { createContext, useEffect, useState } from "react";
import type { NavigateFunction } from "react-router";
import axios from "axios";
import type {
  AuthContextType,
  AuthProviderProps,
  AuthResponse,
  AuthUser,
} from "../types/authTypes";
import type { ClientFormData } from "../types/formTypes";
import { API_BASE_URL } from "../strings/env";
import { useUpdateData } from "../hooks/useUpdateData";
import { useGetData } from "../hooks/useGetData";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const {
    data: userData,
    error,
    isLoading: isSWRLoading,
    mutate,
  } = useGetData<AuthUser>("auth/me");
  const { trigger: updateUserFilesTrigger, message: updateFilesMessage } =
    useUpdateData("auth/me/files");
  const { trigger: updateUserDataTrigger, message: updateDataMessage } =
    useUpdateData("auth/me/data");

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } else if (error) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [userData, error]);

  const login = async (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => {
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        userData
      );
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        navigate("/");
        return response.data.message;
      }
      setLoading(false);
      return response.data.message;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error en el inicio de sesión:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.detail || "Error al iniciar sesión"
        );
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Ha ocurrido un error inesperado");
      }
    }
  };

  const signup = async (
    userData: ClientFormData,
    navigate: NavigateFunction
  ) => {
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/signup`,
        userData
      );
      if (response.status === 200) {
        setLoading(false);
        navigate("/");
        return response.data.message;
      }
      setLoading(false);
      return response.data.message;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error en el inicio de sesión:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.detail || "Error al registrar el usuario"
        );
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Ha ocurrido un error inesperado");
      }
    }
  };

  const updateFilesUser = async (updateData: {
    [key: string]: string | string[] | FormData | Date | null | undefined;
  }) => {
    await updateUserFilesTrigger({ dataToPatch: updateData.data });
    return updateFilesMessage;
  };

  const updateDataUser = async (updateData: {
    [key: string]:
      | string
      | string[]
      | boolean
      | FormData
      | Date
      | null
      | undefined;
  }) => {
    await updateUserDataTrigger({ dataToPatch: updateData });
    return updateFilesMessage;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      setUser(null);
      setIsAuthenticated(false);
      await mutate(null, { revalidate: false });
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      await mutate(null, { revalidate: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading: loading || isSWRLoading,
        updateUserFilesTrigger,
        updateFilesMessage,
        updateUserDataTrigger,
        updateDataMessage,
        refreshUser: mutate,
        login,
        signup,
        updateFilesUser,
        updateDataUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
