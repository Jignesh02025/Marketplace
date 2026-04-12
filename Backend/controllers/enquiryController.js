const pool = require("../config/db");

exports.getEnquiries = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT e.*, p.name AS product_name 
        FROM "Enquiries" e
        LEFT JOIN "Products" p ON e.product_id = p.id
        ORDER BY e.id DESC
      `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEnquiry = async (req, res) => {
  const {product_id, name, email, phone, message } = req.body;
  const user_id = req.user.id;

  try {
    await pool.query(`
      INSERT INTO "Enquiries" (user_id, product_id, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [user_id || null, product_id || null, name, email, phone, message]);

    res.json({ message: "Enquiry Sent Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};