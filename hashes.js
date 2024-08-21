const client = require('./client'); // This imports the 'ioredis' client instance

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {
  // HSET (Set the string value of a hash field)
  await client.hset('myhash', 'field1', 'value1');
  await client.hset('myhash', 'field2', 'value2');
  console.log("HSET myhash ->", await client.hgetall('myhash')); // Output: { field1: 'value1', field2: 'value2' }

  // HGET (Get the value of a hash field)
  const field1Value = await client.hget('myhash', 'field1');
  console.log("HGET myhash field1 ->", field1Value); // Output: 'value1'

  // HMGET (Get the values of multiple hash fields)
  const values = await client.hmget('myhash', 'field1', 'field2');
  console.log("HMGET myhash field1, field2 ->", values); // Output: ['value1', 'value2']

  // HDEL (Delete one or more hash fields)
  await client.hdel('myhash', 'field2');
  console.log("HDEL myhash ->", await client.hgetall('myhash')); // Output: { field1: 'value1' }

  // HINCRBY (Increment the integer value of a hash field by the given number)
  await client.hset('myhash', 'counter', 10);
  await client.hincrby('myhash', 'counter', 5);
  console.log("HINCRBY myhash counter ->", await client.hget('myhash', 'counter')); // Output: 15

  // HKEYS (Get all the fields in a hash)
  const fields = await client.hkeys('myhash');
  console.log("HKEYS myhash ->", fields); // Output: ['field1', 'counter']

  // HVALS (Get all the values in a hash)
  const valuesInHash = await client.hvals('myhash');
  console.log("HVALS myhash ->", valuesInHash); // Output: ['value1', '15']

  // HGETALL (Get all the fields and values in a hash)
  const hashContents = await client.hgetall('myhash');
  console.log("HGETALL myhash ->", hashContents); // Output: { field1: 'value1', counter: '15' }

  // HEXISTS (Check if a hash field exists)
  const fieldExists = await client.hexists('myhash', 'field1');
  console.log("HEXISTS myhash field1 ->", fieldExists); // Output: 1 (true)

  // HLEN (Get the number of fields in a hash)
  const hashLength = await client.hlen('myhash');
  console.log("HLEN myhash ->", hashLength); // Output: Number of fields in the hash

  // Clean up and disconnect
  await client.del('myhash');
  await client.quit();
}

init().catch(console.error);
