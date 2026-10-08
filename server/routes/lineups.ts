import { Router } from 'express'
import { validateMapId } from '../middleware/zodValidation'
import { validateLineupId } from '../middleware/zodValidation'
import { validateQuery } from '../middleware/zodValidation'
import { pool } from '../database'
import { ApiError } from '../middleware/errorHandler'

const router = Router()

// Standard error response format
const createErrorResponse = (code: string, message: string) => ({
  error: {
    code,
    message
  }
});

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
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Lineup not found'))
    }
    
    const lineup = result.rows[0]
    // Generate the telegram URL for this lineup
    const telegramUrl = `https://t.me/${process.env.TELEGRAM_CHANNEL_USERNAME}/${lineup.telegram_message_id}`
    
    // Return the lineup with the added telegram_url
    res.json({
      ...lineup,
      telegram_url: telegramUrl
    })
  } catch (error) {
    console.error('Error getting lineup:', error)
    // Handle database errors with standard error format
    if (error instanceof Error) {
      res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
    } else {
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Internal server error'))
    }
  }
})

export default router