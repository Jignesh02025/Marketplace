const { poolPromise } = require('./config/db');

async function migrate() {
  try {
    const pool = await poolPromise;
    console.log("Connected to DB...");
    
    // Check if columns exist
    const checkColumns = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Products' AND COLUMN_NAME IN ('carats', 'color', 'clarity', 'shape')
    `);
    
    const existingColumns = checkColumns.recordset.map(r => r.COLUMN_NAME);
    
    if (!existingColumns.includes('carats')) {
      await pool.request().query("ALTER TABLE Products ADD carats VARCHAR(50)");
      console.log("Added carats");
    }
    if (!existingColumns.includes('color')) {
      await pool.request().query("ALTER TABLE Products ADD color VARCHAR(50)");
      console.log("Added color");
    }
    if (!existingColumns.includes('clarity')) {
      await pool.request().query("ALTER TABLE Products ADD clarity VARCHAR(50)");
      console.log("Added clarity");
    }
    if (!existingColumns.includes('shape')) {
      await pool.request().query("ALTER TABLE Products ADD shape VARCHAR(50)");
      console.log("Added shape");
    }
    
    console.log("✅ Migration successful");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
