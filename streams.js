const client = require('./client'); // This imports the 'ioredis' client instance

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {
  // XADD (Add a new entry to the stream)
  await client.xadd('mystream', '*', 'field1', 'value1');
  await client.xadd('mystream', '*', 'field2', 'value2');
  console.log("XADD mystream ->", await client.xrange('mystream', 0, -1));

  // XRANGE (Retrieve entries from the stream within a given range)
  const range = await client.xrange('mystream', 0, -1);
  console.log("XRANGE mystream ->", range);

  // XREVRANGE (Retrieve entries from the stream within a given range in reverse order)
  const revRange = await client.xrevrange('mystream', '+', '-', 'COUNT', 10);
  console.log("XREVRANGE mystream ->", revRange);

  // XREAD (Read data from one or multiple streams, blocking or non-blocking)
  const xread = await client.xread('BLOCK', 0, 'STREAMS', 'mystream', '$');
  console.log("XREAD mystream ->", xread);

  // XDEL (Delete specific entries from a stream by ID)
  const [stream, count] = await client.xdel('mystream', '1681284007233-0'); // Use actual entry IDs here
  console.log(`XDEL mystream -> Deleted ${count} entries`);

  // XACK (Acknowledge one or more messages as processed by a consumer group)
  // Create a consumer group
  await client.xgroup('CREATE', 'mystream', 'mygroup', '$', 'MKSTREAM');
  await client.xack('mystream', 'mygroup', '1681284007233-0');
  console.log("XACK mystream -> Acknowledged message");

  // XGROUP (Create, destroy, or set the configuration of a consumer group)
  await client.xgroup('DESTROY', 'mystream', 'mygroup');
  console.log("XGROUP mystream -> Destroyed the consumer group");

  // XTRIM (Trim the stream to the specified length)
  await client.xtrim('mystream', 5, 'MAXLEN');
  console.log("XTRIM mystream -> Trimmed the stream");

  // Clean up and disconnect
  await client.del('mystream');
  await client.quit();
}

init().catch(console.error);
