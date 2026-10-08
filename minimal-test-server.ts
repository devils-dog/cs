import express from 'express';
import { connect } from './server/database';
import { errorHandler } from './server/middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ 
    message: 'CS2 Nades Mini App Server is running!',
    status: 'OK'
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
import mapsRoutes from './server/routes/maps';
import lineupsRoutes from './server/routes/lineups';

app.use('/api/maps', mapsRoutes);
app.use('/api/lineups', lineupsRoutes);

// Error handling
app.use(errorHandler);

// Connect to database and start server
connect()
  .then(() => {
    console.log('Connected to database successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Test endpoint: http://localhost:${PORT}/test`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

export default app;