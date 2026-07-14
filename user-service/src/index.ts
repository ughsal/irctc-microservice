import { app } from "./app";
import { env } from "./config/env";
import { connectRedis } from "./config/redis";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  try {
    await connectRedis();

    app.listen(env.port, () => {
      logger.info(`${env.serviceName} running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start user-service", error);
    process.exit(1);
  }
}

void bootstrap();
