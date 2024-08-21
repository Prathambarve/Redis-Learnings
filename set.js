const client = require('./client'); // This imports the 'ioredis' client instance

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {
  // SADD (Add one or more members to a set)
  await client.sadd('myset', 'member1');
  await client.sadd('myset', 'member2', 'member3', 'member4');
  console.log("SADD myset ->", await client.smembers('myset')); // Output: ['member1', 'member2', 'member3', 'member4']

  // SISMEMBER (Check if a member exists in the set)
  const isMember = await client.sismember('myset', 'member2');
  console.log("SISMEMBER myset member2 ->", isMember); // Output: 1 (true)

  // SMEMBERS (Get all the members of a set)
  const members = await client.smembers('myset');
  console.log("SMEMBERS myset ->", members); // Output: ['member1', 'member2', 'member3', 'member4']

  // SREM (Remove one or more members from a set)
  await client.srem('myset', 'member4');
  console.log("SREM myset ->", await client.smembers('myset')); // Output: ['member1', 'member2', 'member3']

  // SPOP (Remove and return a random member from the set)
  const poppedMember = await client.spop('myset');
  console.log("SPOP myset ->", poppedMember); // Output: A random member (e.g., 'member3')
  console.log("Set after SPOP ->", await client.smembers('myset'));

  // SRANDMEMBER (Get a random member from the set without removing it)
  const randomMember = await client.srandmember('myset');
  console.log("SRANDMEMBER myset ->", randomMember); // Output: A random member (e.g., 'member1')

  // SCARD (Get the number of members in the set)
  const setSize = await client.scard('myset');
  console.log("SCARD myset ->", setSize); // Output: The size of the set (e.g., 2)

  // SMOVE (Move a member from one set to another)
  await client.sadd('myset2', 'member5');
  await client.smove('myset', 'myset2', 'member1');
  console.log("SMOVE myset -> myset2, myset:", await client.smembers('myset')); // Output: Remaining members in 'myset'
  console.log("SMOVE myset -> myset2, myset2:", await client.smembers('myset2')); // Output: Members in 'myset2'

  // SUNION (Get the union of multiple sets)
  const unionSet = await client.sunion('myset', 'myset2');
  console.log("SUNION myset, myset2 ->", unionSet); // Output: Union of 'myset' and 'myset2'

  // SINTER (Get the intersection of multiple sets)
  await client.sadd('myset', 'member5');
  const intersectSet = await client.sinter('myset', 'myset2');
  console.log("SINTER myset, myset2 ->", intersectSet); // Output: Intersection of 'myset' and 'myset2'

  // SDIFF (Get the difference of multiple sets)
  const diffSet = await client.sdiff('myset', 'myset2');
  console.log("SDIFF myset, myset2 ->", diffSet); // Output: Difference of 'myset' and 'myset2'

  // SCARD (Get the number of members in a set)
  const card = await client.scard('myset');
  console.log("SCARD myset ->", card); // Output: Number of members in 'myset'

  // Clean up and disconnect
  await client.del('myset', 'myset2');
  await client.quit();
}

init().catch(console.error);
