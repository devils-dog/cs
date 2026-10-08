# Stage 14 Plan: Исправить pagination

## Current State:
Looking at lineups.ts, I can see the existing pagination implementation:

```typescript
// Get lineups for a map
router.get('/maps/:mapId/lineups', zodValidateMapId, async (req, res) => {
  try {
    const { mapId } = req.params
    const { side, grenade_type, target, page = 1, limit = 30 } = req.query
    
    // Build query with filters
    let query = `
      SELECT id, map_id, side, grenade_type, target, title, description, 
      telegram_message_id, thumbnail_url, created_at, updated_at
      FROM lineups 
      WHERE map_id = $1
    `
    
    const params: any[] = [mapId]
    let paramIndex = 2
    
    if (side) {
      query += ` AND side = $${paramIndex++}`
      params.push(side)
    }
    
    if (grenade_type) {
      query += ` AND grenade_type = $${paramIndex++}`
      params.push(grenade_type)
    }
    
    if (target) {
      query += ` AND target = $${paramIndex++}`
      params.push(target)
    }
    
    // Add pagination
    const offset = (Number(page) - 1) * Number(limit)
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(Number(limit), offset)
    
    const result = await pool.query(query, params)
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM lineups 
      WHERE map_id = $1
    `
    
    const countParams: any[] = [mapId]
    
    if (side) {
      countQuery += ` AND side = $${paramIndex++}`
      countParams.push(side)
    }
    
    if (grenade_type) {
      countQuery += ` AND grenade_type = $${paramIndex++}`
      countParams.push(grenade_type)
    }
    
    if (target) {
      countQuery += ` AND target = $${paramIndex++}`
      countParams.push(target)
    }
    
    const countResult = await pool.query(countQuery, countParams)
    
    res.json({
      items: result.rows,
      page: Number(page),
      limit: Number(limit),
      total: Number(countResult.rows[0].total)
    })
  } catch (error) {
    console.error('Error getting lineups:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    })
  }
})
```

## Issues Identified:
1. The paramIndex tracking is complex when using different parameters in different parts
2. The approach for filtering parameters might not be consistent  

## What Needs to Be Fixed:
1. Use separate parameter arrays for query and count operations  
2. Ensure proper parameter separation to avoid conflict with pagination parameters
3. Simplify parameter management for better readability

## Acceptance Criteria:
- ✅ SQL for COUNT(*) uses separate parameter arrays
- ✅ SQL for SELECT uses separate parameter arrays  
- ✅ No parameter conflicts between queries
- ✅ Pagination works correctly for page=1, page=2, page=3
- ✅ Correct total count returned

## Strategy:
- Refactor for cleaner parameter separation
- Keep the current pagination logic but make it more robust