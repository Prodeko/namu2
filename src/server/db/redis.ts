import { createClient } from "redis";

console.info("Connecting to Redis port...", Number(process.env.REDIS_PORT));
const redisClient = createClient({
  // password: process.env.REDIS_PASSWORD,
  socket: {
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis client error", err));
redisClient.on("connect", () => console.info("Redis client connecting"));
redisClient.on("ready", () => console.info("Redis client connected and ready"));
redisClient.on("end", () => console.info("Redis client disconnected"));

redisClient
  .connect()
  .then(() => console.info("Redis client successfully connected"))
  .catch((err) => console.error("Redis client connection error", err));

export { redisClient };
