const express = require('express');
const { connect } = require('./server/database');
const errorHandler = require('./server/middleware/errorHandler').errorHandler;

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
const mapsRoutes = require('./server/routes/maps').default;
const lineupsRoutes = require('./server/routes/lineups').default;

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
      console.log(`API endpoints: http://localhost:${PORT}/api/maps, /api/maps/:id, /api/lineups/:id`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });