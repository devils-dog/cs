import { connect, pool } from '../database';
import fs from 'fs';
import path from 'path';

// Function to execute SQL file
async function executeSQLFile(filePath: string) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    // We should execute the SQL content directly to the database
    console.log(`Executing SQL from ${filePath}`);
    await pool.query(sql);
    return sql;
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
}

// Check if schema_migrations table exists
async function checkSchemaMigrationsTable() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM 
          information_schema.tables 
        WHERE 
          table_schema = 'public' 
          AND table_name = 'schema_migrations'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking schema_migrations table:', error);
    throw error;
  }
}

// Create schema_migrations table if it doesn't exist
async function createSchemaMigrationsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('schema_migrations table created or already exists');
  } catch (error) {
    console.error('Error creating schema_migrations table:', error);
    throw error;
  }
}

// Check if migration has been applied
async function isMigrationApplied(version: string) {
  try {
    const result = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)',
      [version]
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if migration ${version} was applied:`, error);
    throw error;
  }
}

// Mark migration as applied
async function markMigrationApplied(version: string) {
  try {
    await pool.query(
      'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
      [version]
    );
    console.log(`Migration ${version} marked as applied`);
  } catch (error) {
    console.error(`Error marking migration ${version} as applied:`, error);
    throw error;
  }
}

// Execute migration with transaction
async function executeMigrationWithTransaction(filePath: string, version: string) {
  try {
    console.log(`Executing migration ${version} from ${filePath}`);
    
    // Check if migration was already applied
    if (await isMigrationApplied(version)) {
      console.log(`Migration ${version} already applied, skipping`);
      return true;
    }
    
    // Start a new transaction for the migration using a dedicated client
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
      
      // Mark migration as applied
      await markMigrationApplied(version);
      
      await client.query('COMMIT');
      console.log(`Migration ${version} completed successfully`);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Error executing migration ${version}:`, error);
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
    
    // Check if schema_migrations table exists and create if not
    const schemaMigrationsExists = await checkSchemaMigrationsTable();
    if (!schemaMigrationsExists) {
      console.log('schema_migrations table does not exist, creating it...');
      await createSchemaMigrationsTable();
    }
    
    // Execute migrations (properly scoped to dist directory when deployed)
    const migrationPath = path.join(__dirname, '..', '..', 'dist', 'db', 'migrations', '001_initial.sql');
    await executeMigrationWithTransaction(migrationPath, '001_initial');
    
    // Execute seeds with idempotent inserts (avoiding conflicts)
    const seedMapsPath = path.join(__dirname, '..', '..', 'dist', 'db', 'seeds', '001_maps.sql');
    console.log('Executing maps seed...');
    try {
      await executeSQLFile(seedMapsPath);
    } catch (error) {
      console.error('Error executing maps seed:', error);
      throw error;
    }
    
    const seedLineupsPath = path.join(__dirname, '..', '..', 'dist', 'db', 'seeds', '002_lineups.sql');
    console.log('Executing lineups seed...');
    try {
      await executeSQLFile(seedLineupsPath);
    } catch (error) {
      console.error('Error executing lineups seed:', error);
      throw error;
    }
    
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