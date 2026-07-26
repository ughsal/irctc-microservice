import { logger } from "../../utils/logger";
import { sendOtpEmail as sendResendOtpEmail, sendWelcomeEmail as sendResendWelcomeEmail } from "../../services/email";

export const notificationProducer = {
  async sendOtpEmail(email: string, otp: string, ttlMinutes: number): Promise<void> {
    await sendResendOtpEmail(email, otp, ttlMinutes);
    logger.info(`OTP email sent for ${email} with TTL ${ttlMinutes} minutes`);
  },

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await sendResendWelcomeEmail(email, firstName);
    logger.info(`Welcome email sent for ${email} (${firstName})`);
  },
};
