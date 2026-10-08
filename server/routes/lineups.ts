import { Router } from 'express'
import { validateLineupId } from '../middleware/zodValidation'
import { pool } from '../database'

const router = Router()
const createErrorResponse = (code: string, message: string) => ({ error: { code, message } })

router.get('/:id', validateLineupId, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, map_id, side, grenade_type, target, title, description,
      telegram_message_id, telegram_file_id, telegram_mime_type, telegram_file_size,
      thumbnail_url, created_at, updated_at
      FROM lineups WHERE id = $1
    `, [req.params.id])

    if (!result.rows.length) return res.status(404).json(createErrorResponse('NOT_FOUND', 'Lineup not found'))

    const lineup = result.rows[0]
    const username = process.env.TELEGRAM_CHANNEL_USERNAME?.trim().replace(/^@/, '')
    const telegramEnabled = Boolean(username && lineup.telegram_message_id && !/^your_channel_username$/i.test(username))

    res.json({
      ...lineup,
      telegram_url: telegramEnabled ? `https://t.me/${username}/${lineup.telegram_message_id}` : undefined
    })
  } catch (error) {
    console.error('Error getting lineup:', error)
    res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
  }
})

export default router
