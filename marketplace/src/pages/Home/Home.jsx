import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Home.css";
import Slider from "../components/Slider";

const CATEGORIES = [
  { label: "Rings", emoji: "💍", category: "Rings" },
  { label: "Earrings", emoji: "👂", category: "Earrings" },
  { label: "Necklaces", emoji: "📿", category: "Necklaces" },
  { label: "Bracelets", emoji: "💛", category: "Bracelets" },
  { label: "Bangles", emoji: "🔔", category: "Bangles" },
  { label: "Pendants", emoji: "✨", category: "Pendants" },
];

const WHY_US = [
  { icon: "🏅", title: "Handcrafted", desc: "Every piece is meticulously handcrafted by skilled artisans." },
  { icon: "🔏", title: "BIS Certified", desc: "All jewellery is certified and hallmarked for guaranteed purity." },
  { icon: "🚚", title: "Free Shipping", desc: "Enjoy free shipping on all orders above ₹5,000." },
  { icon: "🔄", title: "Easy Returns", desc: "Hassle-free 7-day return policy on every order." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", review: "Absolutely love my ring! The quality is stunning and delivery was fast.", stars: 5 },
  { name: "Ananya Patel", review: "The necklace I ordered was even more beautiful in person. Highly recommend!", stars: 5 },
  { name: "Meera Joshi", review: "Wonderful craftsmanship and great customer support. Will shop again!", stars: 5 },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?page=1&limit=8");
      setProducts(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* ── Hero Slider ── */}
      <Slider />

      {/* ── Shop by Category ── */}
      <div className="home-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Explore our exquisite jewellery collections</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((c) => (
            <div
              key={c.category}
              className="category-card"
              onClick={() => navigate(`/collection?category=${c.category}`)}
            >
              <span className="cat-emoji">{c.emoji}</span>
              <h4>{c.label}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Collection ── */}
      <div className="home-section home-section--dark">
        <div className="section-header">
          <h2>💎 Featured Collection</h2>
          <p>Handpicked pieces for every occasion</p>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-card-img" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: "pointer" }}>
                <img src={p.image_url} alt={p.name} />
                <div className="product-card-overlay">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}>View Details</button>
                </div>
              </div>
              <div className="product-card-info">
                {p.category && <span className="product-badge">{p.category}</span>}
                <h4>{p.name}</h4>
                <p>₹{Number(p.price).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button className="btn-primary" onClick={() => navigate("/collection")}>
            View All Collections →
          </button>
        </div>
      </div>

      {/* ── Trending ── */}
      <div className="home-section">
        <div className="section-header">
          <h2>🔥 Trending Now</h2>
          <p>Most loved styles this season</p>
        </div>
        <div className="products-grid">
          {products.slice(0, 4).map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-card-img" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: "pointer" }}>
                <img src={p.image_url} alt={p.name} />
                <div className="product-card-overlay">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}>View Details</button>
                </div>
              </div>
              <div className="product-card-info">
                {p.category && <span className="product-badge">{p.category}</span>}
                <h4>{p.name}</h4>
                <p>₹{Number(p.price).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className="home-section why-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p>The promise we make to every customer</p>
        </div>
        <div className="why-grid">
          {WHY_US.map((w) => (
            <div className="why-card" key={w.title}>
              <span className="why-icon">{w.icon}</span>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="home-section home-section--dark">
        <div className="section-header">
          <h2>💬 What Our Customers Say</h2>
          <p>Real stories from real people</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p className="testimonial-review">"{t.review}"</p>
              <div className="testimonial-stars">{"⭐".repeat(t.stars)}</div>
              <h5 className="testimonial-name">— {t.name}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="home-section newsletter-section">
        <div className="newsletter-box">
          <h2>💌 Stay in the Loop</h2>
          <p>Subscribe to get exclusive deals, new arrivals & style tips.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address…" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </>
  );
}