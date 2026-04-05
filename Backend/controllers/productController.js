const pool = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    // 🔹 Query Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const category = req.query.category;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const carats = req.query.carats;
    const color = req.query.color;
    const clarity = req.query.clarity;
    const shape = req.query.shape;
    const weight = req.query.weight;
    const search = req.query.search;

    const offset = (page - 1) * limit;

    // 🔹 Base Queries
    let countQuery = "SELECT COUNT(*) AS total FROM Products WHERE 1=1";
    let dataQuery = "SELECT * FROM Products WHERE 1=1";
    console.log("Req params:", req.query);

    const queryParams = [];
    let paramIndex = 1;

    const addFilter = (name, value, operator = "=") => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        countQuery += ` AND ${name} ${operator} $${paramIndex}`;
        dataQuery += ` AND ${name} ${operator} $${paramIndex}`;
        queryParams.push(value);
        paramIndex++;
      }
    };

    addFilter("category", category);
    addFilter("carats", carats);
    addFilter("color", color);
    addFilter("clarity", clarity);
    addFilter("shape", shape);
    addFilter("weight", weight);

    if (search) {
      const searchPattern = `%${search}%`;
      const searchFilter = ` AND (
        LOWER(COALESCE(name, '')) LIKE LOWER($${paramIndex}) OR 
        LOWER(COALESCE(category, '')) LIKE LOWER($${paramIndex}) OR 
        COALESCE(CAST(carats AS TEXT), '') LIKE $${paramIndex} OR 
        LOWER(COALESCE(color, '')) LIKE LOWER($${paramIndex}) OR 
        LOWER(COALESCE(shape, '')) LIKE LOWER($${paramIndex}) OR 
        LOWER(COALESCE(clarity, '')) LIKE LOWER($${paramIndex}) OR 
        LOWER(COALESCE(weight, '')) LIKE LOWER($${paramIndex})
      )`;
      countQuery += searchFilter;
      dataQuery += searchFilter;
      queryParams.push(searchPattern);
      paramIndex++;
      console.log("Search term active:", search);
    }

    if (!isNaN(minPrice)) {
      countQuery += ` AND price >= $${paramIndex}`;
      dataQuery += ` AND price >= $${paramIndex}`;
      queryParams.push(minPrice);
      paramIndex++;
    }
    if (!isNaN(maxPrice)) {
      countQuery += ` AND price <= $${paramIndex}`;
      dataQuery += ` AND price <= $${paramIndex}`;
      queryParams.push(maxPrice);
      paramIndex++;
    }

    // 🔹 For dataQuery, we need to add ORDER BY, LIMIT and OFFSET
    dataQuery += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const finalQueryParams = [...queryParams, limit, offset];

    // 🔹 Execute Queries
    const totalResult = await pool.query(countQuery, queryParams);
    const total = parseInt(totalResult.rows[0].total);
    
    const result = await pool.query(dataQuery, finalQueryParams);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows
    });

  } catch (err) {
    console.error("Error in getAllProducts:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(`SELECT * FROM Products WHERE id=$1`, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insertProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    await pool.query(`
        INSERT INTO Products (name, price)
        VALUES ($1, $2)
      `, [name, price]);

    res.json({ message: "Product Added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;

  try {
    await pool.query(`
        UPDATE Products
        SET name=$1, price=$2
        WHERE id=$3
      `, [name, price, id]);

    res.json({ message: "Product Updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(`DELETE FROM Products WHERE id=$1`, [id]);
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveCategories = async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT category FROM Products WHERE category IS NOT NULL AND category != ''`);
    
    // Extract the categories from the rows
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};