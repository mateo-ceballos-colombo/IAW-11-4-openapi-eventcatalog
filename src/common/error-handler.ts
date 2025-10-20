import { Request, Response } from 'express';
interface AppError extends Error { status?: number; statusCode?: number; details?: unknown }
export function errorHandler(err: AppError, _req: Request, res: Response) {
  const status = (err.statusCode || err.status) && Number.isInteger(err.statusCode || err.status) ? (err.statusCode || err.status)! : 500;
  console.error(err.message, err.details || '');
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
