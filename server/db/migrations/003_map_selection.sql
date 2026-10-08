-- Keep only the maps currently supported by the Mini App.
INSERT INTO maps (id, slug, name, thumbnail_url, sort_order) VALUES
  ('de_mirage', 'de_mirage', 'Mirage', 'https://example.com/mirage_thumbnail.jpg', 1),
  ('de_dust2', 'de_dust2', 'Dust II', 'https://example.com/dust2_thumbnail.jpg', 2),
  ('de_inferno', 'de_inferno', 'Inferno', 'https://example.com/inferno_thumbnail.jpg', 3),
  ('de_nuke', 'de_nuke', 'Nuke', 'https://example.com/nuke_thumbnail.jpg', 4),
  ('de_ancient', 'de_ancient', 'Ancient', 'https://example.com/ancient_thumbnail.jpg', 5),
  ('de_anubis', 'de_anubis', 'Anubis', 'https://example.com/anubis_thumbnail.jpg', 6),
  ('de_cache', 'de_cache', 'Cache', 'https://example.com/cache_thumbnail.jpg', 7)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    sort_order = EXCLUDED.sort_order;

DELETE FROM maps
WHERE id NOT IN (
  'de_mirage',
  'de_dust2',
  'de_inferno',
  'de_nuke',
  'de_ancient',
  'de_anubis',
  'de_cache'
);
