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
  width: number
  height: number
  duration: number
}

export interface TelegramChannelPost {
  message_id: number
  chat: { id: number; type: string }
  caption?: string
  video?: TelegramVideo
}

export interface TelegramMessage {
  message_id: number
  chat: { id: number; type: string }
  text?: string
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  channel_post?: TelegramChannelPost
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
    { timeout: 15000 }
  )

  if (!response.data.ok) {
    throw new Error(response.data.description || `Telegram API ${method} failed`)
  }

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
    allowed_updates: ['message', 'channel_post'],
    ...(secret ? { secret_token: secret } : {})
  })

  console.log(`Telegram webhook configured: ${url}`)
}

export const sendStartMessage = async (chatId: number): Promise<void> => {
  const webAppUrl = process.env.TELEGRAM_WEBAPP_URL?.trim()
  if (!webAppUrl) throw new Error('TELEGRAM_WEBAPP_URL is not configured')

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: '🎯 CS2 Nades\\n\\nОткрой базу раскидок:',
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🎯 Открыть CS2 Nades',
          web_app: { url: webAppUrl }
        }
      ]]
    }
  })
}

export const getTelegramFile = (fileId: string): Promise<TelegramFile> =>
  callTelegram<TelegramFile>('getFile', { file_id: fileId })

export const streamTelegramFile = async (
  filePath: string,
  range?: string
) => {
  const headers: Record<string, string> = {}
  if (range) headers.Range = range

  return axios.get<Readable>(
    `${FILE_API}/bot${getToken()}/${filePath}`,
    {
      responseType: 'stream',
      timeout: 30000,
      headers
    }
  )
}

export const getConfiguredChannelId = (): string | undefined =>
  process.env.TELEGRAM_CHANNEL_ID?.trim()

export const getWebhookSecret = (): string | undefined =>
  process.env.TELEGRAM_WEBHOOK_SECRET?.trim()
