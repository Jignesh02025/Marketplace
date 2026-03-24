import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Home.css";
import Slider from "../components/Slider";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products?page=1&limit=8");
    setProducts(res.data.data);
  };

  return (
    <>

      {/* 🔹 HERO SLIDER */}
      <Slider />

      {/* 🔹 FEATURED COLLECTION */}
      <div className="section">
        <h2>💎 Featured Collection</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p.id}>
              <img src={p.image_url} alt="" />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 TRENDING SECTION */}
      <div className="section">
        <h2>🔥 Trending Jewelry</h2>

        <div className="grid">
          {products.slice(0, 4).map((p) => (
            <div className="card" key={p.id}>
              <img src={p.image_url} alt="" />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}