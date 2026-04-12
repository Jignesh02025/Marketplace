const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(`
        INSERT INTO "Users" (name, email, password)
        VALUES ($1, $2, $3)
      `, [name, email, hashedPassword]);

    res.json({ message: "User Registered Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM "Users" WHERE email=$1`, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, "SECRET_KEY");

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, email, created_at FROM "Users" ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete related records first to avoid foreign key errors
    await pool.query(`DELETE FROM "Cart" WHERE user_id = $1`, [id]);
    await pool.query(`DELETE FROM "Wishlist" WHERE user_id = $1`, [id]);
    await pool.query(`DELETE FROM "Enquiries" WHERE user_id = $1`, [id]);
    await pool.query(`DELETE FROM "Users" WHERE id = $1`, [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};