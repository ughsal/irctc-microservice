import { createHash, randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthTokenPayload = jwt.JwtPayload & {
  id: string;
  jti?: string;
};

function requireSecret(secret: string | undefined, name: string): string {
  if (!secret) {
    throw new Error(`${name} environment variable is required`);
  }

  return secret;
}

export function generateAccessToken(userId: string): string {
  const secret = requireSecret(env.jwtAccessSecret, "JWT_ACCESS_SECRET");
  return jwt.sign({ id: userId }, secret, {
    expiresIn: env.accessTokenExp as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshToken(userId: string): string {
  const secret = requireSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET");

  return jwt.sign(
    {
      id: userId,
      jti: randomUUID(),
    },
    secret,
    {
      expiresIn: env.refreshTokenExp as jwt.SignOptions["expiresIn"],
    },
  );
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const secret = requireSecret(env.jwtAccessSecret, "JWT_ACCESS_SECRET");

  return jwt.verify(token, secret) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  const secret = requireSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET");

  return jwt.verify(token, secret) as AuthTokenPayload;
}
