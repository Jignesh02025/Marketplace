const { poolPromise } = require("../config/db");

exports.getEnquiries = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT e.id, u.name, p.name AS product_name, e.message
        FROM Enquiries e
        JOIN Users u ON e.user_id = u.id
        JOIN Products p ON e.product_id = p.id
      `);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};