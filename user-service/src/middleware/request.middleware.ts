import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger";

export function requestMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = randomUUID();
  logger.info(`${req.method} ${req.url} [${req.requestId}]`);
  next();
}

