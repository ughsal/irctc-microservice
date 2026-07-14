import { createClient } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on("error", (error) => {
  logger.error("Redis client error", error);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

