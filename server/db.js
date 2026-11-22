import mongoose from 'mongoose';

const SERVER_SELECTION_TIMEOUT_MS = 5000;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] could not connect: Missing MONGODB_URI in server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    });
    console.log('[DB] connected to MongoDB');
  } catch (error) {
    console.error(`[DB] could not connect: ${error.message}`);
    process.exit(1);
  }
}
