const pool = require('./config/db');

async function migrate() {
  try {
    console.log("Connected to DB...");

    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Products'
    `);

    const existingColumns = checkColumns.rows.map(r => r.column_name.toLowerCase());

    const columnsToAdd = [
      { name: 'carats', type: 'VARCHAR(100)' },
      { name: 'color', type: 'VARCHAR(100)' },
      { name: 'clarity', type: 'VARCHAR(100)' },
      { name: 'shape', type: 'VARCHAR(100)' },
      { name: 'weight', type: 'VARCHAR(100)' },
      { name: 'description', type: 'TEXT' },
      { name: 'stock', type: 'INTEGER DEFAULT 0' },
      { name: 'image_url', type: 'TEXT' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'price', type: 'NUMERIC(10, 2)' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name.toLowerCase())) {
        console.log(`Adding missing column: ${col.name}`);
        await pool.query(`ALTER TABLE "Products" ADD COLUMN ${col.name} ${col.type}`);
      }
    }

    // 🔄 Sync the ID sequence (Fixes "duplicate key value violates unique constraint Products_pkey")
    console.log("Synchronizing ID sequence...");
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('"Products"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Products"), 1)
      );
    `);

    console.log("✅ Migration successful");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
