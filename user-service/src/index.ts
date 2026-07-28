import { app } from "./app";
import config from "./config";
import { connectRedis } from "./config/redis";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  try {
    await connectRedis();

    app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start user-service", error);
    process.exit(1);
  }
}

void bootstrap();
