import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/axios";
import "./Contact.css";

export default function Contact() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If user came from a specific product enquiry
    const queryParams = new URLSearchParams(location.search);
    const productName = queryParams.get("product");
    if (productName) {
      setFormData(prev => ({
        ...prev,
        message: `I am interested in: ${productName}. Please provide more details.`
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await API.post("/enquiries", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Enquiry failed", err);
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-hero">
          <h1>Message Sent! 💌</h1>
          <p>Thank you for reaching out. Our team will get back to you shortly.</p>
          <button className="contact-submit" onClick={() => setSubmitted(false)} style={{ marginTop: "20px" }}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Fill in the form below and we'll respond within 24 hours.</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Your Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="E.g. Priya Sharma" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="you@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="+91 98765 43210" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea 
              name="message"
              rows="5" 
              placeholder="Tell us about your enquiry…" 
              value={formData.message}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="contact-submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message 💌"}
          </button>
        </form>

        <div className="contact-info">
          <div className="info-card">
            <span>📍</span>
            <div>
              <h4>Our Store</h4>
              <p>123 Jewellery Lane, Mumbai, Maharashtra 400001</p>
            </div>
          </div>
          <div className="info-card">
            <span>📞</span>
            <div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="info-card">
            <span>📧</span>
            <div>
              <h4>Email</h4>
              <p>support@marketplace.in</p>
            </div>
          </div>
          <div className="info-card">
            <span>🕐</span>
            <div>
              <h4>Business Hours</h4>
              <p>Mon – Sat: 10 AM – 7 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
