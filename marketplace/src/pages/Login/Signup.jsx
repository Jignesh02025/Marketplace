import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-hot-toast";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      toast.success("Account created successfully ✅");
      navigate("/Login");
    } catch (err) {
      toast.error("Signup failed ❌ — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💎 Create Account</h2>
        <p className="auth-subtitle">Join thousands of happy shoppers</p>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/Login")}>Login</span>
        </p>
      </div>
    </div>
  );
}