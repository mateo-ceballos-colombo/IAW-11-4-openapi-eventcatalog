import { Router, Request, Response } from 'express';
import { createOrderSchema } from './orders.validation';
import { createOrder, getOrder, listOrders, updateOrder, cancelOrder, searchOrdersByCustomer } from './orders.service';
import { publishOrderCreated } from '../messaging/rabbit';

export const ordersRouter = Router();

ordersRouter.post('/', async (req: Request, res: Response) => {
  const parse = createOrderSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ errors: parse.error.issues });
  }
  const order = await createOrder(parse.data);
  await publishOrderCreated(order);
  res.status(201).json(order);
});

ordersRouter.get('/search', async (req: Request, res: Response) => {
  const customer = req.query.customer as string | undefined;
  if (!customer) return res.status(400).json({ error: 'customer query param required' });
  const results = await searchOrdersByCustomer(customer);
  res.json(results);
});

ordersRouter.get('/:id', async (req: Request, res: Response) => {
  const order = await getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

ordersRouter.get('/', async (_req: Request, res: Response) => {
  const orders = await listOrders();
  res.json(orders);
});

ordersRouter.put('/:id', async (req: Request, res: Response) => {
  const items = req.body.items;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  const updated = await updateOrder(req.params.id, items);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

ordersRouter.delete('/:id', async (req: Request, res: Response) => {
  const cancelled = await cancelOrder(req.params.id);
  if (!cancelled) return res.status(404).json({ error: 'Not found' });
  // TODO: publish OrderCancelled event similar to OrderCreated
  res.json(cancelled);
});
