import { OrderModel } from '../db/mongo';
import { Order } from './orders.model';

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'total' | 'status'>): Promise<Order> {
  const total = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const doc = await OrderModel.create({ ...data, total });
  return toOrder(doc);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const doc = await OrderModel.findById(id).exec();
  return doc ? toOrder(doc) : undefined;
}

export async function listOrders(): Promise<Order[]> {
  const docs = await OrderModel.find().exec();
  return docs.map(toOrder);
}

export async function updateOrder(id: string, items: Order['items']): Promise<Order | undefined> {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const doc = await OrderModel.findByIdAndUpdate(id, { items, total }, { new: true }).exec();
  return doc ? toOrder(doc) : undefined;
}

export async function cancelOrder(id: string): Promise<Order | undefined> {
  const doc = await OrderModel.findByIdAndUpdate(id, { status: 'CANCELLED' }, { new: true }).exec();
  return doc ? toOrder(doc) : undefined;
}

export async function searchOrdersByCustomer(customer: string): Promise<Order[]> {
  const docs = await OrderModel.find({ customerName: new RegExp(customer, 'i') }).exec();
  return docs.map(toOrder);
}

export async function getOrderStats(): Promise<{ count: number; totalRevenue: number; avgOrderValue: number }> {
  const docs = await OrderModel.find({}, 'total').exec();
  const count = docs.length;
  const totalRevenue = docs.reduce((sum, d: any) => sum + (d.total || 0), 0);
  const avgOrderValue = count === 0 ? 0 : parseFloat((totalRevenue / count).toFixed(2));
  return { count, totalRevenue, avgOrderValue };
}

interface OrderDocShape {
  _id: { toString(): string } | string;
  customerName: string;
  items: Order['items'];
  total: number;
  createdAt: Date;
  status: Order['status'];
}

function toOrder(doc: OrderDocShape): Order {
  return {
    id: doc._id.toString(),
    customerName: doc.customerName,
    items: doc.items,
    total: doc.total,
    createdAt: doc.createdAt.toISOString(),
    status: doc.status
  };
}
