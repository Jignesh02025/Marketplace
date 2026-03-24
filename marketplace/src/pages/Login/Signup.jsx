import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", form);
      alert("Signup Successful ✅");
      navigate("/Products");
    } catch (err) {
      alert("Signup Failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button onClick={handleSignup}>Signup</button>

        <p onClick={() => navigate("/Login")}>
          Already have account? Login
        </p>
      </div>
    </div>
  );
}