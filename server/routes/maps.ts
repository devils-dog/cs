import { Router } from 'express'
import { validateMapId } from '../middleware/zodValidation'
import { pool } from '../database'

const router = Router()

// Standard error response format
const createErrorResponse = (code: string, message: string) => ({
  error: {
    code,
    message
  }
});

// Get all maps
router.get('/', async (req, res) => {
  try {
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
    res.status(500).json(createErrorResponse('INTERNAL_SERVER_ERROR', 'Internal server error'))
  }
})

// Get a single map
router.get('/:id', validateMapId, async (req, res) => {
  try {
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
      return res.status(404).json(createErrorResponse('MAP_NOT_FOUND', 'Map not found'))
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting map:', error)
    res.status(500).json(createErrorResponse('INTERNAL_SERVER_ERROR', 'Internal server error'))
  }
})

export default router