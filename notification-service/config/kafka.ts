// import { Kafka, logLevel } from "kafkajs";
// import logger from "./logger";
// import config from "./";

// const kafka = new Kafka({
//   clientId: config.KAFKA_CLIENT_ID ?? "notification-service",
//   brokers: [config.KAFKA_BROKER ?? "localhost:9093"],
//   logLevel: logLevel.ERROR,
//   retry: {
//     initialRetryTime: 300,
//     retries: 8,
//     maxRetryTime: 3000,
//   },
// });

// const producer = kafka.producer({
//   allowAutoTopicCreation: true,
//   transactionTimeout: 30000,
//   idempotent: true,
//   maxInFlightRequests: 1,
//   retry: {
//     retries: 5,
//   },
// });

// let isConnected = false;

// const connectProducer = async () => {
//   if (!isConnected) {
//     await producer.connect();
//     isConnected = true;
//     logger.info("Kafka producer connected");
//   }
// };

// const disconnectProducer = async () => {
//   if (isConnected) {
//     await producer.disconnect();
//     isConnected = false;
//     logger.info("Kafka producer disconnected");
//   }
// };

// process.on("SIGTERM", disconnectProducer);
// process.on("SIGINT", disconnectProducer);

// export { producer, connectProducer, disconnectProducer };
