import app from './app'
import { connect } from './database'

const PORT = process.env.PORT || 3000

// Connect to database before starting server
async function startServer() {
  try {
    await connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();