const { Pool } = require('pg');

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL); // ← ADD THIS

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL (Supabase)"))
  .catch(err => console.log("❌ DB Connection Failed:", err));

module.exports = pool;