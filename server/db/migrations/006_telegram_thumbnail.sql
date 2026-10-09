ALTER TABLE lineups
  ADD COLUMN IF NOT EXISTS telegram_thumbnail_file_id TEXT,
  ADD COLUMN IF NOT EXISTS telegram_thumbnail_mime_type VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_lineups_telegram_thumbnail_file_id
  ON lineups(telegram_thumbnail_file_id);
