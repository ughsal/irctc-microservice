import type { Request, Response } from "express";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import * as authService from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import config from "../config";
const isProd = env.nodeEnv === "production";

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("strict" as const) : ("lax" as const),
  maxAge,
});

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new AppError("All fields are mandatory", 400);
  }

  if (password !== confirmPassword) {
    throw new AppError("Password mismatch", 400);
  }

  const { otpSessionId } = await authService.sendOTP(
    firstName,
    lastName,
    email,
    password,
  );

  res
    .cookie("otp_session", otpSessionId, cookieOptions(env.otpTtl * 1000))
    .status(200)
    .json({
      success: true,
      message: "OTP sent successfully",
    });
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  let requestBody: Record<string, unknown> = req.body ?? {};

  if (typeof req.body === "string") {
    try {
      requestBody = JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      requestBody = {};
    }
  }

  const otp = String(requestBody.otp ?? "").trim();
  const bodyOtpSessionId = String(requestBody.otpSessionId ?? "").trim();
  const cookieOtpSessionId = String(req.cookies?.otp_session ?? "").trim();
  const otpSessionId = cookieOtpSessionId || bodyOtpSessionId;

  if (!otp) {
    throw new AppError("OTP is missing", 400);
  }

  if (!otpSessionId) {
    throw new AppError("OTP session is missing", 400);
  }

  const user = await authService.verifyOTP(otp, otpSessionId);

  res.clearCookie("otp_session");

  res.status(201).json({
    success: true,
    message: "User Account created successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and Password are required", 400);
  }

  const deviceId = getDeviceFingerprint(req);
  const { accessToken, refreshToken, loggedInUser } = await authService.login(
    email,
    password,
    deviceId,
  );

  res
    .cookie(
      "accessToken",
      accessToken,
      cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000),
    )
    .cookie(
      "refreshToken",
      refreshToken,
      cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000),
    )
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      loggedInUser,
    });
});

export const rotateRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is missing. Login again.");
    }

    const deviceId = getDeviceFingerprint(req);
    const { newAccessToken, newRefreshToken } =
      await authService.rotateRefreshToken(refreshToken, deviceId);

    res
      .cookie(
        "accessToken",
        newAccessToken,
        cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000),
      )
      .cookie(
        "refreshToken",
        newRefreshToken,
        cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000),
      )
      .status(200)
      .json({
        success: true,
        message: "Access and Refresh token reissued",
      });
  },
);

export const verifyGoogleIdToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      throw new AppError("Invalid Google ID Token", 400);
    }

    const deviceId = getDeviceFingerprint(req);
    const { accessToken, refreshToken, loggedInUser } =
      await authService.verifyGoogleIdToken(idToken, deviceId);

    res
      .cookie(
        "accessToken",
        accessToken,
        cookieOptions(config.ACCESS_TOKEN_EXP_SEC * 1000),
      )
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(config.REFRESH_TOKEN_EXP_SEC * 1000),
      )
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        loggedInUser,
      });
  },
);
