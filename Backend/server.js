const express = require("express");
const cors = require("cors");

require("dotenv").config();

// 🔹 Import DB connection (IMPORTANT)
require("./config/db");

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes = require("./routes/adminRoutes");

// 🔹 Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

// Add this in server.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Marketplace API Running...");
});

app.get("/test", (req, res) => {
  res.send("🚀 Marketplace API test...");
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});