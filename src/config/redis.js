const { Redis } = require("@upstash/redis");

let redis = null;
try {
  redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
  });


} catch (err) {
  console.error(" Redis init failed:", err.message);
}

module.exports = redis;
