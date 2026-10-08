import { pool } from '../database';
import fs from 'fs';
import path from 'path';

const readSQLFile = (filePath: string) => {
  console.log(`Reading SQL from ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
};

const executeSQLFile = async (filePath: string) => {
  await pool.query(readSQLFile(filePath));
};

const createSchemaMigrationsTable = async (client: import('pg').PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      version VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const executeMigrationWithTransaction = async (filePath: string, version: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await createSchemaMigrationsTable(client);

    const applied = await client.query(
      'SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)',
      [version]
    );

    if (applied.rows[0].exists) {
      await client.query('COMMIT');
      console.log(`Migration ${version} already applied, skipping`);
      return;
    }

    await client.query(readSQLFile(filePath));
    await client.query(
      'INSERT INTO schema_migrations (version) VALUES ($1)',
      [version]
    );
    await client.query('COMMIT');
    console.log(`Migration ${version} completed successfully`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '001_initial.sql');
    const seedMapsPath = path.join(__dirname, '..', 'db', 'seeds', '001_maps.sql');
    const seedLineupsPath = path.join(__dirname, '..', 'db', 'seeds', '002_lineups.sql');

    await executeMigrationWithTransaction(migrationPath, '001_initial');
    await executeSQLFile(seedMapsPath);
    await executeSQLFile(seedLineupsPath);

    console.log('Database initialization completed successfully');
    return { success: true as const };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false as const, error };
  }
};

if (require.main === module) {
  void initializeDatabase();
}

export { initializeDatabase };
