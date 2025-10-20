import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  items: z.array(z.object({
    sku: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1)
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
