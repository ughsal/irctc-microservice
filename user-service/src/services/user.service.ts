import { prisma } from "../config/prisma";
import { redisClient } from "../config/redis";
import { AppError } from "../utils/error";
import config from "../config";

export async function getProfile(userId: string) {
  const cachedUser = await redisClient.get(`user:${userId}`);

  if (cachedUser) {
    return JSON.parse(cachedUser) as {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      emailVerified: boolean;
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await redisClient.set(`user:${userId}`, JSON.stringify(user), {
    EX: config.REDIS_USER_TTL,
  });

  return user;
}
