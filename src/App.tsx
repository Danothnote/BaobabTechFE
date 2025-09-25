import { PrimeReactProvider } from "primereact/api";
import "/node_modules/primeflex/primeflex.css";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import "primeicons/primeicons.css";
import { Navigate, Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { AllProductsPage } from "./pages/AllProductsPage";
import { MyProductsPage } from "./pages/MyProductsPage";
import { NewProductPage } from "./pages/NewProductPage";
import { ProductViewPage } from "./pages/ProductViewPage";
import { AllUsersPage } from "./pages/AllUsersPage";
import { UserViewPage } from "./pages/UserViewPage";
import { NavbarComponent } from "./components/NavbarComponent";
import { FooterComponent } from "./components/FooterComponent";
import { AuthProvider } from "./auth/authContext";
import { CartPage } from "./pages/CartPage";
import {
  AdminRoute,
  MerchantRoute,
  PrivateRoute,
  PublicRoute,
} from "./router/PrivateRoute";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { CategoryCreationPage } from "./pages/CategoryCreationPage";

export const App = () => {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allProducts" element={<AllProductsPage />} />
          <Route path="/products/:product_id" element={<ProductViewPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          <Route element={<MerchantRoute />}>
            <Route path="/newProduct" element={<NewProductPage />} />
            <Route path="/myProducts" element={<MyProductsPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/newCategory" element={<CategoryCreationPage />} />
            <Route path="/allUsers" element={<AllUsersPage />} />
            <Route path="/userView/:user_id" element={<UserViewPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FooterComponent />
      </AuthProvider>
    </PrimeReactProvider>
  );
};
