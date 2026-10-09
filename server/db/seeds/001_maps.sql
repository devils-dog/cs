-- Seed only the maps supported by the Mini App.
INSERT INTO maps (id, slug, name, thumbnail_url, sort_order) VALUES
('de_mirage', 'de_mirage', 'Mirage', NULL, 1),
('de_dust2', 'de_dust2', 'Dust II', NULL, 2),
('de_inferno', 'de_inferno', 'Inferno', NULL, 3),
('de_nuke', 'de_nuke', 'Nuke', NULL, 4),
('de_ancient', 'de_ancient', 'Ancient', NULL, 5),
('de_anubis', 'de_anubis', 'Anubis', NULL, 6),
('de_cache', 'de_cache', 'Cache', NULL, 7)
ON CONFLICT (id) DO UPDATE
SET slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    thumbnail_url = EXCLUDED.thumbnail_url,
    sort_order = EXCLUDED.sort_order;