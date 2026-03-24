const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

// 🔒 ALL protected routes
router.get("/", auth, controller.getAllProducts);
router.get("/:id", auth, controller.getSingleProduct);
router.post("/", auth, controller.insertProduct);
router.put("/:id", auth, controller.updateProduct);
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;