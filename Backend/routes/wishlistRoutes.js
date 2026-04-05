const express = require('express')
const router = express.Router()
const { addToWishlist, getWishlist, removeWishlist } = require('../controllers/wishlistController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, addToWishlist);
router.get('/', authMiddleware, getWishlist);
router.delete('/remove', authMiddleware, removeWishlist);

module.exports = router;