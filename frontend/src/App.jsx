import { Routes, Route, Outlet } from "react-router-dom"
import Homepage from './pages/Homepage.jsx' 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import ProductsPage from "./pages/ProductsPage.jsx"
import DisplayProductPage from "./pages/DisplayProductPage.jsx"
import CategoriesPage from "./pages/CategoriesPage.jsx"
import OrdersPage from "./pages/OrdersPage.jsx"
import OrderDisplayPage from "./pages/OrderDisplayPage.jsx"


const MainLayout = () => (
  <>
    <Header />
    <Outlet /> 
    <Footer />
  </>
);
const FooterOnlyLayout = ()=>(
<>
<Outlet /> 
    <Footer />
    </>
)

const App = () => {
  return (
    <Routes>
      {/* pages that NEED the Header and Footer together */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDisplayPage />} />
      </Route>

      {/* footer only pages */}
      <Route element={<FooterOnlyLayout/>}>
        <Route path="/products/:productId" element={<DisplayProductPage />} />
      </Route>
      
    </Routes>
  );
};
export default App
