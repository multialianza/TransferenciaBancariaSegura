// Importamos Pool desde pg
const { Pool } = require("pg");
require("dotenv").config();

// Creamos pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Exportamos pool
module.exports = pool;