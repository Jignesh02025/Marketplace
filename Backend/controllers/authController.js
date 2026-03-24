const { poolPromise } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input("name", name)
      .input("email", email)
      .input("password", hashedPassword)
      .query(`
        INSERT INTO Users (name, email, password)
        VALUES (@name, @email, @password)
      `);

    res.json({ message: "User Registered Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", email)
      .query(`SELECT * FROM Users WHERE email=@email`);

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.recordset[0];

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