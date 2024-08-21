const client = require('./client'); // This imports the 'ioredis' client instance
const {Redis} = require('ioredis');

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function subscribe() {
  // Create a subscriber client
  const subscriber = new Redis(); // Create a new instance for subscribing

  subscriber.on('message', (channel, message) => {
    console.log(`Received message from channel "${channel}": ${message}`);
  });

  // Subscribe to the channel
  await subscriber.subscribe('news');
  console.log('Subscribed to the "news" channel.');

  // Keep the process alive to receive messages
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await subscriber.unsubscribe('news');
    await subscriber.quit();
    process.exit();
  });
}

subscribe().catch(console.error);
