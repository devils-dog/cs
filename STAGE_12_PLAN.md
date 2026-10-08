# Stage 12 Plan: Исправить backend API

## Current State Analysis:
- We have three route files:
  1. `server/routes/maps.ts` - handles /api/maps and /api/maps/:id
  2. `server/routes/lineups.ts` - handles /api/lineups and /api/maps/:id/lineups 
  3. `server/routes/api.ts` - duplicate functionality

## What Needs to be Fixed:
1. **Remove duplicate API route file** - remove `api.ts`
2. **Ensure correct route paths** - all following the pattern:
   - `/api/maps` (GET all maps)
   - `/api/maps/:id` (GET single map)
   - `/api/maps/:id/lineups` (GET lineups for map)
   - `/api/lineups/:id` (GET single lineup)

## Key Issues:
1. Based on existing code structure:
   - `server/routes/lineups.ts` has `/:id` route for single lineup but is missing the `/maps/:id/lineups` route 
   - `server/routes/maps.ts` handles maps but should include the `/lineups` route directly or the file structure should be reorganized
   
2. Need to ensure correct paths match the target API

## Action Plan:
1. First ensure `server/routes/maps.ts` gets the `lineups` route (both GET /:id/lineups and GET /:id)
2. Remove `server/routes/api.ts` file completely
3. Update main app.ts to only use maps and lineups routes
4. Test to ensure all targeted API endpoints still work

## Acceptance Criteria:
- [ ] /api/maps works correctly
- [ ] /api/maps/:id works correctly  
- [ ] /api/maps/:id/lineups works correctly
- [ ] /api/lineups/:id works correctly
- [ ] No duplicate routes
- [ ] No leftover api.ts file