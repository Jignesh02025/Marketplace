import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (name) => {
    setOpenSection(openSection === name ? null : name);
  };

  const isSectionOpen = (name) => openSection === name;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <h2 className="footer-logo">💎 Marketplace</h2>
          <p className="footer-tagline">Exquisite jewellery crafted with passion and precision. We bring you the finest diamonds and gold pieces for every occasion.</p>
          <div className="social-links">
            <span className="social-icon">IG</span>
            <span className="social-icon">FB</span>
            <span className="social-icon">TW</span>
          </div>
        </div>

        <div className={`footer-section ${isSectionOpen("explore") ? "active" : ""}`}>
          <h4 onClick={() => toggleSection("explore")}>
            Explore
            <span className="footer-toggle">{isSectionOpen("explore") ? "−" : "+"}</span>
          </h4>
          <ul className="footer-list">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/collection")}>Collection</li>
            <li onClick={() => navigate("/contact")}>Contact Us</li>
            <li onClick={() => navigate("/wishlist")}>My Wishlist</li>
          </ul>
        </div>

        <div className={`footer-section ${isSectionOpen("shop") ? "active" : ""}`}>
          <h4 onClick={() => toggleSection("shop")}>
            Shop By
            <span className="footer-toggle">{isSectionOpen("shop") ? "−" : "+"}</span>
          </h4>
          <ul className="footer-list">
            <li onClick={() => navigate("/collection?category=Rings")}>Rings</li>
            <li onClick={() => navigate("/collection?category=Necklaces")}>Necklaces</li>
            <li onClick={() => navigate("/collection?category=Earrings")}>Earrings</li>
            <li onClick={() => navigate("/collection?category=Bracelets")}>Bracelets</li>
          </ul>
        </div>

        <div className={`footer-section ${isSectionOpen("contact") ? "active" : ""}`}>
          <h4 onClick={() => toggleSection("contact")}>
            Contact Us
            <span className="footer-toggle">{isSectionOpen("contact") ? "−" : "+"}</span>
          </h4>
          <div className="footer-list footer-contact-info">
            <p>📧 support@marketplace.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 123 Luxury Lane, Jewellery Plaza, Mumbai</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Jewelry Marketplace. All rights reserved.</p>
        <div className="footer-legal">
          <span>Privacy Policy</span> | <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}