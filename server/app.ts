import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import mapsRoutes from './routes/maps'
import lineupsRoutes from './routes/lineups'
import telegramRoutes from './routes/telegram'

const app = express()
app.use(express.json({ limit: '256kb' }))

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
})

app.use('/api/maps', mapsRoutes)
app.use('/api/lineups', lineupsRoutes)
app.use('/api/telegram', telegramRoutes)
app.use(errorHandler)

export default app
