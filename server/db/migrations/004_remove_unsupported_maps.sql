-- Remove maps that are no longer supported by the Mini App.
-- Related lineups are removed automatically through ON DELETE CASCADE.
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