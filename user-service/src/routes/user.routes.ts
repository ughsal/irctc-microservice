import { Router } from "express";
import { getUserContext } from "../middleware/getUserContext.middleware";
import { internalAuth } from "../middleware/internalAuth.middleware";
import {
  deleteProfile,
  getProfile,
  getUserInternal,
  updateProfile,
} from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/profile", getUserContext, getProfile);
userRouter.put("/profile", getUserContext, updateProfile);
userRouter.delete("/profile", getUserContext, deleteProfile);
userRouter.get("/internal/:userId", internalAuth, getUserInternal);
