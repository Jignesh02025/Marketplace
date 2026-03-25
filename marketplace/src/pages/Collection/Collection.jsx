import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Collection.css";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Pendants"];

export default function Collection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products?page=${page}&limit=12`);
      setProducts(res.data.data || []);
      if (res.data.total && res.data.limit) {
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((p) =>
        p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search filter
    if (search.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }


    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => a.name?.localeCompare(b.name));

    setFiltered(result);
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className="collection-page">
      {/* ── Hero Banner ── */}
      <div className="collection-hero">
        <div className="collection-hero-overlay">
          <h1>Our Collection</h1>
          <p>Timeless elegance, crafted for you</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="collection-controls">
        <input
          className="collection-search"
          type="text"
          placeholder="🔍 Search jewelry…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="collection-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {/* ── Category Tabs ── */}
      <div className="collection-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="collection-count">
        {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* ── Product Grid ── */}
      {loading ? (
        <div className="collection-loader">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="collection-empty">
          <span>💎</span>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="collection-grid">
          {filtered.map((p) => (
            <div className="col-card" key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: "pointer" }}>
              <div className="col-card-img-wrap">
                <img src={p.image_url} alt={p.name} />
                <div className="col-card-overlay">
                  <button className="enquire-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}>View Details</button>
                </div>
              </div>
              <div className="col-card-info">
                {p.category && <span className="col-card-badge">{p.category}</span>}
                <h4>{p.name}</h4>
                <p className="col-card-price">₹{Number(p.price).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="collection-pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
