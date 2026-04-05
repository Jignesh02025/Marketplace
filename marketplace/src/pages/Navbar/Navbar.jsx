import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

const CATEGORY_MAP = {
  Rings: "💍 Rings",
  Earrings: "👂 Earrings",
  Necklaces: "📿 Necklaces",
  Bracelets: "💛 Bracelets",
  Bangles: "🔔 Bangles",
  Pendants: "✨ Pendants",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/products/categories");
        const active = (res.data || []).map(cat => ({
          label: CATEGORY_MAP[cat] || `💎 ${cat}`,
          category: cat,
        }));
        setCategories(active);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time search fetching
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await API.get("/products", {
            params: {
              search: searchTerm,
              limit: 5
            }
          });
          console.log("Search results:", res.data);
          setSearchResults(res.data.data || []);
          setShowResults(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/collection?search=${searchTerm}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get("category");

  const isAuthenticated = !!localStorage.getItem("token");

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleAuth = () => {
    if (isAuthenticated) {
      localStorage.removeItem("token");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <h2 className="navbar-logo" onClick={() => navigate("/")}>
        💎 Marketplace
      </h2>

      {/* Hamburger Menu Icon */}
      <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? "✕" : "☰"}
      </div>

      {/* Center Nav */}
      <nav className={`navbar-center-container ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="navbar-center">
          <a
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => { navigate("/"); setIsMobileMenuOpen(false); }}
          >
            Home
          </a>

          <div className="nav-dropdown">
            <a
              className={`nav-link ${location.pathname.startsWith("/collection") ? "active" : ""}`}
              onClick={() => { navigate("/collection"); setIsMobileMenuOpen(false); }}
            >
              Collection <span className="dropdown-arrow">▾</span>
            </a>
            <div className="dropdown-menu">
              {categories.map((item) => (
                <div
                  key={item.category}
                  className={`dropdown-item ${activeCategory === item.category ? "active" : ""}`}
                  onClick={() => { navigate(`/collection?category=${item.category}`); setIsMobileMenuOpen(false); }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <a
            className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}
            onClick={() => { navigate("/contact"); setIsMobileMenuOpen(false); }}
          >
            Contact
          </a>



          <a
            className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={() => { navigate("/about"); setIsMobileMenuOpen(false); }}
          >
            About
          </a>

          {/* Mobile-only Wishlist and Cart in Drawer */}
          <a
            className={`nav-link mobile-only-link ${location.pathname === "/wishlist" ? "active" : ""}`}
            onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }}
          >
            ❤ Wishlist {wishlistCount > 0 && <span className="drawer-badge">{wishlistCount}</span>}
          </a>
          <a
            className={`nav-link mobile-only-link ${location.pathname === "/cart" ? "active" : ""}`}
            onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}
          >
            🛒 Cart {cartCount > 0 && <span className="drawer-badge">{cartCount}</span>}
          </a>
        </div>
      </nav>

      {/* Right side options: Search, Wishlist, Cart & Auth */}
      <div className="navbar-right">
        {/* Global Search Bar (moved here for side-bar feel) */}
        <div className="nav-search-wrapper" ref={searchRef}>
          <div className="nav-search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              onFocus={() => searchTerm.trim().length > 1 && setShowResults(true)}
            />
            <span className="search-icon-btn">🔍</span>
          </div>
          {showResults && (
            <div className="search-results-dropdown">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(p.id)}
                    >
                      <img src={p.image_url} alt={p.name} className="search-res-img" />
                      <div className="search-res-info">
                        <span className="search-res-name">{p.name}</span>
                        <span className="search-res-price">₹{Number(p.price).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                  <div
                    className="view-all-results"
                    onClick={() => {
                      navigate(`/collection?search=${searchTerm}`);
                      setShowResults(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    View all results for "{searchTerm}"
                  </div>
                </>
              ) : (
                <div className="no-results-found">No products found for "{searchTerm}"</div>
              )}
            </div>
          )}
        </div>

        <div className="wishlist-icon" onClick={() => navigate("/wishlist")}>
          ❤
          {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
        </div>
        <div className="cart-icon" onClick={() => navigate("/cart")}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <button className="navbar-logout" onClick={handleAuth}>
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
}