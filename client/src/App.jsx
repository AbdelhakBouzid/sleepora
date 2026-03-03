import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import ProductDetailsPage from "./pages/ProductDetails";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import CheckoutCardPage from "./pages/CheckoutCard";
import CheckoutSuccessPage from "./pages/CheckoutSuccess";
import CheckoutCancelPage from "./pages/CheckoutCancel";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PolicyPage from "./pages/PolicyPage";
import AdminPage from "./pages/Admin";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/card" element={<CheckoutCardPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/privacy-policy" element={<PolicyPage policyKey="privacyPolicy" />} />
      <Route path="/terms-of-service" element={<PolicyPage policyKey="termsOfService" />} />
      <Route path="/refund-policy" element={<PolicyPage policyKey="refundPolicy" />} />
      <Route path="/shipping-policy" element={<PolicyPage policyKey="shippingPolicy" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
