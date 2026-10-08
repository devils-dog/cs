import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import mapsRoutes from './routes/maps'
import lineupsRoutes from './routes/lineups'

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/maps', mapsRoutes)
app.use('/api/lineups', lineupsRoutes)

// Error handling
app.use(errorHandler)

export default app