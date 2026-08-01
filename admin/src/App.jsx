import { Routes, Route, Outlet } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx";
import Header from "./components/common/Header.jsx";
import Sidebar from "./components/common/Sidebar.jsx"
import Dashboard from "./components/dashboard/Dashboard.jsx"
import Products from "./components/products/Products.jsx";
import Categories from "./components/categories/Categories.jsx";
import Orders from "./components/orders/Orders.jsx"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "./utils/userUtils.js";

const MainLayout = () => {
  const navigate = useNavigate();
  //prevent unauthorized access
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (!user?.id || user?.role?.trim() !== "admin") {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    }
    fetchUser();
  }, [navigate]);
  return (
  
  <div className="flex min-h-screen ">
    <Sidebar />
    <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
    </div>
  </div>
)};

const App = () => {


  return (
    <Routes>
      {/* pages that NEED the Header and Footer together */}
      <Route element={<MainLayout />}>
      <Route  path="/" element={<Dashboard/>} />
      <Route  path="/products" element={<Products/>} />
      <Route  path="/categories" element={<Categories/>} />
      <Route path="/orders" element={<Orders />} />
        {/* <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders/:orderId" element={<OrderDisplayPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products/:productId" element={<DisplayProductPage />} /> */}
      </Route>

      {/* login route */}
      <Route path="/login" element={<LoginPage/>}>
        
      </Route>

    </Routes>
  );
};
export default App
