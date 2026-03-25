import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import Products from "./pages/Products/Products";
import Home from "./pages/Home/Home";
import Footer from "./pages/Footer/Footer";
import Navbar from "./pages/Navbar/Navbar";
import Collection from "./pages/Collection/Collection";
import Contact from "./pages/Contact/Contact";
import Product from "./pages/Product/Product";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;