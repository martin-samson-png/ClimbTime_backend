import type { UserRole, TokenType, Token } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { hashRawToken } from "../utils/token.js";
import { makeErr } from "../utils/error.js";

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
    if (!data.type) throw makeErr(400, "Token type est obligatoire");
    if (!data.tokenHash) throw makeErr(400, "TokenHash est obligatoire");
    if (!(data.expiresAt instanceof Date))
      throw makeErr(400, "expireAt doit être une Date ");
    if (data.expiresAt <= new Date())
      throw makeErr(
        400,
        "La date d'expiration doit être ultérieur a la date du jour"
      );
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
    if (!rawToken) throw makeErr(400, "rawToken est obligatoire");

    const tokenHash = hashRawToken(rawToken);

    const token = await prisma.token.findUnique({
      where: { tokenHash: tokenHash },
    });

    if (!token) throw makeErr(404, "Token invalide ou expiré");
    if (token.usedAt) throw makeErr(409, "Token déjà utilisé");
    if (token.expiresAt <= new Date()) throw makeErr(400, "Token invalide");
    if (expectedType && token.type !== expectedType)
      throw makeErr(403, "Type de token invalide");

    return token;
  }

  static async consume(id: string): Promise<void> {
    if (!id) throw makeErr(400, "Id obligatoire");
    const result = await prisma.token.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (result.count === 0)
      throw makeErr(409, "Token invalide ou déjà utilisé");
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
