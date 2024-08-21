const client = require('./client');

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {
 
  // SET a value
  await client.set('user:1', 'Alice');
  await client.set('user:2', 'Bob');

  // GET a value
  const user1 = await client.get('user:1');
  console.log("GET user:1 ->", user1); // Output: Alice

  // MSET multiple values
  await client.mset({
    'user:3': 'Charlie',
    'user:4': 'Dave'
  });

  // MGET multiple values
  const users = await client.mget('user:1', 'user:2', 'user:3', 'user:4');
  console.log("MGET ->", users); // Output: ['Alice', 'Bob', 'Charlie', 'Dave']

  // INCR (increment a value)
  await client.set('counter', 10);  // Set initial value
  await client.incr('counter');
  const counterAfterIncr = await client.get('counter');
  console.log("INCR counter ->", counterAfterIncr); // Output: 11

  // DECR (decrement a value)
  await client.decr('counter');
  const counterAfterDecr = await client.get('counter');
  console.log("DECR counter ->", counterAfterDecr); // Output: 10

  // APPEND (append a string to an existing value)
  await client.append('user:1', ' Smith');
  const user1AfterAppend = await client.get('user:1');
  console.log("APPEND user:1 ->", user1AfterAppend); // Output: Alice Smith

  // STRLEN (get the length of a string)
  const user1Length = await client.strlen('user:1');
  console.log("STRLEN user:1 ->", user1Length); // Output: 11

  // Clean up and disconnect
  await client.quit();
}

init().catch(console.error);
