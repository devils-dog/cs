-- Insert default maps
INSERT INTO maps (id, slug, name, thumbnail_url, sort_order) VALUES 
('de_dust2', 'de_dust2', 'Dust2', 'https://example.com/dust2_thumbnail.jpg', 1),
('de_inferno', 'de_inferno', 'Inferno', 'https://example.com/inferno_thumbnail.jpg', 2),
('de_mirage', 'de_mirage', 'Mirage', 'https://example.com/mirage_thumbnail.jpg', 3),
('de_nuke', 'de_nuke', 'Nuke', 'https://example.com/nuke_thumbnail.jpg', 4),
('de_overpass', 'de_overpass', 'Overpass', 'https://example.com/overpass_thumbnail.jpg', 5),
('de_vertigo', 'de_vertigo', 'Vertigo', 'https://example.com/vertigo_thumbnail.jpg', 6),
('de_ancient', 'de_ancient', 'Ancient', 'https://example.com/ancient_thumbnail.jpg', 7),
('de_anubis', 'de_anubis', 'Anubis', 'https://example.com/anubis_thumbnail.jpg', 8)
ON CONFLICT (id) DO NOTHING;