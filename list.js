const Redis = require('ioredis');
const client = new Redis();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {

  // LPUSH (push one or more elements to the head of the list)
  await client.lpush('mylist', 'first');
  await client.lpush('mylist', 'second', 'third');
  const listAfterLPush = await client.lrange('mylist', 0, -1);
  console.log("LPUSH mylist ->", listAfterLPush); // Output: ['third', 'second', 'first']

  // RPUSH (push one or more elements to the tail of the list)
  await client.rpush('mylist', 'fourth');
  await client.rpush('mylist', 'fifth', 'sixth');
  const listAfterRPush = await client.lrange('mylist', 0, -1);
  console.log("RPUSH mylist ->", listAfterRPush); // Output: ['third', 'second', 'first', 'fourth', 'fifth', 'sixth']

  // LPOP (pop an element from the head of the list)
  const lpopValue = await client.lpop('mylist');
  console.log("LPOP mylist ->", lpopValue); // Output: 'third'
  const listAfterLPop = await client.lrange('mylist', 0, -1);
  console.log("List after LPOP ->", listAfterLPop); // Output: ['second', 'first', 'fourth', 'fifth', 'sixth']

  // RPOP (pop an element from the tail of the list)
  const rpopValue = await client.rpop('mylist');
  console.log("RPOP mylist ->", rpopValue); // Output: 'sixth'
  const listAfterRPop = await client.lrange('mylist', 0, -1);
  console.log("List after RPOP ->", listAfterRPop); // Output: ['second', 'first', 'fourth', 'fifth']

  // LRANGE (get a range of elements from the list)
  const listRange = await client.lrange('mylist', 0, 2);
  console.log("LRANGE mylist 0-2 ->", listRange); // Output: ['second', 'first', 'fourth']

  // LINDEX (get an element by its index)
  const lindexValue = await client.lindex('mylist', 1);
  console.log("LINDEX mylist 1 ->", lindexValue); // Output: 'first'

  // LINSERT (insert an element before or after another element)
  await client.linsert('mylist', 'BEFORE', 'first', 'zero');
  const listAfterLInsert = await client.lrange('mylist', 0, -1);
  console.log("LINSERT mylist ->", listAfterLInsert); // Output: ['second', 'zero', 'first', 'fourth', 'fifth']

  // LSET (set the value of an element at a specific index)
  await client.lset('mylist', 2, 'new_first');
  const listAfterLSet = await client.lrange('mylist', 0, -1);
  console.log("LSET mylist ->", listAfterLSet); // Output: ['second', 'zero', 'new_first', 'fourth', 'fifth']

  // LLEN (get the length of the list)
  const listLength = await client.llen('mylist');
  console.log("LLEN mylist ->", listLength); // Output: 5

  // LREM (remove elements from the list)
  await client.lrem('mylist', 1, 'fifth');
  const listAfterLRem = await client.lrange('mylist', 0, -1);
  console.log("LREM mylist ->", listAfterLRem); // Output: ['second', 'zero', 'new_first', 'fourth']

  // LTRIM (trim the list to the specified range)
  await client.ltrim('mylist', 1, 2);
  const listAfterLTrim = await client.lrange('mylist', 0, -1);
  console.log("LTRIM mylist ->", listAfterLTrim); // Output: ['zero', 'new_first']

  // Clean up and disconnect
  await client.quit();
}

init().catch(console.error);
