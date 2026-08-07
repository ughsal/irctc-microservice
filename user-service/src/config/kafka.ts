import { Kafka, logLevel } from "kafkajs";
import logger from "./logger";
import config from "./";

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID ?? "user-service",
  brokers: [config.KAFKA_BROKER ?? "localhost:9093"],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 300,
    retries: 8,
    maxRetryTime: 3000,
  },
});
