import mysql from 'mysql2/promise';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ewaste_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Return rows as plain objects (not arrays)
  rowsAsArray: false,
});

// Generate a UUID v4
export const generateId = () => {
  return crypto.randomUUID();
};

// Format query: replace $1, $2, etc. with ? for MySQL
const formatQuery = (text) => {
  return text.replace(/\$\d+/g, '?');
};

// Wrapper that provides a PostgreSQL-like interface (rows, rowCount)
const db = {
  query: async (text, params = []) => {
    const formattedText = formatQuery(text);
    const [result] = await pool.query(formattedText, params);

    // SELECT queries return an array of rows
    if (Array.isArray(result)) {
      return { rows: result, rowCount: result.length };
    }

    // INSERT/UPDATE/DELETE queries return a ResultSetHeader
    return {
      rows: [],
      rowCount: result.affectedRows,
      insertId: result.insertId,
    };
  },
  connect: async () => {
    const connection = await pool.getConnection();
    return {
      query: async (text, params = []) => {
        const formattedText = formatQuery(text);
        const [result] = await connection.query(formattedText, params);

        if (Array.isArray(result)) {
          return { rows: result, rowCount: result.length };
        }

        return {
          rows: [],
          rowCount: result.affectedRows,
          insertId: result.insertId,
        };
      },
      release: () => connection.release(),
    };
  },
  end: async () => {
    await pool.end();
  },
};

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL database connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
  });

export default db;
