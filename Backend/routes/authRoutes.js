const express = require("express");
const router = express.Router();
const { signup, login, getUsers, deleteUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/", authMiddleware, getUsers);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;