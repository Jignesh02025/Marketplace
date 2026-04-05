const pool = require('./config/db');

async function migrate() {
  try {
    console.log("Connected to DB...");
    
    // Check if columns exist
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Products' AND column_name IN ('carats', 'color', 'clarity', 'shape')
    `);
    
    const existingColumns = checkColumns.rows.map(r => r.column_name);
    
    if (!existingColumns.includes('carats')) {
      await pool.query('ALTER TABLE "Products" ADD COLUMN carats VARCHAR(50)');
      console.log("Added carats");
    }
    if (!existingColumns.includes('color')) {
      await pool.query('ALTER TABLE "Products" ADD COLUMN color VARCHAR(50)');
      console.log("Added color");
    }
    if (!existingColumns.includes('clarity')) {
      await pool.query('ALTER TABLE "Products" ADD COLUMN clarity VARCHAR(50)');
      console.log("Added clarity");
    }
    if (!existingColumns.includes('shape')) {
      await pool.query('ALTER TABLE "Products" ADD COLUMN shape VARCHAR(50)');
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
