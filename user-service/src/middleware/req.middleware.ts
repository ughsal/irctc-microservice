import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function reqLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = randomUUID();
  req.requestId = requestId;

  const start = Date.now();
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms [${requestId}]`,
    );
  });

  next();
}
