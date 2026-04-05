import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Home.css";
import Slider from "../components/Slider";

const CATEGORY_MAP = {
  Rings: "💍",
  Earrings: "👂",
  Necklaces: "📿",
  Bracelets: "💛",
  Bangles: "🔔",
  Pendants: "✨",
};

const WHY_US = [
  { icon: "🏅", title: "Handcrafted", desc: "Every piece is meticulously handcrafted by skilled artisans." },
  { icon: "🔏", title: "BIS Certified", desc: "All jewellery is certified and hallmarked for guaranteed purity." },
  { icon: "🚚", title: "Free Shipping", desc: "Enjoy free shipping on all orders above ₹5,000." },
  { icon: "🔄", title: "Easy Returns", desc: "Hassle-free 7-day return policy on every order." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", location: "Mumbai", review: "Absolutely love my ring! The quality is stunning and delivery was fast. Packaging was beautiful too.", stars: 5 },
  { name: "Ananya Patel", location: "Ahmedabad", review: "The necklace I ordered was even more beautiful in person. My friends couldn't stop complimenting!", stars: 5 },
  { name: "Meera Joshi", location: "Pune", review: "Wonderful craftsmanship and great customer support. This is my third order and I'll keep coming back.", stars: 5 },
  { name: "Ritu Verma", location: "Delhi", review: "Gifted earrings to my mother — she was thrilled! The gold finish looks premium and feels lightweight.", stars: 5 },
  { name: "Sneha Reddy", location: "Hyderabad", review: "I was hesitant buying jewellery online but the quality exceeded my expectations. Truly recommended.", stars: 4 },
  { name: "Kavya Nair", location: "Kochi", review: "Beautiful bracelet, perfect fit. The return policy gave me confidence to order. Five stars all the way!", stars: 5 },
];

/* ── Reusable product card ── */
function ProductCard({ p, navigate }) {
  return (
    <div className="product-card">
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
  );
}

/* ── Auto-sliding product carousel (for Trending) ── */
function AutoSlider({ items, navigate }) {
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector(".product-card")?.offsetWidth || 260;
    const gap = 18;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const currentScroll = scrollRef.current.scrollLeft;

    if (dir === 1 && currentScroll >= maxScroll - 5) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && currentScroll <= 5) {
      scrollRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
    }
  };

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => scroll(1), 3000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  const manualScroll = (dir) => {
    clearInterval(timerRef.current);
    scroll(dir);
    startAuto();
  };

  if (!items.length) return null;

  return (
    <div className="product-slider-wrapper">
      <button className="slider-arrow slider-arrow--left" onClick={() => manualScroll(-1)} aria-label="Previous">‹</button>
      <div className="products-grid products-grid--slider" ref={scrollRef}>
        {items.map((p) => (
          <ProductCard key={p.id} p={p} navigate={navigate} />
        ))}
      </div>
      <button className="slider-arrow slider-arrow--right" onClick={() => manualScroll(1)} aria-label="Next">›</button>
    </div>
  );
}

/* ── Testimonial carousel ── */
/* ── Testimonial carousel — 3 visible at once ── */
function TestimonialCarousel({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const total = testimonials.length;
  const timerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) setVisibleCount(1);
      else if (window.innerWidth <= 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalDots = Math.max(1, total - visibleCount + 1);

  const goTo = useCallback((i) => {
    setCurrent(((i % totalDots) + totalDots) % totalDots);
  }, [totalDots]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalDots);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [totalDots]);

  const nav = (i) => {
    clearInterval(timerRef.current);
    goTo(i);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalDots);
    }, 5000);
  };

  const visibleIndices = Array.from({ length: visibleCount }, (_, i) => (current + i) % total);
  const visibleItems = visibleIndices.map(index => testimonials[index]);

  return (
    <div className="testimonial-carousel testimonial-carousel--multi">
      <button className="tc-arrow tc-arrow--left" onClick={() => nav(current - 1)} aria-label="Previous review">‹</button>

      <div className="tc-multi-grid" key={current}>
        {visibleItems.map((t, i) => (
          <div className="tc-card" key={i}>
            <div className="tc-stars">{"⭐".repeat(t.stars)}</div>
            <p className="tc-review">"{t.review}"</p>
            <h5 className="tc-name">— {t.name}</h5>
            <span className="tc-location">{t.location}</span>
          </div>
        ))}
      </div>

      <button className="tc-arrow tc-arrow--right" onClick={() => nav(current + 1)} aria-label="Next review">›</button>

      <div className="tc-dots">
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            className={`tc-dot ${i === current ? "active" : ""}`}
            onClick={() => nav(i)}
            aria-label={`Go to review set ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch more initially so we have enough after filtering
      const res = await API.get("/products?page=1&limit=24");
      const filtered = (res.data.data || []).filter(p => p.image_url && p.image_url.trim() !== "");
      setProducts(filtered.slice(0, 8)); // Display the first 8 with images
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/products/categories");
      const active = (res.data || []).map(cat => ({
        label: cat,
        emoji: CATEGORY_MAP[cat] || "💎",
        category: cat,
      }));
      setCategories(active);
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
          {categories.map((c) => (
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
          <h2>Featured Collection</h2>
          <p>Handpicked pieces for every occasion</p>
        </div>

        <AutoSlider items={products} navigate={navigate} />

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button className="btn-primary" onClick={() => navigate("/collection")}>
            View All Collections →
          </button>
        </div>
      </div>
      {/* ── Bridal Collection Banner ── */}
      <section className="banner-section banner-section--reverse">
        <div className="banner-content">
          <span className="banner-subtitle">Exquisite Artistry</span>
          <h2>The Bridal Edit</h2>
          <p>Discover timeless masterpieces designed for your most special day. From classic diamonds to heritage gold, find pieces that celebrate your unique love story.</p>
          <button className="btn-secondary" onClick={() => navigate("/collection")}>Explore Bridal Collection</button>
        </div>
        <div className="banner-image">
          <img src="/bridal_collection.png" alt="Bridal Collection" />
        </div>
      </section>
      {/* ── Solitaire Banner (Full Width Style) ── */}
      <section className="banner-section banner-section--full banner-section--darker">
        <div className="banner-image">
          <img src="/solitaire_clean.png" alt="Solitaire Collection" />
        </div>
        <div className="banner-content banner-content--centered">
          <span className="banner-subtitle">Truly One of a Kind</span>
          <h2>The Solitaire Story</h2>
          <p>Each solitaire is a singular masterpiece, meticulously chosen for its exceptional brilliance and fire. Celebrate your unique journey with a diamond that reflects your story.</p>
          <button className="btn-secondary" onClick={() => navigate("/collection")}>Discover Solitaires</button>
        </div>
      </section>

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
          <h2>What Our Customers Say</h2>
          <p>Real stories from real people</p>
        </div>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </div>

      {/* ── Newsletter ── */}
      <div className="home-section newsletter-section">
        <div className="newsletter-box">
          <h2>Stay in the Loop</h2>
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