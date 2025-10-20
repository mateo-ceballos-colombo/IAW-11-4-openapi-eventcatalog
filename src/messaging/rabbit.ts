import amqp from 'amqplib';

let channel: amqp.Channel | null = null;

export async function initRabbit() {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost';
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  await channel.assertExchange('orders', 'fanout', { durable: true });
  await setupConsumer();
  console.log('RabbitMQ initialized');
}

export async function publishOrderCreated(order: any) {
  if (!channel) {
    console.warn('RabbitMQ channel not ready, skipping publish');
    return;
  }
  const payload = Buffer.from(JSON.stringify(order));
  channel.publish('orders', '', payload, { type: 'OrderCreated', contentType: 'application/json' });
}

async function setupConsumer() {
  if (!channel) return;
  const q = await channel.assertQueue('orders.created.log', { durable: true });
  await channel.bindQueue(q.queue, 'orders', '');
  await channel.consume(q.queue, (msg: amqp.ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const order = JSON.parse(msg.content.toString());
      console.log('[Consumer] OrderCreated received:', order.id);
      channel!.ack(msg);
    } catch (e) {
      console.error('Failed to process message', e);
      channel!.nack(msg, false, false);
    }
  });
}
