const client = require('./client'); // This imports the 'ioredis' client instance

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function init() {
  // ZADD (Add one or more members to a sorted set, or update the score if it already exists)
  await client.zadd('myzset', 1, 'member1');
  await client.zadd('myzset', 2, 'member2');
  await client.zadd('myzset', 3, 'member3');
  console.log("ZADD myzset ->", await client.zrange('myzset', 0, -1, 'withscores')); 
  // Output: [ 'member1', '1', 'member2', '2', 'member3', '3' ]

  // ZSCORE (Get the score of a member in a sorted set)
  const score = await client.zscore('myzset', 'member2');
  console.log("ZSCORE myzset member2 ->", score); // Output: 2

  // ZRANGE (Get all the members in a sorted set within a given score range, with optional withscores)
  const members = await client.zrange('myzset', 0, -1, 'withscores');
  console.log("ZRANGE myzset ->", members); 
  // Output: [ 'member1', '1', 'member2', '2', 'member3', '3' ]

  // ZREVRANGE (Get all the members in a sorted set within a given range, sorted from highest to lowest score)
  const reversedMembers = await client.zrevrange('myzset', 0, -1, 'withscores');
  console.log("ZREVRANGE myzset ->", reversedMembers); 
  // Output: [ 'member3', '3', 'member2', '2', 'member1', '1' ]

  // ZREM (Remove one or more members from a sorted set)
  await client.zrem('myzset', 'member3');
  console.log("ZREM myzset ->", await client.zrange('myzset', 0, -1, 'withscores')); 
  // Output: [ 'member1', '1', 'member2', '2' ]

  // ZINCRBY (Increment the score of a member in a sorted set)
  await client.zincrby('myzset', 5, 'member1');
  console.log("ZINCRBY myzset member1 ->", await client.zscore('myzset', 'member1')); 
  // Output: 6

  // ZRANGEBYSCORE (Get all the members in a sorted set within a given score range)
  const rangeByScore = await client.zrangebyscore('myzset', 1, 10, 'withscores');
  console.log("ZRANGEBYSCORE myzset ->", rangeByScore); 
  // Output: [ 'member1', '6', 'member2', '2' ]

  // ZCARD (Get the number of members in a sorted set)
  const card = await client.zcard('myzset');
  console.log("ZCARD myzset ->", card); // Output: Number of members in the sorted set

  // ZPOPMIN (Remove and return the member with the lowest score from a sorted set)
  const poppedMin = await client.zpopmin('myzset');
  console.log("ZPOPMIN myzset ->", poppedMin); 
  // Output: [ [ 'member2', '2' ] ]

  // ZPOPMAX (Remove and return the member with the highest score from a sorted set)
  const poppedMax = await client.zpopmax('myzset');
  console.log("ZPOPMAX myzset ->", poppedMax); 
  // Output: [ [ 'member1', '6' ] ]

  // Clean up and disconnect
  await client.del('myzset');
  await client.quit();
}

init().catch(console.error);
