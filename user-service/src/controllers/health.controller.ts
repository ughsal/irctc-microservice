import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import config from "../config";
import { redisClient } from "../config/redis";

export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const redisStatus = redisClient.isReady ? "ready" : "not-ready";

  res.status(200).json({
    status: "ok",
    service: config.SERVICE_NAME,
    uptime: process.uptime(),
    redis: redisStatus,
  });
});
