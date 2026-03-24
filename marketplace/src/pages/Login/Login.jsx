import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");
      navigate("/products");
    } catch (err) {
      alert("Login Failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="auth-container">   {/* ✅ changed */}
      <div className="auth-card">     {/* ✅ changed */}
        <h2>Marketplace Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        />

        <button onClick={handleLogin}>Login</button>

        <p onClick={() => navigate("/signup")}>
          Don’t have account? Signup
        </p>
      </div>
    </div>
  );
}