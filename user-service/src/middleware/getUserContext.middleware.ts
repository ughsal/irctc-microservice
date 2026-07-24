import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/error";

function requireAccessSecret(): string {
  if (!env.jwtAccessSecret) {
    throw new Error("JWT_ACCESS_SECRET environment variable is required");
  }

  return env.jwtAccessSecret;
}

export function getUserContext(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const accessToken = req.cookies?.accessToken ?? req.header("authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  try {
    const payload = jwt.verify(accessToken, requireAccessSecret()) as {
      id?: string;
      email?: string;
      role?: string;
    };

    if (!payload.id || !payload.email) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role ?? "user",
    };

    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}
