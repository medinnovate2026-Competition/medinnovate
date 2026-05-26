const mysql = require("mysql2/promise");

const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST;
const dbPort = process.env.DB_PORT || process.env.MYSQL_PORT;
const dbUser = process.env.DB_USER || process.env.MYSQL_USER;
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE;

console.log("MySQL config:", {
  hostExists: Boolean(dbHost),
  userExists: Boolean(dbUser),
  databaseExists: Boolean(dbName),
  port: dbPort || "default",
  ssl: process.env.MYSQL_SSL === "true" || process.env.DB_SSL === "true",
});

const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.MYSQL_SSL === "true" || process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("MySQL connection success");
  })
  .catch((error) => {
    console.error("MySQL connection failure:", error.message);
  });

module.exports = pool;
