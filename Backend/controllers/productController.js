const { poolPromise } = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;

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

    const request = pool.request();
    const dataRequest = pool.request();

    const addFilter = (name, value, operator = "=") => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        countQuery += ` AND ${name} ${operator} @${name}`;
        dataQuery += ` AND ${name} ${operator} @${name}`;
        request.input(name, value);
        dataRequest.input(name, value);
      }
    };

    addFilter("category", category);
    addFilter("carats", carats);
    addFilter("color", color);
    addFilter("clarity", clarity);
    addFilter("shape", shape);
    addFilter("weight", weight);

    if (search) {
      const searchFilter = ` AND (
        LOWER(ISNULL(name, '')) LIKE LOWER(@search) OR 
        LOWER(ISNULL(category, '')) LIKE LOWER(@search) OR 
        ISNULL(CAST(carats AS NVARCHAR(50)), '') LIKE @search OR 
        LOWER(ISNULL(color, '')) LIKE LOWER(@search) OR 
        LOWER(ISNULL(shape, '')) LIKE LOWER(@search) OR 
        LOWER(ISNULL(clarity, '')) LIKE LOWER(@search) OR 
        LOWER(ISNULL(weight, '')) LIKE LOWER(@search)
      )`;
      countQuery += searchFilter;
      dataQuery += searchFilter;
      request.input("search", `%${search}%`);
      dataRequest.input("search", `%${search}%`);
      console.log("Search term active:", search);
    }

    if (!isNaN(minPrice)) {
      countQuery += " AND price >= @minPrice";
      dataQuery += " AND price >= @minPrice";
      request.input("minPrice", minPrice);
      dataRequest.input("minPrice", minPrice);
    }
    if (!isNaN(maxPrice)) {
      countQuery += " AND price <= @maxPrice";
      dataQuery += " AND price <= @maxPrice";
      request.input("maxPrice", maxPrice);
      dataRequest.input("maxPrice", maxPrice);
    }

    dataQuery += ` ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

    // 🔹 Execute Queries
    const totalResult = await request.query(countQuery);
    const total = totalResult.recordset[0].total;
    
    const result = await dataRequest.query(dataQuery);

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

exports.getActiveCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT DISTINCT category FROM Products WHERE category IS NOT NULL AND category != ''`);
    
    // Extract the categories from the recordset
    const categories = result.recordset.map(row => row.category);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};