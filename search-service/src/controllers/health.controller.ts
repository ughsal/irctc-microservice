import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import { redisClient } from "../config/redis";

export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: env.serviceName,
    uptime: process.uptime(),
    redis: redisClient.isReady ? "ready" : "not-ready",
  });
});

