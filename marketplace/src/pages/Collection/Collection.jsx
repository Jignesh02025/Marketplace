import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/axios";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Collection.css";

export default function Collection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // 🔹 Advanced Filters
  const [showFilter, setShowFilter] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000); // 10L default max
  const [carats, setCarats] = useState("All");
  const [color, setColor] = useState("All");
  const [clarity, setClarity] = useState("All");
  const [shape, setShape] = useState("All");
  const [weight, setWeight] = useState("All");
  const [openFilters, setOpenFilters] = useState({
    jewelry: true,
    carats: false,
    shape: false,
    color: false,
    clarity: false,
    weight: false,
    price: true,
  });

  const toggleFilterGroup = (group) => {
    setOpenFilters((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const filterOptions = {
    carats: ["All", "0.5", "1.0", "1.5", "2.0", "3.0+"],
    color: ["All", "D", "E", "F", "G", "H", "I", "J"],
    clarity: ["All", "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"],
    shape: ["All", "Round", "Princess", "Emerald", "Oval", "Marquise", "Pear"],
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 24,
        category: activeCategory,
        minPrice,
        maxPrice,
        carats: carats !== "All" ? carats : "",
        color: color !== "All" ? color : "",
        clarity: clarity !== "All" ? clarity : "",
        shape: shape !== "All" ? shape : "",
        weight: weight !== "All" ? weight : "",
        search: search.trim() !== "" ? search : "",
      };
      const res = await API.get("/products", { params });
      const fetchedProducts = res.data.data || [];
      setProducts(fetchedProducts);
      
      // Update filtered immediately to avoid flicker
      let sorted = [...fetchedProducts];
      if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
      else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
      else if (sortBy === "name") sorted.sort((a, b) => a.name?.localeCompare(b.name));
      setFiltered(sorted);

      if (res.data.total !== undefined) {
        setTotalResults(res.data.total);
        if (res.data.limit) {
          setTotalPages(Math.ceil(res.data.total / res.data.limit));
        }
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/products/categories");
      setCategories(["All", ...(res.data || [])]);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    const handleScreen = () => {
      if (window.innerWidth <= 820) {
        setShowFilter(false); // hide filter
      }
    };

    handleScreen(); // run on load
    window.addEventListener("resize", handleScreen);

    return () => window.removeEventListener("resize", handleScreen);
  }, []);
  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    const q = searchParams.get("search") || "";
    setActiveCategory(cat);
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, carats, color, clarity, shape, weight, minPrice, maxPrice, search]);

  useEffect(() => {
    if (!!localStorage.getItem("token")) {
      fetchProducts();
      fetchCategories();
    }
  }, [page, activeCategory, carats, color, clarity, shape, weight, minPrice, maxPrice, search]);

  if (!localStorage.getItem("token")) {
    return <LoginRequired message="Discover our curated luxury collections. Please login to browse and purchase." />;
  }

  useEffect(() => {
    let result = [...products];
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => a.name?.localeCompare(b.name));
    setFiltered(result);
  }, [products, sortBy]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    if (cat === "All") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setCarats("All"); setColor("All"); setClarity("All"); setShape("All"); setWeight("All");
    setMinPrice(0); setMaxPrice(1000000); setSearch("");
    setPage(1);
  };

  return (
    <div className="collection-page">
      <div className="collection-hero">
        <div className="collection-hero-overlay">
          <h1>Explore Collection</h1>
          <p>Exquisite craftsmanship, curated for you</p>
        </div>
      </div>

      <div className="collection-layout">
        <aside className={`filter-sidebar ${showFilter ? "show" : "hide"}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("jewelry")}>
              <label>Jewelry</label>
              <span className={`toggle-icon ${openFilters.jewelry ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.jewelry && (
              <div className="cat-sidebar-list">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-sidebar-item ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("carats")}>
              <label>Carats</label>
              <span className={`toggle-icon ${openFilters.carats ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.carats && (
              <div className="cat-sidebar-list">
                {filterOptions.carats.map(c => (
                  <button 
                    key={c} 
                    className={`cat-sidebar-item ${carats === c ? "active" : ""}`}
                    onClick={() => setCarats(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div> */}

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("shape")}>
              <label>Shape</label>
              <span className={`toggle-icon ${openFilters.shape ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.shape && (
              <div className="cat-sidebar-list">
                {filterOptions.shape.map(s => (
                  <button
                    key={s}
                    className={`cat-sidebar-item ${shape === s ? "active" : ""}`}
                    onClick={() => setShape(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("color")}>
              <label>Color</label>
              <span className={`toggle-icon ${openFilters.color ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.color && (
              <div className="cat-sidebar-list">
                {filterOptions.color.map(c => (
                  <button
                    key={c}
                    className={`cat-sidebar-item ${color === c ? "active" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("clarity")}>
              <label>Clarity</label>
              <span className={`toggle-icon ${openFilters.clarity ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.clarity && (
              <div className="cat-sidebar-list">
                {filterOptions.clarity.map(c => (
                  <button
                    key={c}
                    className={`cat-sidebar-item ${clarity === c ? "active" : ""}`}
                    onClick={() => setClarity(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("weight")}>
              <label>Weight (gm)</label>
              <span className={`toggle-icon ${openFilters.weight ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.weight && (
              <div className="cat-sidebar-list">
                {["All", "2g", "5g", "10g", "20g", "50g+"].map(w => (
                  <button
                    key={w}
                    className={`cat-sidebar-item ${weight === w ? "active" : ""}`}
                    onClick={() => setWeight(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-group-header" onClick={() => toggleFilterGroup("price")}>
              <label>Price Range</label>
              <span className={`toggle-icon ${openFilters.price ? "open" : ""}`}>▾</span>
            </div>
            {openFilters.price && (
              <div className="price-range-container">
                <div className="price-display">
                  <span>₹{minPrice.toLocaleString("en-IN")}</span>
                  <span> - </span>
                  <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="dual-range-slider">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 10000);
                      setMinPrice(val);
                    }}
                    className="range-input min-range"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 10000);
                      setMaxPrice(val);
                    }}
                    className="range-input max-range"
                  />
                  <div className="slider-track"></div>
                  <div
                    className="slider-progress"
                    style={{
                      left: `${(minPrice / 1000000) * 100}%`,
                      right: `${100 - (maxPrice / 1000000) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="price-labels">
                  <span>₹0</span>
                  <span>₹10L+</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="collection-main">
          <div className="collection-controls">
            <button className="toggle-filter-btn" onClick={() => setShowFilter(!showFilter)}>
              {showFilter ? "✕ Hide Filters" : "☰ Show Filters"}
            </button>
            <div className="collection-spacer"></div>
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

          <div className="collection-count">
            {loading ? "Loading…" : `${totalResults} item${totalResults !== 1 ? "s" : ""} found`}
          </div>

          {loading ? (
            <Skeleton type="product-card" count={8} />
          ) : filtered.length === 0 ? (
            <div className="collection-empty">
              <span>💎</span>
              <p>No products found with these filters.</p>
              <button className="btn-primary" onClick={resetFilters}>Clear All Filters</button>
            </div>
          ) : (
            <div className="collection-grid">
              {filtered.map((p) => (
                <div className="col-card" key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                  <div className="col-card-img-wrap">
                    <img src={p.image_url} alt={p.name} />
                  </div>
                  <div className="col-card-info">
                    {p.category && <span className="col-card-badge">{p.category}</span>}
                    <h4>{p.name}</h4>
                    <p className="col-card-price">₹{Number(p.price).toLocaleString("en-IN")}</p>
                    <div className="product-mini-specs">
                      {p.shape && <span>{p.shape}</span>}
                      {p.carats && <span>{p.carats}ct</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="collection-pagination">
              <button
                className="page-nav-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Only show first, last, and pages around current
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        className={`page-num ${page === p ? "active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  }
                  // Show ellipsis
                  if (p === 2 || p === totalPages - 1) {
                    return <span key={p} className="page-dots">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="page-nav-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
