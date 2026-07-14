import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user ?? null,
  });
});

