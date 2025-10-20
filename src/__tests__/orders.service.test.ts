import { createOrder, listOrders } from '../orders/orders.service';
import { Order } from '../orders/orders.model';
jest.mock('../db/mongo', () => {
  type Doc = { _id: string | number; customerName: string; items: Order['items']; createdAt: Date; status: 'CREATED' | 'CANCELLED'; total: number };
  const docs: Doc[] = [];
  return {
    OrderModel: {
      create: (data: { customerName: string; items: Order['items'] }) => { const total = data.items.reduce((s,i)=>s+i.price*i.quantity,0); const doc: Doc = { ...data, _id: (docs.length+1), createdAt: new Date(), status: 'CREATED', total }; docs.push(doc); return doc; },
      find: () => ({ exec: () => Promise.resolve(docs) })
    }
  };
});

describe('Orders Service (mock mongo)', () => {
  test('creates order with total', async () => {
    const order = await createOrder({
      customerName: 'Test',
      items: [{ sku: 'X', quantity: 2, price: 10 }]
    });
    expect(order.total).toBe(20);
    const all = await listOrders();
    expect(all.some(o => o.id === order.id)).toBe(true);
  });
});
