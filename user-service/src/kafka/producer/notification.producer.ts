import { logger } from "../../utils/logger";

export const notificationProducer = {
  async sendOtpEmail(email: string, otp: string, ttlMinutes: number): Promise<void> {
    logger.info(`OTP email queued for ${email} with TTL ${ttlMinutes} minutes`);
    logger.info(`OTP value: ${otp}`);
  },

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    logger.info(`Welcome email queued for ${email} (${firstName})`);
  },
};
