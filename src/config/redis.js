const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL
});
client.on("connect", () => {
  console.log("Redis Connected");
});
client.on("error", (err) => {
  console.log("Redis Error:", err.message);
});
(async () => {
  await client.connect();
})();

module.exports = client;
