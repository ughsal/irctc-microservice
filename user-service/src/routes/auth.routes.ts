import { Router } from "express";
import {
  login,
  rotateRefreshToken,
  sendOTP,
  verifyGoogleIdToken,
  verifyOTP,
} from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/login", login);
authRouter.post("/refresh", rotateRefreshToken);
authRouter.post("/google-auth", verifyGoogleIdToken);
