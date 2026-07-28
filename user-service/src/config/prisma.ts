import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import config from "./index";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaAdapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: prismaAdapter });

if (config.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
