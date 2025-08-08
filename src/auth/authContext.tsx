import { createContext, useEffect, useState } from "react";
import type { NavigateFunction } from "react-router";
import axios from "axios";
import type { AuthContextType, AuthProviderProps, AuthResponse, AuthUser, UpdateResponse } from "../types/authTypes";
import type { ClientFormData } from "../types/formTypes";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
const API_BASE_URL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get<AuthUser>(`${API_BASE_URL}/auth/me`);
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error al comprobar el estado de autenticación:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

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

  const updateUser = async (updateData: {
    [key: string]: string | string[] | null | undefined;
  }) => {
    setLoading(true);
    try {
      const response = await axios.patch<UpdateResponse>(
        `${API_BASE_URL}/auth/me`,
        updateData
      );

      if (response.status === 200) {
        if (response.data.user) {
          setUser(response.data.user);
        }
        setLoading(false);
        return response.data.message;
      }
      setLoading(false);
      return response.data.message;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error al actualizar usuario:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.detail || "Error al actualizar usuario"
        );
      } else {
        console.error("Error inesperado:", error);
        throw new Error(
          "Ha ocurrido un error inesperado al actualizar el usuario"
        );
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        updateUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
