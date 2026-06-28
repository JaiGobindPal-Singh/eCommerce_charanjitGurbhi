import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage.jsx' 
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import ProductPage from "./pages/ProductPage.jsx"
const App = () => {

  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/products" element={<ProductPage/>} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
