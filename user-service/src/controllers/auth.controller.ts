import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import { registerUser, loginUser } from "../services/auth.service";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

export const register = asyncHandler(
  async (req: Request<unknown, unknown, RegisterBody>, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const result = await registerUser({ email, password, name });

    res.status(201).json({
      success: true,
      ...result,
    });
  },
);

export const login = asyncHandler(
  async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      ...result,
    });
  },
);
