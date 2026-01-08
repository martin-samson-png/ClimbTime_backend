import type { UserRole, TokenType, Token } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { hashToken } from "../utils/hash.js";

export interface CreateTokenInput {
  type: TokenType;
  tokenHash: string;
  expiresAt: Date;
  userId?: string;
  email?: string;
  sessionId?: string;
  role?: UserRole;
}

export class TokenModel {
  static async create(data: CreateTokenInput): Promise<Token> {
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

  static async valid(
    rawToken: string,
    expectedType?: TokenType
  ): Promise<Token> {
    if (!rawToken) {
      const err = new Error("rawToken is required");
      (err as any).status = 400;
      throw err;
    }

    const tokenHash = hashToken(rawToken);

    const token = await prisma.token.findUnique({
      where: { tokenHash: tokenHash },
    });

    if (!token) {
      const err = new Error("Invalid or expired token");
      (err as any).status = 404;
      throw err;
    }
    if (token.usedAt) {
      const err = new Error("Token already used");
      (err as any).status = 409;
      throw err;
    }
    if (token.expiresAt <= new Date()) {
      const err = new Error("Invalid token");
      (err as any).status = 400;
      throw err;
    }
    if (expectedType && token.type !== expectedType) {
      const err = new Error("Invalid token type");
      (err as any).status = 403;
      throw err;
    }

    return token;
  }

  static async consume(id: string): Promise<void> {
    if (!id) {
      const err = new Error("Id required");
      (err as any).status = 400;
      throw err;
    }
    const result = await prisma.token.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (result.count === 0) {
      const err = new Error("Token already used or not found");
      (err as any).status = 409;
      throw err;
    }
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
