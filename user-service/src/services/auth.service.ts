import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/errors";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth";
import { generateAndStoreOtp, verifyOtp } from "../utils/otp";
import { verifyOtpEmail } from "./email";
import { notificationProducer } from "../kafka/producer/notification.producer";
import config from "../config";

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID ?? "");

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  loggedInUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export async function sendOTP(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ otpSessionId: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("user already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const meta = { firstName, lastName, email, hashedPassword };
  const { otp, otpSessionId } = await generateAndStoreOtp(meta);

  await notificationProducer.sendOtpEmail(email, otp, config.OTP_TTL / 60);
  logger.info(`OTP email queued for: ${email}`);

  return { otpSessionId };
}

export async function verifyOTP(
  otp: string,
  otpSessionId: string,
): Promise<LoginResult["loggedInUser"]> {
  const meta = await verifyOtp(otp, otpSessionId);

  if (!meta) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  const user = await prisma.user.create({
    data: {
      firstName: meta.firstName,
      lastName: meta.lastName,
      email: meta.email,
      password: meta.hashedPassword,
      emailVerified: true,
    },
  });

  await verifyOtpEmail({
    email: meta.email,
    firstName: meta.firstName,
  });

  await notificationProducer.sendWelcomeEmail(meta.email, meta.firstName);
  logger.info(`Welcome email queued for ${meta.email}`);

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function login(
  email: string,
  password: string,
  deviceId: string,
): Promise<LoginResult> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!existingUser.password) {
    throw new BadRequestError(
      "This account was created with Google. Please sign in with Google.",
    );
  }

  const doesPasswordMatch = await bcrypt.compare(
    password,
    existingUser.password,
  );

  if (!doesPasswordMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = generateAccessToken(existingUser.id);
  const refreshToken = generateRefreshToken(existingUser.id);
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    jti?: string;
  } | null;

  if (!decodedRefreshToken?.jti) {
    throw new BadRequestError("Unable to create refresh token");
  }

  await redisClient.set(
    `refresh:${existingUser.id}:${deviceId}`,
    decodedRefreshToken.jti,
    {
      EX: config.REFRESH_TOKEN_EXP_SEC,
    },
  );

  const { password: _password, ...safeUser } = existingUser;

  await redisClient.set(`user:${existingUser.id}`, JSON.stringify(safeUser), {
    EX: config.REDIS_USER_TTL,
  });

  return {
    accessToken,
    refreshToken,
    loggedInUser: {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: safeUser.email,
      emailVerified: safeUser.emailVerified,
      createdAt: safeUser.createdAt,
      updatedAt: safeUser.updatedAt,
    },
  };
}

export async function rotateRefreshToken(
  refreshToken: string,
  deviceId: string,
): Promise<{
  newAccessToken: string;
  newRefreshToken: string;
  deviceId: string;
}> {
  const payload = verifyRefreshToken(refreshToken);
  const userId = payload.id;
  const jti = jwt.decode(refreshToken) as { jti?: string } | null;

  if (!jti?.jti) {
    throw new BadRequestError("Invalid refresh token");
  }

  const storedJti = await redisClient.get(`refresh:${userId}:${deviceId}`);

  if (!storedJti) {
    throw new ForbiddenError("Session Expired");
  }

  if (storedJti !== jti.jti) {
    await redisClient.del(`refresh:${userId}:${deviceId}`);
    throw new ForbiddenError("Refresh token reused");
  }

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);
  const decodedNewRefresh = jwt.decode(newRefreshToken) as {
    jti?: string;
  } | null;

  if (!decodedNewRefresh?.jti) {
    throw new BadRequestError("Unable to create refresh token");
  }

  await redisClient.set(
    `refresh:${userId}:${deviceId}`,
    decodedNewRefresh.jti,
    {
      EX: config.REFRESH_TOKEN_EXP_SEC,
    },
  );

  return { newAccessToken, newRefreshToken, deviceId };
}

export async function verifyGoogleIdToken(
  idToken: string,
  deviceId: string,
): Promise<LoginResult> {
  if (!config.GOOGLE_CLIENT_ID) {
    throw new BadRequestError("Google client id is missing");
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new UnauthorizedError("Invalid Google Token Payload");
  }

  const googleUser = {
    provider: "google",
    providerId: payload.sub,
    email: payload.email,
    firstName: payload.given_name ?? "",
    lastName: payload.family_name ?? "",
    emailVerified: payload.email_verified ?? false,
  };

  const user = await prisma.$transaction(async tx => {
    const googleAuth = await tx.authProvider.findUnique({
      where: {
        provider_providerId: {
          provider: googleUser.provider,
          providerId: googleUser.providerId,
        },
      },
      include: {
        user: true,
      },
    });

    if (googleAuth) {
      return googleAuth.user;
    }

    const existingUser = await tx.user.findUnique({
      where: { email: googleUser.email },
    });

    if (existingUser) {
      await tx.authProvider.create({
        data: {
          provider: googleUser.provider,
          providerId: googleUser.providerId,
          userId: existingUser.id,
        },
      });

      return existingUser;
    }

    return await tx.user.create({
      data: {
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        emailVerified: googleUser.emailVerified,
        authProviders: {
          create: {
            provider: googleUser.provider,
            providerId: googleUser.providerId,
          },
        },
      },
    });
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    jti?: string;
  } | null;

  if (!decodedRefreshToken?.jti) {
    throw new BadRequestError("Unable to create refresh token");
  }

  await redisClient.set(
    `refresh:${user.id}:${deviceId}`,
    decodedRefreshToken.jti,
    {
      EX: config.REFRESH_TOKEN_EXP_SEC,
    },
  );

  const { password: _password, ...safeUser } = user;

  await redisClient.set(`user:${user.id}`, JSON.stringify(safeUser), {
    EX: config.REDIS_USER_TTL,
  });

  return {
    accessToken,
    refreshToken,
    loggedInUser: {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: safeUser.email,
      emailVerified: safeUser.emailVerified,
      createdAt: safeUser.createdAt,
      updatedAt: safeUser.updatedAt,
    },
  };
}
