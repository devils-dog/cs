import { Pool } from 'pg';

// Create a new pool with connection settings
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cs2_nades',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params: any[]) => {
  return pool.query(text, params);
};

export const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const close = async () => {
  await pool.end();
};

export { pool };