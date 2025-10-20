export interface Order {
  id: string;
  customerName: string;
  items: Array<{ sku: string; quantity: number; price: number }>;
  total: number;
  createdAt: string;
  status: 'CREATED' | 'CANCELLED';
}
