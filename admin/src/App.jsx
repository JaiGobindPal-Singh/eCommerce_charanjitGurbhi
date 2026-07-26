import { Routes, Route, Outlet } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx";
import Header from "./components/common/Header.jsx";
import Sidebar from "./components/common/Sidebar.jsx"
import Dashboard from "./components/dashboard/Dashboard.jsx"
import Products from "./components/products/Products.jsx";
import Categories from "./components/categories/Categories.jsx";
const MainLayout = () => (
  <>
    <div className="flex">
    <Sidebar />
    <div className="w-full ">
    <Header/>
    <Outlet />
    </div>
    </div>
  
  </>
);

const App = () => {


  return (
    <Routes>
      {/* pages that NEED the Header and Footer together */}
      <Route element={<MainLayout />}>
      <Route  path="/" element={<Dashboard/>} />
      <Route  path="/products" element={<Products/>} />
      <Route  path="/categories" element={<Categories/>} />
        {/* <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
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
