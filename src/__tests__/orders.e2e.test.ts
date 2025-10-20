import request from 'supertest';
import { createApp } from '../app';
import * as service from '../orders/orders.service';

jest.mock('../db/mongo', () => {
  const data: any[] = [];
  return {
    OrderModel: {
      create: (d: any) => { const doc = { ...d, _id: (data.length+1).toString(), createdAt: new Date(), status: 'CREATED', items: d.items }; data.push(doc); return doc; },
      find: () => ({ exec: () => Promise.resolve(data) }),
      findById: (id: string) => ({ exec: () => Promise.resolve(data.find(d => d._id === id) || null) }),
      findByIdAndUpdate: (id: string, update: any) => ({ exec: () => { const idx = data.findIndex(d => d._id === id); if (idx === -1) return Promise.resolve(null); data[idx] = { ...data[idx], ...update }; return Promise.resolve(data[idx]); } })
    }
  };
});

const app = createApp();

describe('Orders E2E', () => {
  test('POST /orders creates order', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ customerName: 'E2E', items: [{ sku: 'SKU1', quantity: 1, price: 5 }] });
    expect(res.status).toBe(201);
    expect(res.body.total).toBe(5);
  });

  test('GET /orders lists orders', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /orders/:id returns order', async () => {
    const created = await service.createOrder({ customerName: 'Find', items: [{ sku: 'S', quantity: 1, price: 2 }] });
    const res = await request(app).get(`/orders/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
  });

  test('PUT /orders/:id updates items', async () => {
    const created = await service.createOrder({ customerName: 'Upd', items: [{ sku: 'A', quantity: 1, price: 3 }] });
    const res = await request(app).put(`/orders/${created.id}`).send({ items: [{ sku: 'A', quantity: 2, price: 3 }] });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(6);
  });

  test('DELETE /orders/:id cancels order', async () => {
    const created = await service.createOrder({ customerName: 'Del', items: [{ sku: 'D', quantity: 1, price: 4 }] });
    const res = await request(app).delete(`/orders/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });

  test('GET /orders/search finds by customer', async () => {
    await service.createOrder({ customerName: 'Maria Lopez', items: [{ sku: 'S', quantity: 1, price: 2 }] });
    const res = await request(app).get('/orders/search?customer=maria');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
