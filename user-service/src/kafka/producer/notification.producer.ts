import { producer, connectProducer } from "../../config/kafka";
import logger from "../../config/logger";
import { KAFKA_TOPICS } from "../../../../shared/constants/kafka-topics";

class NotificationProducer {
  private isInitialized: boolean;

  constructor() {
    this.isInitialized = false;
  }

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await connectProducer();
      this.isInitialized = true;
    }
  }

  async sendMessage(
    topic: string,
    key: string,
    value: Record<string, unknown>,
  ) {
    try {
      await this.initialize();

      const message = {
        topic,
        messages: [
          {
            key: key || `${topic}-${Date.now()}`,
            value: JSON.stringify(value),
            timeStamp: Date.now().toString(),
          },
        ],
      };

      const result = await producer.send(message);

      logger.info(`Message sent to kafka topic: ${topic}`, {
        key,
        partition: result[0].partition,
        offset: result[0].offset,
      });

      return result;
    } catch (error) {
      const err = error as Error;

      logger.error(`Failed to send message to kafka topic: ${topic}`, {
        error: err.message,
        stack: err.stack,
        key,
      });

      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: string, ttlMinutes: number = 5) {
    return this.sendMessage(KAFKA_TOPICS.OTP_EMAIL, `otp-${email}`, {
      email,
      otp,
      ttlMinutes,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    return this.sendMessage(KAFKA_TOPICS.WELCOME_EMAIL, `welcome-${email}`, {
      email,
      firstName,
    });
  }
}

export default new NotificationProducer();
