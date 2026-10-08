import { connect, pool } from '../database';
import fs from 'fs';
import path from 'path';

// Function to execute SQL file
async function executeSQLFile(filePath: string) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await connect(); // Ensure database connection is established
    // We should execute the SQL content directly to the database
    console.log(`Executing SQL from ${filePath}`);
    await pool.query(sql);
    return sql;
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
}

// Main initialization function
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Ensure database connection
    await connect();
    console.log('Database connection established');
    
    // Execute migrations
    const migrationPath = path.join(__dirname, 'migrations', '001_initial.sql');
    console.log('Executing migration...');
    await executeSQLFile(migrationPath);
    
    // Execute seeds
    const seedMapsPath = path.join(__dirname, 'seed', '001_maps.sql');
    console.log('Executing maps seed...');
    await executeSQLFile(seedMapsPath);
    
    // Execute lineup seed
    const seedLineupsPath = path.join(__dirname, 'seed', '002_lineups.sql');
    console.log('Executing lineups seed...');
    await executeSQLFile(seedLineupsPath);
    
    console.log('Database initialization completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error };
  }
}

// Only run if executed directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };