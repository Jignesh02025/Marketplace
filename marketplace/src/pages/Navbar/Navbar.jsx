import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>💎 Marketplace</h2>

      <div>
        <button onClick={() => navigate("/products")}>Products</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}