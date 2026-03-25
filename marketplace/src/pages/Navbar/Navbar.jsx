import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const COLLECTION_ITEMS = [
  { label: "💍 Rings", category: "Rings" },
  { label: "👂 Earrings", category: "Earrings" },
  { label: "📿 Necklaces", category: "Necklaces" },
  { label: "💛 Bracelets", category: "Bracelets" },
  { label: "🔔 Bangles", category: "Bangles" },
  { label: "✨ Pendants", category: "Pendants" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Re-render on route change

  const isAuthenticated = !!localStorage.getItem("token");

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

      {/* Center Nav */}
      <nav className="navbar-center">
        <a className="nav-link" onClick={() => navigate("/")}>Home</a>

        <div className="nav-dropdown">
          <a className="nav-link" onClick={() => navigate("/collection")}>
            Collection <span className="dropdown-arrow">▾</span>
          </a>
          <div className="dropdown-menu">
            {COLLECTION_ITEMS.map((item) => (
              <div
                key={item.category}
                className="dropdown-item"
                onClick={() => navigate(`/collection?category=${item.category}`)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <a className="nav-link" onClick={() => navigate("/contact")}>Contact</a>
      </nav>

      {/* Right: Auth Button */}
      <button className="navbar-logout" onClick={handleAuth}>
        {isAuthenticated ? "Logout" : "Login"}
      </button>
    </div>
  );
}