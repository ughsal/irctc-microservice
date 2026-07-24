import { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

type JwtPayload = {
  id: string;
  role?: string;
  sessionId?: string;
  hash?: string;
};

function requireSecret(secret: string | undefined, name: string): string {
  if (!secret) {
    throw new Error(`${name} environment variable is required`);
  }

  return secret;
}

export function generateAccessToken(id: string): string {
  const secret = requireSecret(env.jwtAccessSecret, "JWT_ACCESS_SECRET");

  return jwt.sign({ id }, secret, {
    expiresIn: env.accessTokenExp as jwt.SignOptions["expiresIn"],
    jwtid: randomUUID(),
  });
}

export function generateRefreshToken(id: string): string {
  const secret = requireSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET");

  return jwt.sign({ id }, secret, {
    expiresIn: env.refreshTokenExp as jwt.SignOptions["expiresIn"],
    jwtid: randomUUID(),
  });
}

export function verifyRefreshToken(token: string): JwtPayload {
  const secret = requireSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET");

  return jwt.verify(token, secret) as unknown as JwtPayload;
}
