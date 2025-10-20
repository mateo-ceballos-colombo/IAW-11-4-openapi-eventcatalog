import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ordersdb';

export async function connectMongo() {
  await mongoose.connect(MONGO_URL);
  console.log('MongoDB connected');
}

const orderItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: () => new Date() },
  status: { type: String, enum: ['CREATED', 'CANCELLED'], default: 'CREATED' }
});

export const OrderModel = mongoose.model('Order', orderSchema);
