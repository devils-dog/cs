import { Router } from 'express'
import { pool } from '../database'
import { getConfiguredChannelId, getTelegramFile, getWebhookSecret, sendStartMessage, streamTelegramFile, TelegramUpdate } from '../services/telegram'

const router = Router()
const errorResponse = (code: string, message: string) => ({ error: { code, message } })

const parseLineupId = (caption?: string): string | undefined => {
  const firstLine = caption?.split(/\r?\n/).map(line => line.trim()).find(Boolean)
  return firstLine && /^[a-z0-9_-]+$/.test(firstLine) ? firstLine : undefined
}

router.post('/webhook', async (req, res) => {
  const secret = getWebhookSecret()
  if (secret && req.get('X-Telegram-Bot-Api-Secret-Token') !== secret) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid Telegram webhook secret'))
  }

  const update = req.body as TelegramUpdate

  if (update.message?.chat.type === 'private' && update.message.text?.trim() === '/start') {
    try {
      await sendStartMessage(update.message.chat.id)
      return res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Error sending Telegram start message:', error)
      return res.status(500).json(errorResponse('TELEGRAM_ERROR', 'Failed to send Telegram start message'))
    }
  }

  const post = update.channel_post
  if (!post || !post.video?.file_id) return res.status(200).json({ ok: true, ignored: true })

  const channelId = getConfiguredChannelId()
  if (!channelId || String(post.chat.id) !== channelId) {
    console.warn(`Ignoring Telegram post from unexpected channel: ${post.chat.id}`)
    return res.status(200).json({ ok: true, ignored: true })
  }

  const lineupId = parseLineupId(post.caption)
  if (!lineupId) return res.status(200).json({ ok: true, ignored: true })

  try {
    const result = await pool.query(
      `UPDATE lineups
       SET telegram_message_id = $1, telegram_file_id = $2,
           telegram_mime_type = $3, telegram_file_size = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id`,
      [post.message_id, post.video.file_id, post.video.mime_type || 'video/mp4', post.video.file_size ?? null, lineupId]
    )
    if (!result.rows.length) {
      console.warn(`Telegram video ${post.message_id} references unknown lineup: ${lineupId}`)
      return res.status(200).json({ ok: true, linked: false })
    }
    console.log(`Telegram video linked: lineup=${lineupId}, message=${post.message_id}`)
    return res.status(200).json({ ok: true, linked: true, lineup_id: lineupId })
  } catch (error) {
    console.error('Error processing Telegram channel post:', error)
    return res.status(500).json(errorResponse('DATABASE_ERROR', 'Failed to save Telegram video'))
  }
})

router.get('/lineups/:id/video', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT telegram_file_id, telegram_mime_type, telegram_file_size FROM lineups WHERE id = $1',
      [req.params.id]
    )
    if (!result.rows.length) return res.status(404).json(errorResponse('NOT_FOUND', 'Lineup not found'))
    const lineup = result.rows[0]
    if (!lineup.telegram_file_id) return res.status(404).json(errorResponse('VIDEO_NOT_FOUND', 'Telegram video is not linked'))

    const file = await getTelegramFile(lineup.telegram_file_id)
    if (!file.file_path) return res.status(502).json(errorResponse('TELEGRAM_FILE_ERROR', 'Telegram did not return a file path'))

    const upstream = await streamTelegramFile(file.file_path, req.get('Range'))
    res.status(upstream.status === 206 ? 206 : 200)
    res.setHeader('Content-Type', lineup.telegram_mime_type || upstream.headers['content-type'] || 'video/mp4')
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    const length = upstream.headers['content-length'] || lineup.telegram_file_size
    if (length) res.setHeader('Content-Length', String(length))
    if (upstream.status === 206 && upstream.headers['content-range']) res.setHeader('Content-Range', upstream.headers['content-range'])
    upstream.data.on('error', error => { console.error('Telegram video stream error:', error); if (!res.headersSent) res.status(502); res.end() })
    upstream.data.pipe(res)
  } catch (error: any) {
    console.error('Error streaming Telegram video:', error)
    if (error?.response?.status === 404) return res.status(404).json(errorResponse('TELEGRAM_FILE_NOT_FOUND', 'Telegram video file not found'))
    return res.status(502).json(errorResponse('TELEGRAM_ERROR', 'Failed to load Telegram video'))
  }
})

export default router
