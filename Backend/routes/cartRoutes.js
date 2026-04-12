const express = require("express")
const router = express.Router();
const { addToCart, getCart, deleteCart, removeItem } = require("../controllers/cartController");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, getCart);
router.post('/add',authMiddleware,addToCart);
router.delete("/delete", authMiddleware, deleteCart);
router.post('/remove', authMiddleware, removeItem)

module.exports = router;