import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  req.user = {
    id: "demo-user",
    email: "demo@example.com",
    role: "user",
  };

  next();
}

