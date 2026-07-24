import crypto from "crypto";
import otpGenerator from "otp-generator";

import { TooManyRequestsError } from "./errors";
import { redisClient } from "../config/redis";
import config from "../config";

interface OtpMeta {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
}

type OtpSessionRecord = {
  hashedOtp: string;
  meta: OtpMeta;
};

function hmacFor(email: string, otp: string): string {
  return crypto
    .createHmac("sha256", config.OTP_HMAC_SECRET!)
    .update(`${email}:${otp}`)
    .digest("hex");
}

export async function generateAndStoreOtp(
  meta: OtpMeta,
): Promise<{ otp: string; otpSessionId: string }> {
  // Rate limiting: maximum OTPs per hour
  const rateKey = `otp:rate:${meta.email}`;

  const sentCount = parseInt((await redisClient.get(rateKey)) ?? "0", 10);

  if (sentCount >= config.OTP_RATE_MAX_PER_HOUR) {
    throw new TooManyRequestsError("Too many OTP requests. Try again later.");
  }

  // Generate a 6-digit numeric OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otpSessionId = crypto.randomUUID();
  const hashedOtp = hmacFor(meta.email, otp);

  // Store OTP session
  await redisClient.set(
    `otp:session:${otpSessionId}`,
    JSON.stringify({
      hashedOtp,
      meta,
    }),
    {
      EX: config.OTP_TTL,
    },
  );

  // Increment rate limiter
  await redisClient
    .multi()
    .incr(rateKey)
    .expire(rateKey, 60 * 60)
    .exec();

  return {
    otp,
    otpSessionId,
  };
}

export async function verifyOtp(
  otp: string,
  otpSessionId: string,
): Promise<OtpMeta | null> {
  const rawSession = await redisClient.get(`otp:session:${otpSessionId}`);

  if (!rawSession) {
    return null;
  }

  const session = JSON.parse(rawSession) as OtpSessionRecord;
  const hashedOtp = hmacFor(session.meta.email, otp);

  if (hashedOtp !== session.hashedOtp) {
    return null;
  }

  await redisClient.del(`otp:session:${otpSessionId}`);

  return session.meta;
}
