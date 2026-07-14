const parseOrigins = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  port: Number(process.env.PORT ?? 4002),
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  serviceName: process.env.SERVICE_NAME ?? "search-service",
  redisUrl: process.env.REDIS_URL ?? "redis://:irctcpass@redis:6379",
  allowedOrigins: parseOrigins(
    process.env.ALLOWED_ORIGINS ??
      "http://localhost:4000,http://localhost:4001,http://localhost:4002",
  ),
};
