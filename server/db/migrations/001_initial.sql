-- Create maps table
CREATE TABLE IF NOT EXISTS maps (
  id VARCHAR(255) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lineups table
CREATE TABLE IF NOT EXISTS lineups (
  id VARCHAR(255) PRIMARY KEY,
  map_id VARCHAR(255) NOT NULL,
  side CHAR(2) NOT NULL CHECK (side IN ('T', 'CT')),
  grenade_type VARCHAR(20) NOT NULL CHECK (grenade_type IN ('smoke', 'flash', 'molotov', 'he')),
  target VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  telegram_message_id BIGINT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT fk_lineups_map_id 
    FOREIGN KEY (map_id) REFERENCES maps(id) 
    ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lineups_map_id ON lineups(map_id);
CREATE INDEX IF NOT EXISTS idx_lineups_filters ON lineups(map_id, side, grenade_type);