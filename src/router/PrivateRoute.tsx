// src/components/PrivateRoute.tsx
import { useAuth } from "../hooks/useAuth";
import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";
import { Navigate, Outlet } from "react-router";

interface PrivateRouteProps {
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export const MerchantRoute: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "merchant") {
    return <Navigate to="/allProducts" />;
  }

  return <Outlet />;
};

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};