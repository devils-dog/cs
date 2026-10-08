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

async function createTables() {
  try {
    const query = `
      -- Create maps table
      CREATE TABLE IF NOT EXISTS maps (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create lineups table
      CREATE TABLE IF NOT EXISTS lineups (
          id SERIAL PRIMARY KEY,
          map_id INTEGER NOT NULL,
          side VARCHAR(50) NOT NULL,
          grenade_type VARCHAR(50) NOT NULL,
          target VARCHAR(50),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          telegram_message_id VARCHAR(255),
          thumbnail_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          -- Foreign key constraint
          FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_lineups_map_id ON lineups(map_id);
      CREATE INDEX IF NOT EXISTS idx_lineups_side ON lineups(side);
      CREATE INDEX IF NOT EXISTS idx_lineups_grenade_type ON lineups(grenade_type);
      CREATE INDEX IF NOT EXISTS idx_lineups_target ON lineups(target);
      CREATE INDEX IF NOT EXISTS idx_lineups_created_at ON lineups(created_at);
    `;

    await pool.query(query);
    console.log('Tables created successfully');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error creating tables:', error);
    // Close the pool in case of error
    await pool.end();
    process.exit(1);
  }
}

// Run the migration
createTables();