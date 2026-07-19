import { createClient, type RedisClientType } from "redis";
import { env } from "./env";
import { logger } from "../utils/logger";

class RedisClient {
  private static instance: RedisClientType | undefined;
  private static isConnected = false;

  private constructor() {
    // prevent direct instantiation
  }

  static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: env.redisUrl,
      });

      RedisClient.setupEventListeners();
    }

    return RedisClient.instance;
  }

  private static setupEventListeners(): void {
    const client = RedisClient.instance;

    if (!client) {
      return;
    }

    client.on("connect", () => {
      RedisClient.isConnected = true;
      logger.info("Connected to Redis");
    });

    client.on("error", (error) => {
      RedisClient.isConnected = false;
      logger.error("Redis connection error", error);
    });

    client.on("close", () => {
      RedisClient.isConnected = false;
      logger.warn("Redis connection closed");
    });

    client.on("reconnecting", () => {
      logger.warn("Reconnecting to Redis...");
    });

    client.on("ready", () => {
      logger.warn("Redis client is ready");
    });

    client.on("end", () => {
      RedisClient.isConnected = false;
      logger.warn("Redis connection ended");
    });
  }

  static async connect(): Promise<void> {
    const client = RedisClient.getInstance();

    if (!client.isOpen) {
      await client.connect();
    }
  }

  static isReady(): boolean {
    return RedisClient.isConnected;
  }
}

export const redisClient = RedisClient.getInstance();

export async function connectRedis(): Promise<void> {
  await RedisClient.connect();
}

export { RedisClient };
