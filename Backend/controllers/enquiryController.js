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

// exports.createEnquiry = async (req, res) => {
//   const { product_id, message } = req.body;

//   try {
//     const pool = await poolPromise;

//     const user_id = req.user.id;
//     await pool.request()
//       .input("user_id", user_id)
//       .input("Product_id", product_id)
//       .input("message", message)
//       .query(
//         INSERT INTO Enquiries(user_id, product_id, message) VALUES(user_id, product_id, message)
//       );

//     res.json("Enquiry Sended")
//   } catch (error) {
//     res.status(500).json(err)
//   }
// }