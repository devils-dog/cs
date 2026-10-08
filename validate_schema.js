const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool with connection settings
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cs2_nades',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function validateSchema() {
  try {
    console.log('Validating database schema...');
    
    // Check if tables exist
    const tablesQuery = `
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('maps', 'lineups')
      ORDER BY table_name, ordinal_position;
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log('Tables and columns:');
    console.log(tablesResult.rows);
    
    // Check indexes
    const indexesQuery = `
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename IN ('maps', 'lineups')
      ORDER BY tablename, indexname;
    `;
    
    const indexesResult = await pool.query(indexesQuery);
    console.log('\nIndex information:');
    console.log(indexesResult.rows);
    
    // Check foreign key constraints
    const fkQuery = `
      SELECT 
        conname as constraint_name,
        conrelid::regclass as table_name,
        conkey as column_ids,
        confrelid::regclass as referenced_table
      FROM pg_constraint 
      WHERE conrelid IN (SELECT oid FROM pg_class WHERE relname IN ('maps', 'lineups'))
      AND contype = 'f';
    `;
    
    const fkResult = await pool.query(fkQuery);
    console.log('\nForeign key constraints:');
    console.log(fkResult.rows);
    
    console.log('\nSchema validation complete!');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error validating schema:', error);
    // Close the pool in case of error
    await pool.end();
    process.exit(1);
  }
}

// Run the validation
validateSchema();