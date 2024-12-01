// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query"], // Opcional: para debug
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
