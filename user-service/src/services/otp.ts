import { randomUUID } from "crypto";
import { redisClient } from "../config/redis";

type OtpMeta = {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
};

export async function generateAndStoreOtp(meta: OtpMeta): Promise<{
  otp: string;
  otpSessionId: string;
}> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpSessionId = randomUUID();

  await redisClient.set(
    `otp:${otpSessionId}`,
    JSON.stringify({
      ...meta,
      otp,
    }),
    {
      EX: 300,
    },
  );

  return { otp, otpSessionId };
}
