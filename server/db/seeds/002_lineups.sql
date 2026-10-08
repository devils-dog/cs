-- Seed data for local/development environments.
-- Telegram media is intentionally unassigned until videos are published to the channel.
INSERT INTO lineups (id, map_id, side, grenade_type, target, title, description, telegram_message_id, thumbnail_url) VALUES 
('lineup_1', 'de_dust2', 'T', 'smoke', 'ct_side', 'Dust2 T Smoke', 'T side smoke on Dust2', NULL, 'https://example.com/dust2_t_smoke.jpg'),
('lineup_2', 'de_dust2', 'CT', 'flash', 't_side', 'Dust2 CT Flash', 'CT side flash on Dust2', NULL, 'https://example.com/dust2_ct_flash.jpg'),
('lineup_3', 'de_inferno', 'T', 'molotov', 'ct_side', 'Inferno T Molotov', 'T side molotov on Inferno', NULL, 'https://example.com/inferno_t_molotov.jpg'),
('lineup_4', 'de_inferno', 'CT', 'he', 't_side', 'Inferno CT HE', 'CT side HE on Inferno', NULL, 'https://example.com/inferno_ct_he.jpg')
ON CONFLICT (id) DO NOTHING;