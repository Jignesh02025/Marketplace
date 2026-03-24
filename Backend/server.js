const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 🔹 Import DB connection (IMPORTANT)
require("./config/db");

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

// 🔹 Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);

// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Marketplace API Running...");
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});