const { poolPromise } = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;

    // 🔹 Query Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24; // default 24
    const offset = (page - 1) * limit;

    // 🔹 Total Count (important for frontend pagination)
    const totalResult = await pool.request()
      .query(`SELECT COUNT(*) AS total FROM Products`);

    const total = totalResult.recordset[0].total;

    // 🔹 Fetch Data
    const result = await pool.request()
      .query(`
        SELECT * FROM Products
        ORDER BY id
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.recordset
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", id)
      .query(`SELECT * FROM Products WHERE id=@id`);

    res.json(result.recordset[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insertProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("name", name)
      .input("price", price)
      .query(`
        INSERT INTO Products (name, price)
        VALUES (@name, @price)
      `);

    res.json({ message: "Product Added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("price", price)
      .query(`
        UPDATE Products
        SET name=@name, price=@price
        WHERE id=@id
      `);

    res.json({ message: "Product Updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", id)
      .query(`DELETE FROM Products WHERE id=@id`);

    res.json({ message: "Product Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};