import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/error";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  },
);

export const updateProfile = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      message: "Profile update is not implemented yet",
    });
  },
);

export const deleteProfile = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(501).json({
      success: false,
      message: "Profile deletion is not implemented yet",
    });
  },
);
