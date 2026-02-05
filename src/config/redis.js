const { createClient } = require("redis");

let client = null;

if (process.env.REDIS_URL) {
  client = createClient({
    url: process.env.REDIS_URL
  });

  client.on("connect", () => console.log("Redis Connected"));
  client.on("error", (err) => console.log("Redis Error:", err.message));

  client.connect().catch(() => {
    console.log("Redis failed, running without cache");
    client = null;
  });
} else {
  console.log("Redis disabled (no REDIS_URL)");
}

module.exports = client;
