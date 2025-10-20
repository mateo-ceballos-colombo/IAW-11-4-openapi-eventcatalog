import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import { ordersRouter } from './orders/orders.router';
import { errorHandler } from './common/error-handler';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Root metadata endpoint
  app.get('/', (_req, res) => {
    res.json({
      service: 'Order Service API',
      docs: '/docs',
      eventsCatalogDev: 'http://localhost:3000',
      version: '1.0.0'
    });
  });

  // Swagger UI
  const openapiPath = path.join(process.cwd(), 'openapi.yaml');
  if (fs.existsSync(openapiPath)) {
    const doc = yaml.parse(fs.readFileSync(openapiPath, 'utf-8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
  }

  app.use('/orders', ordersRouter);
  app.use(errorHandler);
  return app;
}
