import type { UserRole } from "@prisma/client";

export interface JwtAuthPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
