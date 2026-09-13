import { lazy, Suspense, useEffect } from "react"
import { Routes, Route, Outlet } from "react-router-dom"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import api from "./configs/axiosConfig.js"
import userStore from "./store/userStore.js"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"

const Homepage = lazy(() => import('./pages/Homepage.jsx'))
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const DisplayProductPage = lazy(() => import('./pages/DisplayProductPage.jsx'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'))
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'))
const OrderDisplayPage = lazy(() => import('./pages/OrderDisplayPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))

const PageLoading = () => <div className="min-h-[40vh]" aria-label="Loading" />
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
        id: serverUser?.id || "",
        role: serverUser?.role || "",
      };
      if (normalizedUser.id) {
        userStore.getState().setUser(normalizedUser);
      }
    }).catch(() => {
    });
  }, [])

  return (
    <Suspense fallback={<PageLoading />}>
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
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products/:productId" element={<DisplayProductPage />} />
        <Route path="/legal" element={<Legal />} />

      </Route>

      {/* footer only pages */}
      <Route element={<FooterOnlyLayout />}>
      </Route>

      </Routes>
    </Suspense>
  );
};
export default App
