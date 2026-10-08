import { Router } from 'express'
import { validateMapId, validateLineupId } from '../middleware/validation'
import pool from '../database'

const router = Router()

// Get all maps
router.get('/maps', async (req, res) => {
  try:
    const result = await pool.query(
      `
      SELECT id, slug, name, thumbnail_url, sort_order, 
      (SELECT COUNT(*) FROM lineups WHERE map_id = maps.id) as lineup_count
      FROM maps 
      ORDER BY sort_order
    `
    )
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error getting maps:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    })
  }
})

// Get a single map by ID
router.get('/maps/:id', validateMapId, async (req, res) => {
  try:
    const { id } = req.params
    const result = await pool.query(
      `
      SELECT id, slug, name, thumbnail_url, sort_order, 
      (SELECT COUNT(*) FROM lineups WHERE map_id = maps.id) as lineup_count
      FROM maps 
      WHERE id = $1
    `,
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'MAP_NOT_FOUND',
          message: 'Map not found',
        },
      })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting map:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    })
  }
})

// Get lineups for a map
router.get('/maps/:id/lineups', validateMapId, async (req, res) => {
  try:
    const { id } = req.params
    const { side, grenade_type, target, page = 1, limit = 30 } = req.query
    
    // Build query with filters
    let query = `
      SELECT id, map_id, side, grenade_type, target, title, description, 
      telegram_message_id, thumbnail_url, created_at, updated_at
      FROM lineups 
      WHERE map_id = $1
    `
    
    const params: any[] = [id]
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
    
    const countParams: any[] = [id]
    
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

// Get a single lineup by ID
router.get('/lineups/:id', validateLineupId, async (req, res) => {
  try:
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
      return res.status(404).json({
        error: {
          code: 'LINEUP_NOT_FOUND',
          message: 'Lineup not found',
        },
      })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting lineup:', error)
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    })
  }
})

export default router