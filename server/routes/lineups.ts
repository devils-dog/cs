import { Router } from 'express'
import { validateMapId } from '../middleware/zodValidation'
import { validateLineupId } from '../middleware/zodValidation'
import { validateQuery } from '../middleware/zodValidation'
import { pool } from '../database'

const router = Router()

// Standard error response format
const createErrorResponse = (code: string, message: string) => ({
  error: {
    code,
    message
  }
});

// Get lineups for a map
router.get('/maps/:mapId/lineups', validateMapId, validateQuery, async (req, res) => {
  try {
    const { mapId } = req.params
    const { side, grenade_type, target, page, limit } = req.query
    
    // Build query with filters
    const params: any[] = [mapId]
    let query = `
      SELECT id, map_id, side, grenade_type, target, title, description, 
      telegram_message_id, thumbnail_url, created_at, updated_at
      FROM lineups 
      WHERE map_id = $1
    `
    
    // Track parameter indexes separately to avoid conflicts
    let paramIndex = 2 // Start with 2 since $1 is used for mapId
    
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
    
    // Add pagination with exact parameters
    const offset = (Number(page) - 1) * Number(limit)
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(Number(limit), offset)
    
    const result = await pool.query(query, params)
    
    // Get total count using separate array with clean indexing
    const countParams: any[] = [mapId]
    
    let countQuery = `
      SELECT COUNT(*) as total
      FROM lineups 
      WHERE map_id = $1
    `
    
    // Recreate the same filters for count query with clean param tracking
    let countParamIndex = 2 // Same starting index for clean tracking
    if (side) {
      countQuery += ` AND side = $${countParamIndex++}`
      countParams.push(side)
    }
    
    if (grenade_type) {
      countQuery += ` AND grenade_type = $${countParamIndex++}`
      countParams.push(grenade_type)
    }
    
    if (target) {
      countQuery += ` AND target = $${countParamIndex++}`
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
    res.status(500).json(createErrorResponse('INTERNAL_SERVER_ERROR', 'Internal server error'))
  }
})

// Get a single lineup
router.get('/:id', validateLineupId, async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `
      SELECT id, map_id, side, grenade_type, target, title, description, 
      telegram_message_id, thumbnail_url, created_at, updated_at
      FROM lineups 
      WHERE id = $1
    `,
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('LINEUP_NOT_FOUND', 'Lineup not found'))
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting lineup:', error)
    res.status(500).json(createErrorResponse('INTERNAL_SERVER_ERROR', 'Internal server error'))
  }
})

export default router