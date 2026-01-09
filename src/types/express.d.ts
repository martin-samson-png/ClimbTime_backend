import { JwtPayload } from "jsonwebtoken";
import type { JwtAuthPayload } from "./auth.js";
import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      auth?: { userId: string; role: UserRole };
    }
  }
}
