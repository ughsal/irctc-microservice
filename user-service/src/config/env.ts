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
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "your_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "your_refresh_secret",
  accessTokenExp: process.env.ACCESS_TOKEN_EXP ?? "15m",
  refreshTokenExp: process.env.REFRESH_TOKEN_EXP ?? "7d",
  accessTokenExpSec: Number(process.env.ACCESS_TOKEN_EXP_SEC ?? 900),
  refreshTokenExpSec: Number(process.env.REFRESH_TOKEN_EXP_SEC ?? 604800),
  otpTtl: Number(process.env.OTP_TTL ?? 300),
  otpHmacSecret: process.env.OTP_HMAC_SECRET ?? "your_64_char_hex",
  otpRateMaxPerHour: Number(process.env.OTP_RATE_MAX_PER_HOUR ?? 5),
  otpMaxVerifyAttempts: Number(process.env.OTP_MAX_VERIFY_ATTEMPTS ?? 5),
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? "SG.your_key",
  internalServiceKey:
    process.env.INTERNAL_SERVICE_KEY ?? "your_shared_internal_service_key",
  allowedOrigins: parseOrigins(
    process.env.ALLOWED_ORIGINS ??
      "http://localhost:4000,http://localhost:4001,http://localhost:4005",
  ),
};
