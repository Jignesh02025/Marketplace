import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Fill in the form below and we'll respond within 24 hours.</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" placeholder="E.g. Priya Sharma" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="Tell us about your enquiry…" required />
          </div>
          <button type="submit" className="contact-submit">Send Message 💌</button>
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
