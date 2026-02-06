const { Redis } = require("@upstash/redis");

let redis = null;
console.log("REDIS URL", process.env.REDIS_URL);
console.log(
  "REDIS TOKEN LENGTH",
  process.env.REDIS_TOKEN?.length
);

try {
  redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
  });


} catch (err) {
  console.error(" Redis init failed:", err.message);
}

module.exports = redis;
