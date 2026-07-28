import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { AppError } from "../utils/error";

export function internalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const internalKey = req.header("x-internal-service-key");

  if (!internalKey || internalKey !== config.INTERNAL_SERVICE_KEY) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  next();
}
