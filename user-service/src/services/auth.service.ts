import { randomUUID } from "crypto";
import { redisClient } from "../config/redis";
import { AppError } from "../utils/error";

type AuthPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export async function registerUser(payload: AuthPayload) {
  if (!payload.email || !payload.password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = {
    id: randomUUID(),
    email: payload.email,
    name: payload.name ?? "New User",
  };

  await redisClient.set(`user:${user.id}`, JSON.stringify(user));

  return {
    message: "User registered",
    user,
  };
}

export async function loginUser(payload: AuthPayload) {
  if (!payload.email || !payload.password) {
    throw new AppError("Email and password are required", 400);
  }

  return {
    message: "Login successful",
    token: `demo-token-${randomUUID()}`,
    user: {
      email: payload.email,
    },
  };
}

