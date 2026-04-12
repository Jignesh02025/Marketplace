import React, { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";
import "./EnquiryModal.css";

const EnquiryModal = ({ product, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I am interested in ${product?.name}. Please provide more details.`,
  });

  const handleChange = (e) => {
    console.log("this is e: ", e)
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        product_id: product?.id,
      };

      await API.post("/enquiries", payload);

      toast.success("Thank you! Your enquiry has been sent.", {
        icon: '💎',
        style: {
          borderRadius: '10px',
          background: '#1a1a2e',
          color: '#d4af37',
        },
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        message: `I am interested in ${product?.name}. Please provide more details.`,
      });
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      toast.error("Failed to send enquiry. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enquiry-modal-overlay">
      <div className="enquiry-modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="enquiry-modal-header">
          <h2>Product Enquiry</h2>
          <p>
            Have questions about <strong>{product.name}</strong>? Let us help!
          </p>
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="enquiry-submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;