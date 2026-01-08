import type { PrismaClient } from "@prisma/client";
import { prisma } from "./../config/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

export {};
