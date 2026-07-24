import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/error";

export function internalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const internalKey = req.header("x-internal-service-key");

  if (!internalKey || internalKey !== env.internalServiceKey) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  next();
}
