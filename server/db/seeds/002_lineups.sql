-- Insert default lineups
INSERT INTO lineups (id, map_id, side, grenade_type, target, title, description, telegram_message_id, thumbnail_url) VALUES 
('lineup_1', 'de_dust2', 'T', 'smoke', 'ct_side', 'Dust2 T Smoke', 'T side smoke on Dust2', 123456789, 'https://example.com/dust2_t_smoke.jpg'),
('lineup_2', 'de_dust2', 'CT', 'flash', 't_side', 'Dust2 CT Flash', 'CT side flash on Dust2', 123456790, 'https://example.com/dust2_ct_flash.jpg'),
('lineup_3', 'de_inferno', 'T', 'molotov', 'ct_side', 'Inferno T Molotov', 'T side molotov on Inferno', 123456791, 'https://example.com/inferno_t_molotov.jpg'),
('lineup_4', 'de_inferno', 'CT', 'he', 't_side', 'Inferno CT HE', 'CT side HE on Inferno', 123456792, 'https://example.com/inferno_ct_he.jpg')
ON CONFLICT (id) DO NOTHING;