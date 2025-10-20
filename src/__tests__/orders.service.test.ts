import { createOrder, listOrders } from '../orders/orders.service';
jest.mock('../db/mongo', () => {
  const items: any[] = [];
  return {
    OrderModel: {
      create: (data: any) => { const doc = { ...data, _id: items.length + 1, createdAt: new Date(), status: 'CREATED' }; items.push(doc); return doc; },
      find: () => ({ exec: () => Promise.resolve(items) })
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
