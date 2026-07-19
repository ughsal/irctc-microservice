import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { AppError } from "../utils/error";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  logger.error("Unhandled error", error);

  if (env.nodeEnv !== "production") {
    logger.error(
      `${req.method} ${req.originalUrl}`,
      error instanceof Error ? error.stack : undefined,
    );
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
