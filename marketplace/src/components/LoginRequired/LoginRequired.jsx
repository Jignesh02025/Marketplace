import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRequired.css";

const LoginRequired = ({ message = "Please login to view this content" }) => {
  const navigate = useNavigate();

  return (
    <div className="login-required-container">
      <div className="login-required-card">
        <div className="lock-icon">🔒</div>
        <h2>Access Restricted</h2>
        <p>{message}</p>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login Now
        </button>
        <button className="back-btn" onClick={() => navigate("/")}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default LoginRequired;
