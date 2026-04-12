const pool = require("../config/db");

exports.getEnquiries = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT * FROM "Enquiries" ORDER BY id DESC
      `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEnquiry = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await pool.query(`
        INSERT INTO "Enquiries" (name, email, phone, message)
        VALUES ($1, $2, $3, $4)
      `, [name, email, phone, message]);

    res.json({ message: "Enquiry Sent Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};