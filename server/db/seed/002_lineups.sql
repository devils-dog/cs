-- Seed data for lineups
INSERT INTO lineups (id, map_id, side, grenade_type, target, title, description, telegram_message_id, thumbnail_url) VALUES
-- Mirage lineups
('mirage-smoke-1', 'mirage', 'T', 'smoke', 'long', 'T-Smoke Long', 'T side smoke for long area on Mirage', 1001, NULL),
('mirage-flash-1', 'mirage', 'T', 'flash', 'long', 'T-Flash Long', 'T side flash for long area on Mirage', 1002, NULL),
('mirage-molotov-1', 'mirage', 'CT', 'molotov', 'short', 'CT-Molotov Short', 'CT side molotov for short area on Mirage', 1003, NULL),
('mirage-he-1', 'mirage', 'CT', 'he', 'long', 'CT-HE Long', 'CT side HE for long area on Mirage', 1004, NULL),

-- Inferno lineups
('inferno-smoke-1', 'inferno', 'T', 'smoke', 'long', 'T-Smoke Long', 'T side smoke for long area on Inferno', 1005, NULL),
('inferno-flash-1', 'inferno', 'T', 'flash', 'short', 'T-Flash Short', 'T side flash for short area on Inferno', 1006, NULL),
('inferno-molotov-1', 'inferno', 'CT', 'molotov', 'long', 'CT-Molotov Long', 'CT side molotov for long area on Inferno', 1007, NULL),
('inferno-he-1', 'inferno', 'CT', 'he', 'short', 'CT-HE Short', 'CT side HE for short area on Inferno', 1008, NULL),

-- Ancient lineups
('ancient-smoke-1', 'ancient', 'T', 'smoke', 'long', 'T-Smoke Long', 'T side smoke for long area on Ancient', 1009, NULL),
('ancient-flash-1', 'ancient', 'T', 'flash', 'short', 'T-Flash Short', 'T side flash for short area on Ancient', 1010, NULL),
('ancient-molotov-1', 'ancient', 'CT', 'molotov', 'long', 'CT-Molotov Long', 'CT side molotov for long area on Ancient', 1011, NULL),
('ancient-he-1', 'ancient', 'CT', 'he', 'short', 'CT-HE Short', 'CT side HE for short area on Ancient', 1012, NULL);