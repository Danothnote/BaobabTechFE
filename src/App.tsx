import { PrimeReactProvider } from "primereact/api";
import "/node_modules/primeflex/primeflex.css";
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import "primeicons/primeicons.css";
import { Route, Routes } from "react-router"
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

export const App = () => {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/allProducts" element={<AllProductsPage />} />
          <Route path="/myProducts" element={<MyProductsPage />} />
          <Route path="/newProduct" element={<NewProductPage />} />
          <Route path="/product/:product_id" element={<ProductViewPage />} />
          <Route path="/allUsers" element={<AllUsersPage />} />
          <Route path="/{user_id}" element={<UserViewPage />} />
        </Routes>
        <FooterComponent />
      </AuthProvider>
    </PrimeReactProvider>
  )
}
