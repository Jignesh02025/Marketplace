const sql = require("mssql");

const config = {
  user: "student_user",
  password: "123456",
  server: "localhost",
  database: "Marketplace",
  port: 1433,
  options: {
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => console.log("❌ DB Connection Failed:", err));

module.exports = {
  sql,
  poolPromise,
};
