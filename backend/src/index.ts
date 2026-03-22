import { config } from './config';
import { Server } from './server';
import { logger } from './utils/logger';

// Set log level from config
logger.setLevel(config.logLevel);

// Create server instance
const server = new Server(config);

// Start server
server.start().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
  process.exit(1);
});
