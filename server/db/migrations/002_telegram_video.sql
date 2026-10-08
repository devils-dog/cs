ALTER TABLE lineups
  ALTER COLUMN telegram_message_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS telegram_file_id TEXT,
  ADD COLUMN IF NOT EXISTS telegram_mime_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS telegram_file_size BIGINT;

CREATE INDEX IF NOT EXISTS idx_lineups_telegram_message_id
  ON lineups(telegram_message_id);

CREATE INDEX IF NOT EXISTS idx_lineups_telegram_file_id
  ON lineups(telegram_file_id);
