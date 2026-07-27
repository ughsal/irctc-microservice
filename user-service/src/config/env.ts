const parseOrigins = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

export const env = {
  port: Number(process.env.PORT ?? 4001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  serviceName: process.env.SERVICE_NAME ?? "user-service",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgres://admin:irctcpass@localhost:5432/user_service_database",
  redisUrl: process.env.REDIS_URL ?? "redis://:irctcpass@localhost:6379",
  // kafkaBroker: process.env.KAFKA_BROKER ?? "localhost:9093",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  accessTokenExp: process.env.ACCESS_TOKEN_EXP,
  refreshTokenExp: process.env.REFRESH_TOKEN_EXP,
  accessTokenExpSec: Number(process.env.ACCESS_TOKEN_EXP_SEC),
  refreshTokenExpSec: Number(process.env.REFRESH_TOKEN_EXP_SEC),
  otpTtl: Number(process.env.OTP_TTL),
  otpHmacSecret: process.env.OTP_HMAC_SECRET,
  otpRateMaxPerHour: Number(process.env.OTP_RATE_MAX_PER_HOUR),
  otpMaxVerifyAttempts: Number(process.env.OTP_MAX_VERIFY_ATTEMPTS),
  resendApiKey: process.env.RESEND_API_KEY,
  mailSend: process.env.MAIL_SEND,
  redisUserTtl: Number(process.env.REDIS_USER_TTL ?? 86400),
  internalServiceKey: process.env.INTERNAL_SERVICE_KEY,
  allowedOrigins: parseOrigins(
    process.env.ALLOWED_ORIGINS ??
      "http://localhost:4000,http://localhost:4001,http://localhost:4005",
  ),
};
