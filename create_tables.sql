-- Create maps table
CREATE TABLE IF NOT EXISTS maps (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
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