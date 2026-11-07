import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 DriveEase Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server] Graceful shutdown initiated. Closing HTTP server...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
