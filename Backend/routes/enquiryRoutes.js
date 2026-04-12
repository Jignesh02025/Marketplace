const express = require("express");
const router = express.Router();
const { getEnquiries } = require("../controllers/enquiryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/",authMiddleware, getEnquiries);
router.post("/",authMiddleware, createEnquiry);

module.exports = router;