import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

async function updateDb() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ewaste_db',
  });

  try {
    await pool.query(`ALTER TABLE pickup_requests MODIFY COLUMN status ENUM('pending', 'scheduled', 'in-progress', 'collected', 'delivered', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'`);
    console.log('Enum updated successfully.');
  } catch (err) {
    console.error('Error updating enum:', err);
  } finally {
    await pool.end();
  }
}

updateDb();
