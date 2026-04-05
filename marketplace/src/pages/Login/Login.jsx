import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Welcome back! ✅");
      navigate("/");
    } catch (err) {
      alert("Login failed ❌ — check your credentials.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💎 Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Marketplace account</p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          autoComplete="current-password"
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}