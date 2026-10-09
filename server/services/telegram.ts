import axios from 'axios'
import { Readable } from 'stream'

const API = 'https://api.telegram.org'
const FILE_API = 'https://api.telegram.org/file'

interface TelegramResponse<T> {
  ok: boolean
  result: T
  description?: string
}

export interface TelegramVideo {
  file_id: string
  file_unique_id: string
  mime_type?: string
  file_size?: number
  width?: number
  height?: number
  duration?: number
}

export interface TelegramMessage {
  message_id: number
  chat: { id: number; type: string }
  from?: { id: number; username?: string; first_name?: string }
  text?: string
  caption?: string
  video?: TelegramVideo
  photo?: Array<{ file_id: string; file_unique_id: string; width: number; height: number; file_size?: number }>
  document?: { file_id: string; mime_type?: string; file_size?: number }
}

export interface TelegramChannelPost extends TelegramMessage {
  chat: { id: number; type: string }
}

export interface TelegramCallbackQuery {
  id: string
  from: { id: number; username?: string; first_name?: string }
  data?: string
  message?: { message_id: number; chat: { id: number; type: string } }
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  channel_post?: TelegramChannelPost
  callback_query?: TelegramCallbackQuery
}

interface TelegramFile {
  file_path?: string
  file_size?: number
}

const getToken = (): string => {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  return token
}

const callTelegram = async <T>(
  method: string,
  payload: Record<string, unknown> = {}
): Promise<T> => {
  const response = await axios.post<TelegramResponse<T>>(
    `${API}/bot${getToken()}/${method}`,
    payload,
    { timeout: 20000 }
  )
  if (!response.data.ok) throw new Error(response.data.description || `Telegram API ${method} failed`)
  return response.data.result
}

export const setWebhook = async (): Promise<void> => {
  const url = process.env.TELEGRAM_WEBHOOK_URL?.trim()
  if (!url) {
    console.log('TELEGRAM_WEBHOOK_URL is not configured; webhook setup skipped')
    return
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim()
  await callTelegram<boolean>('setWebhook', {
    url,
    allowed_updates: ['message', 'channel_post', 'callback_query'],
    ...(secret ? { secret_token: secret } : {})
  })
  console.log(`Telegram webhook configured: ${url}`)
}

export const sendStartMessage = async (chatId: number): Promise<void> => {
  const webAppUrl = process.env.TELEGRAM_WEBAPP_URL?.trim()
  if (!webAppUrl) throw new Error('TELEGRAM_WEBAPP_URL is not configured')
  await sendTelegramMessage(chatId, '🎯 CS2 Nades\n\nОткрой базу раскидок:', [[
    { text: '🎯 Открыть CS2 Nades', web_app: { url: webAppUrl } }
  ]])
}

export const sendTelegramMessage = (
  chatId: number,
  text: string,
  inlineKeyboard?: Array<Array<Record<string, unknown>>>
): Promise<TelegramMessage> => callTelegram<TelegramMessage>('sendMessage', {
  chat_id: chatId,
  text,
  parse_mode: 'HTML',
  ...(inlineKeyboard ? { reply_markup: { inline_keyboard: inlineKeyboard } } : {})
})

export const answerCallbackQuery = (callbackQueryId: string, text?: string): Promise<boolean> =>
  callTelegram<boolean>('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    ...(text ? { text, show_alert: false } : {})
  })

export const sendVideoToChannel = (
  videoFileId: string,
  caption: string
): Promise<TelegramMessage> => {
  const channelId = process.env.TELEGRAM_CHANNEL_ID?.trim()
  if (!channelId) throw new Error('TELEGRAM_CHANNEL_ID is not configured')
  return callTelegram<TelegramMessage>('sendVideo', {
    chat_id: channelId,
    video: videoFileId,
    caption: caption.slice(0, 1024),
    supports_streaming: true
  })
}

export const deleteChannelMessage = (messageId: number): Promise<boolean> => {
  const channelId = process.env.TELEGRAM_CHANNEL_ID?.trim()
  if (!channelId) throw new Error('TELEGRAM_CHANNEL_ID is not configured')
  return callTelegram<boolean>('deleteMessage', { chat_id: channelId, message_id: messageId })
}

export const getTelegramFile = (fileId: string): Promise<TelegramFile> =>
  callTelegram<TelegramFile>('getFile', { file_id: fileId })

export const streamTelegramFile = async (filePath: string, range?: string) => {
  const headers: Record<string, string> = {}
  if (range) headers.Range = range
  return axios.get<Readable>(`${FILE_API}/bot${getToken()}/${filePath}`, {
    responseType: 'stream',
    timeout: 30000,
    headers
  })
}

export const getConfiguredChannelId = (): string | undefined =>
  process.env.TELEGRAM_CHANNEL_ID?.trim()

export const getWebhookSecret = (): string | undefined =>
  process.env.TELEGRAM_WEBHOOK_SECRET?.trim()

export const isTelegramAdmin = (userId: number): boolean => {
  const ids = (process.env.TELEGRAM_ADMIN_IDS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
  return ids.includes(String(userId))
}

export const hasTelegramAdminsConfigured = (): boolean =>
  Boolean(process.env.TELEGRAM_ADMIN_IDS?.split(',').some(value => /^\d+$/.test(value.trim())))
