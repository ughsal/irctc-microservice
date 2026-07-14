import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getCurrentUser } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/me", authMiddleware, getCurrentUser);

