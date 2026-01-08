import type { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export type TokenType =
  | "INVITE_ADMIN"
  | "INVITE_JURY"
  | "EMAIL_VERIFY"
  | "RESET_PASSWORD";

export interface CreateTokenInuput {
  type: TokenType;
  tokenHash: string;
  expiresAt: Date;
  userId?: string;
  email?: string;
  sessionId?: string;
  role?: UserRole;
}

export class TokenModel {
  static async create(data: CreateTokenInuput) {
    if (!data.type) {
      const err = new Error("Token type is required");
      (err as any).status = 400;
      throw err;
    }
    if (!data.tokenHash) {
      const err = new Error("Token hash is required");
      (err as any).status = 400;
      throw err;
    }
    if (!(data.expiresAt instanceof Date)) {
      const err = new Error("expiresAtmust be a Date");
      (err as any).status = 400;
      throw err;
    }
    if (data.expiresAt <= new Date()) {
      const err = new Error("expiresAt must be in the future");
      (err as any).status = 400;
      throw err;
    }
    const token = await prisma.token.create({
      data: {
        type: data.type,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userId: data.userId ?? null,
        email: data.email ?? null,
        sessionId: data.sessionId ?? null,
        role: data.role ?? null,
      },
    });
    return token;
  }

  static async findValidByType(type: TokenType) {
    throw new Error("Not implemented");
  }

  static async findById(id: string) {
    throw new Error("Not implemented");
  }

  static async deleteById(id: string) {
    throw new Error("Not implemented");
  }

  static async deleteExpired() {
    throw new Error("Not implemented");
  }
}
