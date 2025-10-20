import dotenv from 'dotenv';
import { createApp } from './app';
import { initRabbit } from './messaging/rabbit';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  if (process.env.DISABLE_RABBITMQ !== 'true') {
    await initRabbit();
  }
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start application', err);
  process.exit(1);
});
