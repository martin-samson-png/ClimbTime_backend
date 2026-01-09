import type { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../config/jwt.js";
import { baseCookieOptions } from "../config/cookie.js";
import { makeErr } from "../utils/error.js";
import type { UserRole } from "@prisma/client";

const allowedRoles = new Set<UserRole>(["ADMIN", "USER", "PARTICIPANT"]);

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  if (!token) return next(makeErr(401, "Non authentifié"));
  try {
    const decrypted = verifyJwt(token);
    if (!decrypted.sub || !decrypted.role) {
      res.clearCookie("auth", baseCookieOptions);
      return next(makeErr(401, "Token invalide"));
    }
    if (!allowedRoles.has(decrypted.role)) {
      res.clearCookie("auth", baseCookieOptions);
      return next(makeErr(401, "Token invalide"));
    }

    req.auth = { userId: decrypted.sub, role: decrypted.role };
    return next();
  } catch {
    res.clearCookie("auth", baseCookieOptions);
    return next(makeErr(401, "Token invalide ou expiré"));
  }
};
