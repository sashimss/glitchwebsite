// To avoid re-instantiation of Prsima Client on Hot Reload

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // optional: logs SQL queries
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
