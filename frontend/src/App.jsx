import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage.jsx' 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import ProductsPage from "./pages/ProductsPage.jsx"
import DisplayProductPage from "./pages/DisplayProductPage.jsx"
const App = () => {

  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/products" element={<ProductsPage/>} />
      <Route path="/products/:productId" element={<DisplayProductPage/>}/>
    </Routes>
    <Footer />
    </>
  )
}

export default App
