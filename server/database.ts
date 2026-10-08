import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cs2_nades',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params: any[] = []) => pool.query(text, params);

export const connect = async (): Promise<void> => {
  await pool.query('SELECT 1');
  console.log('Connected to PostgreSQL database successfully');
};

export const close = async () => {
  await pool.end();
};

export { pool };
