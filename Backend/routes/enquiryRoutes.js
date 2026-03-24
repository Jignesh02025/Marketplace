const express = require("express");
const router = express.Router();
const { getEnquiries } = require("../controllers/enquiryController");

router.get("/", getEnquiries);

module.exports = router;