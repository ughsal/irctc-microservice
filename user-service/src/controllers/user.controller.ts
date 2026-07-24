import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import * as userService from "../services/user.service";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("User Id is missing", 400);
  }

  const user = await userService.getProfile(userId);

  res.status(200).json({
    success: true,
    message: "Fetched user details",
    data: {
      user,
    },
  });
});

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

export const getUserInternal = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = String(req.params.userId ?? "");

    if (!userId) {
      throw new AppError("User Id is missing", 400);
    }

    const user = await userService.getProfile(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  },
);
