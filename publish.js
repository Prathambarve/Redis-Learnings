const client = require('./client'); // This imports the 'ioredis' client instance

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function publish() {
  // Publish messages to a channel
  await client.publish('news', 'Hello, Redis Pub/Sub!');
  await client.publish('news', 'Another message on the news channel.');

  console.log('Messages published to the "news" channel.');

  // Clean up and disconnect
  await client.quit();
}

publish().catch(console.error);
