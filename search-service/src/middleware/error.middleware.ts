import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";
import { logger } from "../utils/logger";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("Internal server error", 500);

  logger.error(appError.message, error);

  res.status(appError.statusCode).json({
    message: appError.message,
  });
}

