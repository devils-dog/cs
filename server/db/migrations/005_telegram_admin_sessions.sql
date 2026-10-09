CREATE TABLE IF NOT EXISTS telegram_admin_sessions (
  user_id BIGINT PRIMARY KEY,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telegram_admin_sessions_updated_at
  ON telegram_admin_sessions(updated_at);
