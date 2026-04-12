const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;
