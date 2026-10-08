import { connect } from './database';
import { initializeDatabase } from './db/init';
import app from './app';
import { close } from './database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await connect();
    console.log('Database connected successfully');

    // Initialize database (migrations and seeds)
    console.log('Initializing database...');
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      throw new Error('Database initialization failed');
    }
    console.log('Database initialized successfully');

    // Start the server only after successful initialization
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export for use in other files
export { startServer };

// If this file is run directly (not imported), start the server
if (require.main === module) {
  startServer();
}