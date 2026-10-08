import { Router } from 'express'
import { validateMapId, validateQuery } from '../middleware/zodValidation'
import { pool } from '../database'

const router = Router()

const createErrorResponse = (code: string, message: string) => ({
  error: { code, message }
})

const getTelegramUrl = (messageId: number): string | undefined => {
  const username = process.env.TELEGRAM_CHANNEL_USERNAME?.trim().replace(/^@/, '')
  if (!username || /^your_channel_username$/i.test(username)) return undefined
  return `https://t.me/${username}/${messageId}`
}

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, slug, name, thumbnail_url, sort_order,
      (SELECT COUNT(*) FROM lineups WHERE map_id = maps.id) as lineup_count
      FROM maps ORDER BY sort_order
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error getting maps:', error)
    res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
  }
})

router.get('/:id/targets', validateMapId, validateQuery, async (req, res) => {
  try {
    const { id: mapId } = req.params
    const { side, grenade_type } = req.query
    const params: string[] = [mapId]
    let paramIndex = 2
    let query = 'SELECT DISTINCT target FROM lineups WHERE map_id = $1'

    if (side) {
      query += ` AND side = ${paramIndex++}`
      params.push(String(side))
    }
    if (grenade_type) {
      query += ` AND grenade_type = ${paramIndex++}`
      params.push(String(grenade_type))
    }

    query += ' ORDER BY target'
    const result = await pool.query(query, params)
    res.json(result.rows.map(row => row.target))
  } catch (error) {
    console.error('Error getting lineup targets:', error)
    res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
  }
})

router.get('/:id', validateMapId, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, slug, name, thumbnail_url, sort_order,
      (SELECT COUNT(*) FROM lineups WHERE map_id = maps.id) as lineup_count
      FROM maps WHERE id = $1
    `, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Map not found'))
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting map:', error)
    res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
  }
})

router.get('/:id/lineups', validateMapId, validateQuery, async (req, res) => {
  try {
    const { id: mapId } = req.params
    const { side, grenade_type, target, page = 1, limit = 30 } = req.query
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const params: any[] = [mapId]
    let paramIndex = 2

    let query = `
      SELECT id, map_id, side, grenade_type, target, title, description,
      telegram_message_id, thumbnail_url, created_at, updated_at
      FROM lineups WHERE map_id = $1
    `

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

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limitNumber, (pageNumber - 1) * limitNumber)

    const result = await pool.query(query, params)

    const countParams: any[] = [mapId]
    let countParamIndex = 2
    let countQuery = 'SELECT COUNT(*) as total FROM lineups WHERE map_id = $1'

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
    const username = process.env.TELEGRAM_CHANNEL_USERNAME?.trim().replace(/^@/, '')
    const telegramEnabled = Boolean(username && !/^your_channel_username$/i.test(username))

    res.json({
      items: result.rows.map(lineup => ({
        ...lineup,
        telegram_url: telegramEnabled ? `https://t.me/${username}/${lineup.telegram_message_id}` : undefined
      })),
      page: pageNumber,
      limit: limitNumber,
      total: Number(countResult.rows[0].total)
    })
  } catch (error) {
    console.error('Error getting lineups:', error)
    res.status(500).json(createErrorResponse('DATABASE_ERROR', 'Database error occurred'))
  }
})

export default router
