import dotenv from 'dotenv';
import { createApp } from './app';
import { initRabbit } from './messaging/rabbit';
import { connectMongo } from './db/mongo';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 3100;

async function start() {
  await connectMongo();
  if (process.env.DISABLE_RABBITMQ !== 'true') {
    await initRabbit();
  }
  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });

  async function shutdown(signal: string) {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed');
    });
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (e) {
      console.error('Error closing MongoDB connection', e);
    }
    process.exit(0);
  }

  ['SIGINT','SIGTERM'].forEach(sig => {
    process.on(sig as NodeJS.Signals, () => {
      shutdown(sig);
    });
  });
}

start().catch(err => {
  console.error('Failed to start application', err);
  process.exit(1);
});
