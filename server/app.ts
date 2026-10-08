import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import mapsRoutes from './routes/maps'
import lineupsRoutes from './routes/lineups'

const app = express()

// Middleware
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes - fixing API routing to match plan requirements
app.use('/api/maps', mapsRoutes)
app.use('/api/lineups', lineupsRoutes)

// Error handling
app.use(errorHandler)

export default app