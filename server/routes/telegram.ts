import { randomBytes } from 'crypto'
import { Router } from 'express'
import { pool } from '../database'
import {
  answerCallbackQuery,
  deleteChannelMessage,
  getConfiguredChannelId,
  getTelegramFile,
  getWebhookSecret,
  hasTelegramAdminsConfigured,
  isTelegramAdmin,
  sendStartMessage,
  sendTelegramMessage,
  sendVideoToChannel,
  streamTelegramFile,
  TelegramUpdate
} from '../services/telegram'

const router = Router()
const errorResponse = (code: string, message: string) => ({ error: { code, message } })

type AdminSession = {
  mode: 'create' | 'replace' | 'thumbnail' | 'edit' | 'search'
  step: string
  lineupId?: string
  mapId?: string
  side?: 'T' | 'CT'
  grenadeType?: 'smoke' | 'flash' | 'molotov' | 'he'
  target?: string
  title?: string
  description?: string
  editField?: 'target' | 'title' | 'description'
}

const MAPS = [
  ['de_mirage', 'Mirage'],
  ['de_dust2', 'Dust II'],
  ['de_inferno', 'Inferno'],
  ['de_nuke', 'Nuke'],
  ['de_ancient', 'Ancient'],
  ['de_anubis', 'Anubis'],
  ['de_cache', 'Cache']
] as const
const SIDES = [['T', 'Атака (T)'], ['CT', 'Защита (CT)']] as const
const GRENADES = [['smoke', '💨 Смок'], ['flash', '✨ Флешка'], ['molotov', '🔥 Молотов'], ['he', '💣 HE']] as const

const setSession = async (userId: number, state: AdminSession): Promise<void> => {
  await pool.query(
    `INSERT INTO telegram_admin_sessions (user_id, state, updated_at)
     VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, updated_at = CURRENT_TIMESTAMP`,
    [userId, JSON.stringify(state)]
  )
}
const getSession = async (userId: number): Promise<AdminSession | undefined> => {
  const result = await pool.query('SELECT state FROM telegram_admin_sessions WHERE user_id = $1', [userId])
  return result.rows[0]?.state as AdminSession | undefined
}
const clearSession = async (userId: number): Promise<void> => {
  await pool.query('DELETE FROM telegram_admin_sessions WHERE user_id = $1', [userId])
}
const send = (chatId: number, message: string, rows?: Array<Array<Record<string, unknown>>>) =>
  sendTelegramMessage(chatId, message, rows)

const mainMenu = (chatId: number) => send(chatId, '🛠 CS2 Nades — панель администратора', [
  ...(process.env.TELEGRAM_WEBAPP_URL?.trim() ? [[{ text: '🎯 Открыть Mini App', web_app: { url: process.env.TELEGRAM_WEBAPP_URL.trim() } }]] : []),
  [{ text: '➕ Добавить раскидку', callback_data: 'admin:add' }],
  [{ text: '📚 Каталог раскидок', callback_data: 'admin:list:0' }, { text: '🔎 Поиск', callback_data: 'admin:search' }],
  [{ text: '📊 Статистика', callback_data: 'admin:stats' }]
])

const mapKeyboard = (prefix: string) => {
  const rows: Array<Array<Record<string, unknown>>> = []
  for (let i = 0; i < MAPS.length; i += 2) {
    rows.push(MAPS.slice(i, i + 2).map(([id, name]) => ({ text: name, callback_data: `${prefix}:${id}` })))
  }
  rows.push([{ text: '✖ Отмена', callback_data: 'admin:cancel' }])
  return rows
}
const sideKeyboard = (prefix: string) => [
  SIDES.map(([id, name]) => ({ text: name, callback_data: `${prefix}:${id}` })),
  [{ text: '⬅ В меню', callback_data: 'admin:cancel' }]
]
const grenadeKeyboard = (prefix: string) => [
  GRENADES.map(([id, name]) => ({ text: name, callback_data: `${prefix}:${id}` })),
  [{ text: '⬅ В меню', callback_data: 'admin:cancel' }]
]
const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char] as string))
const validText = (value: string, max: number): string => value.trim().slice(0, max)

const showLineup = async (chatId: number, lineupId: string): Promise<void> => {
  const result = await pool.query(
    `SELECT l.id, l.map_id, m.name AS map_name, l.side, l.grenade_type, l.target, l.title,
            l.description, l.telegram_message_id, l.telegram_file_id, l.telegram_thumbnail_file_id
     FROM lineups l JOIN maps m ON m.id = l.map_id WHERE l.id = $1`,
    [lineupId]
  )
  if (!result.rows.length) {
    await send(chatId, 'Раскидка не найдена.', [[{ text: '⬅ В меню', callback_data: 'admin:home' }]])
    return
  }
  const l = result.rows[0]
  const grenadeName = GRENADES.find(([id]) => id === l.grenade_type)?.[1] || l.grenade_type
  await send(chatId,
    `🎯 <b>${escapeHtml(l.title)}</b>\nID: <code>${escapeHtml(l.id)}</code>\nКарта: ${escapeHtml(l.map_name)}\nСторона: ${l.side}\nТип: ${escapeHtml(grenadeName)}\nЦель: ${escapeHtml(l.target)}\nВидео: ${l.telegram_file_id ? 'привязано' : 'нет'}\n\nОписание: ${escapeHtml(l.description || '—')}`,
    [
      [{ text: '✏️ Название', callback_data: `admin:edit:title:${l.id}` }, { text: '🎯 Цель', callback_data: `admin:edit:target:${l.id}` }],
      [{ text: '📝 Описание', callback_data: `admin:edit:description:${l.id}` }],
      [{ text: '🗺 Карта', callback_data: `admin:editmap:${l.id}` }, { text: '🛡 Сторона', callback_data: `admin:editside:${l.id}` }],
      [{ text: '💣 Тип гранаты', callback_data: `admin:editgrenade:${l.id}` }],
      [{ text: '🎞 Заменить видео', callback_data: `admin:replace:${l.id}` }],
      [{ text: '🖼️ Загрузить / заменить превью', callback_data: `admin:thumbnail:${l.id}` }],
      ...(l.telegram_thumbnail_file_id ? [[{ text: '🗑 Удалить превью', callback_data: `admin:thumbnaildelete:${l.id}` }]] : []),
      [{ text: '🗑 Удалить', callback_data: `admin:delete:${l.id}` }],
      [{ text: '⬅ Каталог', callback_data: 'admin:list:0' }, { text: '🏠 Меню', callback_data: 'admin:home' }]
    ])
}

type ListFilters = { mapId?: string; side?: string; grenadeType?: string }

const showList = async (chatId: number, offset: number, search?: string, filters: ListFilters = {}): Promise<void> => {
  const conditions: string[] = []
  const params: unknown[] = []
  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(l.title ILIKE $1 OR l.id ILIKE $1 OR l.target ILIKE $1 OR l.description ILIKE $1)`)
  }
  if (filters.mapId && filters.mapId !== 'all') { params.push(filters.mapId); conditions.push(`l.map_id = ${params.length}`) }
  if (filters.side && filters.side !== 'all') { params.push(filters.side); conditions.push(`l.side = ${params.length}`) }
  if (filters.grenadeType && filters.grenadeType !== 'all') { params.push(filters.grenadeType); conditions.push(`l.grenade_type = ${params.length}`) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const count = await pool.query(`SELECT COUNT(*)::int AS total FROM lineups l ${where}`, params)
  const total = count.rows[0].total as number
  const limit = 5
  const pageOffset = Math.max(0, offset)
  const rows = await pool.query(
    `SELECT l.id, l.title, l.side, l.grenade_type, m.name AS map_name, l.telegram_file_id
     FROM lineups l JOIN maps m ON m.id = l.map_id ${where}
     ORDER BY m.sort_order, l.side, l.grenade_type, l.title LIMIT ${limit} OFFSET ${pageOffset}`,
    params
  )
  if (!rows.rows.length) {
    const message = search ? `По запросу «${escapeHtml(search)}» ничего не найдено.` : 'По выбранным фильтрам раскидок нет.'
    await send(chatId, message, [
      [{ text: '🔎 Изменить фильтры', callback_data: 'admin:filters' }],
      [{ text: '➕ Добавить раскидку', callback_data: 'admin:add' }, { text: '🏠 Меню', callback_data: 'admin:home' }]
    ])
    return
  }
  const keyboard: Array<Array<Record<string, unknown>>> = rows.rows.map((l: any) => [{
    text: `${l.telegram_file_id ? '🎬' : '⚠️'} ${l.map_name} · ${l.side} · ${l.title}`.slice(0, 60),
    callback_data: `admin:open:${l.id}`
  }])
  const filterSuffix = `:${filters.mapId || 'all'}:${filters.side || 'all'}:${filters.grenadeType || 'all'}`
  const nav: Array<Record<string, unknown>> = []
  if (pageOffset > 0) nav.push({ text: '⬅ Назад', callback_data: `admin:list:${Math.max(0, pageOffset - limit)}${filterSuffix}` })
  if (pageOffset + limit < total) nav.push({ text: 'Далее ➡', callback_data: `admin:list:${pageOffset + limit}${filterSuffix}` })
  if (nav.length) keyboard.push(nav)
  keyboard.push([{ text: '🔎 Поиск', callback_data: 'admin:search' }, { text: '⚙️ Фильтры', callback_data: 'admin:filters' }])
  keyboard.push([{ text: '🏠 Меню', callback_data: 'admin:home' }])
  const active = [filters.mapId && filters.mapId !== 'all' ? MAPS.find(([id]) => id === filters.mapId)?.[1] : '', filters.side && filters.side !== 'all' ? filters.side : '', filters.grenadeType && filters.grenadeType !== 'all' ? filters.grenadeType : ''].filter(Boolean).join(' · ')
  await send(chatId, `📚 Каталог: ${total} раскидок${active ? `\nФильтр: ${active}` : ''}\nПоказаны ${pageOffset + 1}–${Math.min(pageOffset + limit, total)}. Нажми на раскидку для управления.`, keyboard)
}

const createLineupWithVideo = async (chatId: number, userId: number, state: AdminSession, videoFileId: string, mimeType?: string, fileSize?: number): Promise<void> => {
  const id = `lineup_${randomBytes(5).toString('hex')}`
  const title = validText(state.title || '', 255)
  const target = validText(state.target || '', 255)
  const description = validText(state.description || '', 3000)
  if (!state.mapId || !state.side || !state.grenadeType || !title || !target) {
    await clearSession(userId)
    await send(chatId, 'Не хватает обязательных данных. Начни создание заново через /admin.')
    return
  }

  const client = await pool.connect()
  let inserted = false
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO lineups (id, map_id, side, grenade_type, target, title, description, telegram_message_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)`,
      [id, state.mapId, state.side, state.grenadeType, target, title, description || null]
    )
    inserted = true
    const mapName = state.mapId.toUpperCase()
    const caption = `${mapName} ${state.side} ${title}${description ? `\n${description}` : ''}`
    const post = await sendVideoToChannel(videoFileId, caption)
    const postedVideo = post.video
    await client.query(
      `UPDATE lineups SET telegram_message_id = $1, telegram_file_id = $2,
       telegram_mime_type = $3, telegram_file_size = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
      [post.message_id, postedVideo?.file_id || videoFileId, mimeType || postedVideo?.mime_type || 'video/mp4', fileSize ?? postedVideo?.file_size ?? null, id]
    )
    await client.query('COMMIT')
    await clearSession(userId)
    await send(chatId, `✅ Ракидка создана и опубликована.\n\nНазвание: ${escapeHtml(title)}\nID: <code>${id}</code>\nКарта: ${state.mapId}\nСторона: ${state.side}\nТип: ${state.grenadeType}`, [
      [{ text: 'Открыть карточку', callback_data: `admin:open:${id}` }],
      [{ text: '➕ Добавить ещё', callback_data: 'admin:add' }, { text: '🏠 Меню', callback_data: 'admin:home' }]
    ])
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    if (inserted) await pool.query('DELETE FROM lineups WHERE id = $1 AND telegram_message_id IS NULL', [id]).catch(() => undefined)
    console.error('Failed to create and publish lineup:', error)
    await send(chatId, '❌ Не удалось создать или опубликовать раскидку. Запись без опубликованного видео удалена, если публикация не завершилась. Проверь права бота на публикацию в канал и отправь видео ещё раз.')
  } finally {
    client.release()
  }
}

const handleAdminCallback = async (userId: number, chatId: number, data: string): Promise<void> => {
  if (data === 'admin:home') { await clearSession(userId); await mainMenu(chatId); return }
  if (data === 'admin:cancel') {
    await clearSession(userId)
    await send(chatId, 'Действие отменено.', [[{ text: '🏠 В меню', callback_data: 'admin:home' }]])
    return
  }
  if (data === 'admin:add') {
    await setSession(userId, { mode: 'create', step: 'map' })
    await send(chatId, 'Шаг 1/6. Выбери карту:', mapKeyboard('create_map'))
    return
  }
  if (data.startsWith('create_map:')) {
    const mapId = data.slice('create_map:'.length)
    if (!MAPS.some(([id]) => id === mapId)) return
    await setSession(userId, { mode: 'create', step: 'side', mapId })
    await send(chatId, 'Шаг 2/6. Выбери сторону:', sideKeyboard('create_side'))
    return
  }
  if (data.startsWith('create_side:')) {
    const side = data.slice('create_side:'.length)
    if (side !== 'T' && side !== 'CT') return
    const old = await getSession(userId)
    if (!old || old.mode !== 'create') return
    await setSession(userId, { ...old, step: 'grenade', side })
    await send(chatId, 'Шаг 3/6. Выбери тип гранаты:', grenadeKeyboard('create_grenade'))
    return
  }
  if (data.startsWith('create_grenade:')) {
    const grenadeType = data.slice('create_grenade:'.length)
    if (!GRENADES.some(([id]) => id === grenadeType)) return
    const old = await getSession(userId)
    if (!old || old.mode !== 'create') return
    await setSession(userId, { ...old, step: 'target', grenadeType: grenadeType as AdminSession['grenadeType'] })
    await send(chatId, 'Шаг 4/6. Напиши цель раскидки (например, «Выход на B»).')
    return
  }
  if (data === 'admin:search') {
    await setSession(userId, { mode: 'search', step: 'query' })
    await send(chatId, 'Напиши часть названия, ID, цели или описания для поиска.', [[{ text: '✖ Отмена', callback_data: 'admin:cancel' }]])
    return
  }
  if (data === 'admin:filters') {
    const keyboard = mapKeyboard('admin:filtermap')
    keyboard.unshift([{ text: 'Все карты', callback_data: 'admin:filtermap:all' }])
    await send(chatId, 'Фильтр каталога — выбери карту:', keyboard)
    return
  }
  if (data.startsWith('admin:filtermap:')) {
    const mapId = data.slice('admin:filtermap:'.length)
    if (mapId !== 'all' && !MAPS.some(([id]) => id === mapId)) return
    await send(chatId, 'Теперь выбери сторону:', [
      [{ text: 'Все стороны', callback_data: `admin:filterside:${mapId}:all` }],
      [{ text: 'Атака (T)', callback_data: `admin:filterside:${mapId}:T` }, { text: 'Защита (CT)', callback_data: `admin:filterside:${mapId}:CT` }],
      [{ text: '✖ Отмена', callback_data: 'admin:cancel' }]
    ])
    return
  }
  if (data.startsWith('admin:filterside:')) {
    const [, , mapId, side] = data.split(':')
    if (!mapId || !side) return
    await send(chatId, 'Теперь выбери тип гранаты:', [
      [{ text: 'Все типы', callback_data: `admin:filtergrenade:${mapId}:${side}:all` }],
      GRENADES.map(([id, name]) => ({ text: name, callback_data: `admin:filtergrenade:${mapId}:${side}:${id}` })),
      [{ text: '✖ Отмена', callback_data: 'admin:cancel' }]
    ])
    return
  }
  if (data.startsWith('admin:filtergrenade:')) {
    const [, , mapId, side, grenadeType] = data.split(':')
    await clearSession(userId)
    await showList(chatId, 0, undefined, { mapId, side, grenadeType })
    return
  }
  if (data === 'admin:list:0' || data.startsWith('admin:list:')) {
    await clearSession(userId)
    const parts = data.split(':')
    const offset = Number(parts[2] || 0)
    await showList(chatId, Number.isFinite(offset) ? offset : 0, undefined, {
      mapId: parts[3] || 'all', side: parts[4] || 'all', grenadeType: parts[5] || 'all'
    })
    return
  }
  if (data === 'admin:stats') {
    const [total, maps, missing, byMap] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS n FROM lineups'),
      pool.query('SELECT COUNT(DISTINCT map_id)::int AS n FROM lineups'),
      pool.query('SELECT COUNT(*)::int AS n FROM lineups WHERE telegram_file_id IS NULL'),
      pool.query('SELECT m.name, COUNT(l.id)::int AS n FROM maps m LEFT JOIN lineups l ON l.map_id = m.id GROUP BY m.id, m.name, m.sort_order ORDER BY m.sort_order')
    ])
    const distribution = byMap.rows.map((r: any) => `• ${r.name}: ${r.n}`).join('\n')
    await send(chatId, `📊 Статистика\nВсего раскидок: ${total.rows[0].n}\nКарт с раскидками: ${maps.rows[0].n}\nБез видео: ${missing.rows[0].n}\n\nПо картам:\n${distribution || 'Пока нет данных'}`, [[{ text: '🏠 Меню', callback_data: 'admin:home' }]])
    return
  }
  if (data.startsWith('admin:open:')) { await clearSession(userId); await showLineup(chatId, data.slice('admin:open:'.length)); return }
  if (data.startsWith('admin:editmap:')) {
    const lineupId = data.slice('admin:editmap:'.length)
    const keyboard = mapKeyboard(`admin:setmap:${lineupId}`)
    keyboard.push([{ text: '✖ Отмена', callback_data: `admin:open:${lineupId}` }])
    await send(chatId, 'Выбери новую карту:', keyboard)
    return
  }
  if (data.startsWith('admin:setmap:')) {
    const [, , lineupId, mapId] = data.split(':')
    if (!lineupId || !MAPS.some(([id]) => id === mapId)) return
    await pool.query('UPDATE lineups SET map_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [mapId, lineupId])
    await send(chatId, '✅ Карта обновлена.')
    await showLineup(chatId, lineupId)
    return
  }
  if (data.startsWith('admin:editside:')) {
    const lineupId = data.slice('admin:editside:'.length)
    await send(chatId, 'Выбери новую сторону:', [
      [{ text: 'Атака (T)', callback_data: `admin:setside:${lineupId}:T` }, { text: 'Защита (CT)', callback_data: `admin:setside:${lineupId}:CT` }],
      [{ text: '✖ Отмена', callback_data: `admin:open:${lineupId}` }]
    ])
    return
  }
  if (data.startsWith('admin:setside:')) {
    const [, , lineupId, side] = data.split(':')
    if (!lineupId || (side !== 'T' && side !== 'CT')) return
    await pool.query('UPDATE lineups SET side = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [side, lineupId])
    await send(chatId, '✅ Сторона обновлена.')
    await showLineup(chatId, lineupId)
    return
  }
  if (data.startsWith('admin:editgrenade:')) {
    const lineupId = data.slice('admin:editgrenade:'.length)
    await send(chatId, 'Выбери новый тип гранаты:', [
      GRENADES.map(([id, name]) => ({ text: name, callback_data: `admin:setgrenade:${lineupId}:${id}` })),
      [{ text: '✖ Отмена', callback_data: `admin:open:${lineupId}` }]
    ])
    return
  }
  if (data.startsWith('admin:setgrenade:')) {
    const [, , lineupId, grenadeType] = data.split(':')
    if (!lineupId || !GRENADES.some(([id]) => id === grenadeType)) return
    await pool.query('UPDATE lineups SET grenade_type = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [grenadeType, lineupId])
    await send(chatId, '✅ Тип гранаты обновлён.')
    await showLineup(chatId, lineupId)
    return
  }
  if (data.startsWith('admin:edit:')) {
    const [, , field, lineupId] = data.split(':')
    if (!['target', 'title', 'description'].includes(field) || !lineupId) return
    await setSession(userId, { mode: 'edit', step: 'value', lineupId, editField: field as AdminSession['editField'] })
    const prompt: Record<string, string> = { target: 'Отправь новое название цели:', title: 'Отправь новое название раскидки:', description: 'Отправь новое описание (или — чтобы очистить):' }
    await send(chatId, prompt[field], [[{ text: '✖ Отмена', callback_data: 'admin:cancel' }]])
    return
  }
  if (data.startsWith('admin:thumbnaildelete:')) {
    const lineupId = data.slice('admin:thumbnaildelete:'.length)
    const result = await pool.query(
      'UPDATE lineups SET telegram_thumbnail_file_id = NULL, telegram_thumbnail_mime_type = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [lineupId]
    )
    if (!result.rows.length) { await send(chatId, 'Раскидка не найдена.'); return }
    await send(chatId, '🗑 Превью удалено. Видео и раскидка не изменены.')
    await showLineup(chatId, lineupId)
    return
  }
  if (data.startsWith('admin:thumbnail:')) {
    const lineupId = data.slice('admin:thumbnail:'.length)
    const exists = await pool.query('SELECT id FROM lineups WHERE id = $1', [lineupId])
    if (!exists.rows.length) { await send(chatId, 'Раскидка не найдена.'); return }
    await setSession(userId, { mode: 'thumbnail', step: 'image', lineupId })
    await send(chatId, '🖼️ Отправь превью одним сообщением: фотографией или изображением как файл. Поддерживаются JPEG, PNG и WebP. Отправка нового изображения заменит текущее.', [[{ text: '✖ Отмена', callback_data: 'admin:cancel' }]])
    return
  }
  if (data.startsWith('admin:replace:')) {
    const lineupId = data.slice('admin:replace:'.length)
    const exists = await pool.query('SELECT id FROM lineups WHERE id = $1', [lineupId])
    if (!exists.rows.length) { await send(chatId, 'Раскидка не найдена.'); return }
    await setSession(userId, { mode: 'replace', step: 'video', lineupId })
    await send(chatId, 'Отправь новое видео одним сообщением. Старое видео останется, пока новое не будет опубликовано.', [[{ text: '✖ Отмена', callback_data: 'admin:cancel' }]])
    return
  }
  if (data.startsWith('admin:delete:')) {
    const lineupId = data.slice('admin:delete:'.length)
    const result = await pool.query('SELECT id, title, telegram_message_id FROM lineups WHERE id = $1', [lineupId])
    if (!result.rows.length) { await send(chatId, 'Раскидка не найдена.'); return }
    await send(chatId, `Удалить «${escapeHtml(result.rows[0].title)}»? Это действие нельзя отменить.`, [
      [{ text: '🗑 Удалить запись и видео', callback_data: `admin:deleteconfirm:${lineupId}` }],
      [{ text: 'Удалить только из каталога', callback_data: `admin:deleteforce:${lineupId}` }],
      [{ text: '✖ Отмена', callback_data: `admin:open:${lineupId}` }]
    ])
    return
  }
  if (data.startsWith('admin:deleteconfirm:')) {
    const lineupId = data.slice('admin:deleteconfirm:'.length)
    const result = await pool.query('SELECT telegram_message_id FROM lineups WHERE id = $1', [lineupId])
    if (!result.rows.length) { await send(chatId, 'Раскидка уже удалена.'); return }
    const messageId = result.rows[0].telegram_message_id
    if (messageId) {
      try { await deleteChannelMessage(Number(messageId)) }
      catch (error) {
        console.error('Could not delete Telegram channel post:', error)
        await send(chatId, '⚠️ Telegram не разрешил удалить публикацию. Запись в каталоге сохранена. Можно повторить позже или выбрать удаление только из каталога.', [
          [{ text: '🔁 Повторить', callback_data: `admin:deleteconfirm:${lineupId}` }],
          [{ text: 'Удалить только из каталога', callback_data: `admin:deleteforce:${lineupId}` }],
          [{ text: '⬅ К карточке', callback_data: `admin:open:${lineupId}` }]
        ])
        return
      }
    }
    await pool.query('DELETE FROM lineups WHERE id = $1', [lineupId])
    await send(chatId, '✅ Раскидка удалена из каталога и публикация удалена из канала.', [[{ text: '📚 Каталог', callback_data: 'admin:list:0' }, { text: '🏠 Меню', callback_data: 'admin:home' }]])
    return
  }
  if (data.startsWith('admin:deleteforce:')) {
    const lineupId = data.slice('admin:deleteforce:'.length)
    await pool.query('DELETE FROM lineups WHERE id = $1', [lineupId])
    await send(chatId, 'Запись удалена из каталога. Публикация в Telegram-канале могла остаться.', [[{ text: '📚 Каталог', callback_data: 'admin:list:0' }, { text: '🏠 Меню', callback_data: 'admin:home' }]])
  }
}

const handleAdminMessage = async (message: NonNullable<TelegramUpdate['message']>): Promise<void> => {
  const userId = message.from?.id
  const chatId = message.chat.id
  if (!userId) return
  const text = message.text?.trim() || ''
  if (text === '/id') {
    await send(chatId, `Ваш Telegram ID: <code>${userId}</code>`)
    return
  }
  if (text === '/start' && !isTelegramAdmin(userId)) {
    await sendStartMessage(chatId)
    return
  }
  if (text === '/start' || text === '/admin' || text === '/menu') {
    if (!isTelegramAdmin(userId)) {
      await send(chatId, hasTelegramAdminsConfigured() ? 'Административный доступ не предоставлен.' : 'Админка пока не настроена. Выполни /id и добавь свой ID в TELEGRAM_ADMIN_IDS на сервере.')
      return
    }
    await clearSession(userId)
    await mainMenu(chatId)
    return
  }
  if (!isTelegramAdmin(userId)) return
  if (text === '/cancel') {
    await clearSession(userId)
    await send(chatId, 'Действие отменено.', [[{ text: '🏠 В меню', callback_data: 'admin:home' }]])
    return
  }

  const state = await getSession(userId)
  if (!state) {
    if (message.video) await send(chatId, 'Чтобы добавить видео, сначала начни создание через /admin → «Добавить раскидку».')
    return
  }

  if (state.mode === 'thumbnail' && state.step === 'image' && state.lineupId) {
    const photo = message.photo?.[message.photo.length - 1]
    const document = message.document
    const isImageDocument = Boolean(document?.mime_type && ['image/jpeg', 'image/png', 'image/webp'].includes(document.mime_type))
    const fileId = photo?.file_id || (isImageDocument ? document?.file_id : undefined)
    const mimeType = photo ? 'image/jpeg' : (isImageDocument ? document?.mime_type : undefined)
    const fileSize = photo?.file_size ?? document?.file_size
    if (!fileId || !mimeType) {
      await send(chatId, '❌ Нужна фотография или файл JPEG, PNG или WebP. Попробуй ещё раз или напиши /cancel.')
      return
    }
    if (fileSize && fileSize > 10 * 1024 * 1024) {
      await send(chatId, '❌ Изображение больше 10 МБ. Отправь файл меньшего размера.')
      return
    }
    const saved = await pool.query(
      'UPDATE lineups SET telegram_thumbnail_file_id = $1, telegram_thumbnail_mime_type = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id',
      [fileId, mimeType, state.lineupId]
    )
    await clearSession(userId)
    if (!saved.rows.length) { await send(chatId, 'Раскидка не найдена.'); return }
    await send(chatId, '✅ Превью сохранено. Оно появится в карточке раскидки на сайте.', [[{ text: 'Открыть раскидку', callback_data: `admin:open:${state.lineupId}` }], [{ text: '🏠 Меню', callback_data: 'admin:home' }]])
    return
  }
  if (state.mode === 'search' && state.step === 'query' && text) {
    await clearSession(userId)
    await showList(chatId, 0, validText(text, 100))
    return
  }
  if (state.mode === 'create') {
    if (state.step === 'target' && text) {
      await setSession(userId, { ...state, step: 'title', target: validText(text, 255) })
      await send(chatId, 'Шаг 5/6. Напиши короткое название раскидки.')
      return
    }
    if (state.step === 'title' && text) {
      await setSession(userId, { ...state, step: 'description', title: validText(text, 255) })
      await send(chatId, 'Шаг 6/6. Напиши описание или отправь «—», чтобы пропустить.')
      return
    }
    if (state.step === 'description' && text) {
      await setSession(userId, { ...state, step: 'video', description: text === '—' ? '' : validText(text, 3000) })
      await send(chatId, 'Теперь отправь видео раскидки сообщением сюда в личный чат. После этого бот сам опубликует его в канале.')
      return
    }
    if (state.step === 'video' && message.video) {
      await createLineupWithVideo(chatId, userId, state, message.video.file_id, message.video.mime_type, message.video.file_size)
      return
    }
    if (state.step === 'video') {
      await send(chatId, 'Нужен именно видеофайл, отправленный как видео Telegram. Попробуй ещё раз или напиши /cancel.')
      return
    }
  }
  if (state.mode === 'replace' && state.step === 'video' && state.lineupId) {
    if (!message.video) { await send(chatId, 'Пришли новое видео сообщением или напиши /cancel.'); return }
    const old = await pool.query('SELECT telegram_message_id FROM lineups WHERE id = $1', [state.lineupId])
    if (!old.rows.length) { await clearSession(userId); await send(chatId, 'Раскидка не найдена.'); return }
    const lineup = await pool.query('SELECT map_id, side, title, description FROM lineups WHERE id = $1', [state.lineupId])
    const row = lineup.rows[0]
    let post: Awaited<ReturnType<typeof sendVideoToChannel>>
    try {
      post = await sendVideoToChannel(message.video.file_id, `${row.map_id.toUpperCase()} ${row.side} ${row.title}${row.description ? `\n${row.description}` : ''}`)
    } catch (error) {
      console.error('Failed to publish replacement video:', error)
      await send(chatId, '❌ Не удалось опубликовать новое видео. Старое видео и запись не изменены. Проверь права бота и повтори попытку.')
      return
    }
    await pool.query(
      `UPDATE lineups SET telegram_message_id = $1, telegram_file_id = $2, telegram_mime_type = $3,
       telegram_file_size = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
      [post.message_id, post.video?.file_id || message.video.file_id, message.video.mime_type || post.video?.mime_type || 'video/mp4', message.video.file_size ?? post.video?.file_size ?? null, state.lineupId]
    )
    await clearSession(userId)
    let oldDeleted = true
    if (old.rows[0].telegram_message_id) {
      try { await deleteChannelMessage(Number(old.rows[0].telegram_message_id)) } catch { oldDeleted = false }
    }
    await send(chatId, oldDeleted ? '✅ Видео заменено. ID раскидки сохранён.' : '✅ Новое видео опубликовано и привязано. ⚠️ Старую публикацию Telegram удалить не удалось; она может остаться в канале.', [[{ text: 'Открыть раскидку', callback_data: `admin:open:${state.lineupId}` }], [{ text: '🏠 Меню', callback_data: 'admin:home' }]])
    return
  }
  if (state.mode === 'edit' && state.step === 'value' && state.lineupId && state.editField && text) {
    const value = text === '—' && state.editField === 'description' ? null : validText(text, state.editField === 'description' ? 3000 : 255)
    if (state.editField !== 'description' && !value) { await send(chatId, 'Значение не должно быть пустым. Отправь текст ещё раз или /cancel.'); return }
    const column = state.editField
    await pool.query(`UPDATE lineups SET ${column} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [value, state.lineupId])
    await clearSession(userId)
    await send(chatId, '✅ Изменения сохранены.')
    await showLineup(chatId, state.lineupId)
  }
}

router.post('/webhook', async (req, res) => {
  const secret = getWebhookSecret()
  if (secret && req.get('X-Telegram-Bot-Api-Secret-Token') !== secret) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid Telegram webhook secret'))
  }

  const update = req.body as TelegramUpdate
  try {
    if (update.callback_query) {
      const callback = update.callback_query
      const userId = callback.from.id
      await answerCallbackQuery(callback.id)
      if (!isTelegramAdmin(userId)) return res.status(200).json({ ok: true, ignored: true })
      if (callback.message?.chat.type !== 'private' || !callback.data?.startsWith('admin:') && !callback.data?.startsWith('create_')) {
        return res.status(200).json({ ok: true, ignored: true })
      }
      await handleAdminCallback(userId, callback.message.chat.id, callback.data)
      return res.status(200).json({ ok: true })
    }

    if (update.message?.chat.type === 'private') {
      await handleAdminMessage(update.message)
      return res.status(200).json({ ok: true })
    }

    const post = update.channel_post
    if (!post || !post.video?.file_id) return res.status(200).json({ ok: true, ignored: true })
    const channelId = getConfiguredChannelId()
    if (!channelId || String(post.chat.id) !== channelId) {
      console.warn(`Ignoring Telegram post from unexpected channel: ${post.chat.id}`)
      return res.status(200).json({ ok: true, ignored: true })
    }
    const firstLine = post.caption?.split(/\r?\n/).map(line => line.trim()).find(Boolean)
    const lineupId = firstLine && /^[a-z0-9_-]+$/.test(firstLine) ? firstLine : undefined
    if (!lineupId) return res.status(200).json({ ok: true, ignored: true })
    const result = await pool.query(
      `UPDATE lineups SET telegram_message_id = $1, telegram_file_id = $2,
       telegram_mime_type = $3, telegram_file_size = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING id`,
      [post.message_id, post.video.file_id, post.video.mime_type || 'video/mp4', post.video.file_size ?? null, lineupId]
    )
    if (!result.rows.length) {
      console.warn(`Telegram video ${post.message_id} references unknown lineup: ${lineupId}`)
      return res.status(200).json({ ok: true, linked: false })
    }
    return res.status(200).json({ ok: true, linked: true, lineup_id: lineupId })
  } catch (error) {
    console.error('Error processing Telegram webhook:', error)
    return res.status(500).json(errorResponse('TELEGRAM_WEBHOOK_ERROR', 'Failed to process Telegram update'))
  }
})

router.get('/lineups/:id/thumbnail', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT telegram_thumbnail_file_id, telegram_thumbnail_mime_type FROM lineups WHERE id = $1',
      [req.params.id]
    )
    if (!result.rows.length) return res.status(404).json(errorResponse('NOT_FOUND', 'Lineup not found'))
    const lineup = result.rows[0]
    if (!lineup.telegram_thumbnail_file_id) return res.status(404).json(errorResponse('THUMBNAIL_NOT_FOUND', 'Thumbnail is not linked'))
    const file = await getTelegramFile(lineup.telegram_thumbnail_file_id)
    if (!file.file_path) return res.status(502).json(errorResponse('TELEGRAM_FILE_ERROR', 'Telegram did not return an image path'))
    const upstream = await streamTelegramFile(file.file_path, req.get('Range'))
    res.status(upstream.status === 206 ? 206 : 200)
    res.setHeader('Content-Type', lineup.telegram_thumbnail_mime_type || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    upstream.data.on('error', error => { console.error('Telegram thumbnail stream error:', error); if (!res.headersSent) res.status(502); res.end() })
    upstream.data.pipe(res)
  } catch (error: any) {
    console.error('Error streaming Telegram thumbnail:', error)
    if (error?.response?.status === 404) return res.status(404).json(errorResponse('TELEGRAM_FILE_NOT_FOUND', 'Telegram image file not found'))
    return res.status(502).json(errorResponse('TELEGRAM_ERROR', 'Failed to load Telegram thumbnail'))
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
