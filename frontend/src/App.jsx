import { Routes, Route, Outlet } from "react-router-dom"
import Homepage from './pages/Homepage.jsx'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import ProductsPage from "./pages/ProductsPage.jsx"
import DisplayProductPage from "./pages/DisplayProductPage.jsx"
import CategoriesPage from "./pages/CategoriesPage.jsx"
import OrdersPage from "./pages/OrdersPage.jsx"
import OrderDisplayPage from "./pages/OrderDisplayPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import { useEffect } from "react"
import api from "./configs/axiosConfig.js"
import userStore from "./store/userStore.js"
import ShippingAddressPage from "./pages/ShippingAddressPage.jsx"

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
const FooterOnlyLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
)

const App = () => {

  // get the userData when user visits the site
  useEffect(() => {
    api.get("/check-user").then((response) => {
      const payload = response?.data;
      const serverUser = payload?.user
      const normalizedUser = {
        name: serverUser?.name || "",
        phone: serverUser?.phone || "",
        id:  serverUser?.id || "",
        role: serverUser?.role || "",
      };
      if (normalizedUser.id) {
        userStore.getState().setUser(normalizedUser);
      }
    }).catch(() => {
    });
  }, [])

  return (
    <Routes>
      {/* pages that NEED the Header and Footer together */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDisplayPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pre-checkout" element={<ShippingAddressPage />} />
      </Route>

      {/* footer only pages */}
      <Route element={<FooterOnlyLayout />}>
        <Route path="/products/:productId" element={<DisplayProductPage />} />
      </Route>

    </Routes>
  );
};
export default App
