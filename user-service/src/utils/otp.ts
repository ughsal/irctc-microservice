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
  const sessionKey = `otp:session:${otpSessionId}`;
  const rawSession = await redisClient.get(sessionKey);

  if (!rawSession) {
    return null;
  }

  const session = JSON.parse(rawSession) as OtpSessionRecord;

  const attemptsKey = `otp:attempts:${otpSessionId}`;

  const attemptsCount = parseInt(
    (await redisClient.get(attemptsKey)) ?? "0",
    10,
  );

  if (attemptsCount >= config.OTP_MAX_VERIFY_ATTEMPTS) {
    throw new TooManyRequestsError(
      "Too many OTP verification attempts. Try again later.",
    );
  }

  const submittedOtpHash = hmacFor(session.meta.email, otp);

  const submittedHashBuffer = Buffer.from(submittedOtpHash, "hex");
  const storedHashBuffer = Buffer.from(session.hashedOtp, "hex");

  const otpMatches =
    submittedHashBuffer.length === storedHashBuffer.length &&
    crypto.timingSafeEqual(submittedHashBuffer, storedHashBuffer);

  if (!otpMatches) {
    const updatedAttempts = await redisClient.incr(attemptsKey);

    if (updatedAttempts === 1) {
      await redisClient.expire(attemptsKey, config.OTP_TTL);
    }

    if (updatedAttempts >= config.OTP_MAX_VERIFY_ATTEMPTS) {
      await redisClient.del(sessionKey);
    }

    return null;
  }

  // OTP is valid and must not be reusable
  await redisClient.del([sessionKey, attemptsKey]);

  return session.meta;
}
