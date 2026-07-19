import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaAdapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: prismaAdapter });

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
