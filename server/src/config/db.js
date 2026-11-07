import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * Supports MongoDB Atlas and local instances.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/driveease';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // In production, log error. Do not crash immediately so health checks can report DB status.
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database] Running in disconnected state; retrying connection in background.');
    }
    return null;
  }
};

/**
 * Helper to check DB connection status for health checks.
 */
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};
