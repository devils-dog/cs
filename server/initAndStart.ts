import { initializeDatabase } from './db/init';
import app from './app';
import { close } from './database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(async () => {
        await close();
        process.exit(0);
      });
    };

    process.once('SIGTERM', () => void shutdown('SIGTERM'));
    process.once('SIGINT', () => void shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

export { startServer };

if (require.main === module) {
  startServer();
}
