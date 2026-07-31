import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { logger } from "../utils/logger";
import { AppError } from "../utils/error";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("========== ERROR ==========");
  console.error(error);

  if (error instanceof Error) {
    console.error(error.stack);
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  logger.error("Unhandled error", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
