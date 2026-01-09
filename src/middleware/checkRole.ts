import type { NextFunction, Request, Response } from "express";
import { makeErr } from "../utils/error.js";
import { UserRole } from "@prisma/client";

export const checkRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(makeErr(401, "Non authentifié"));

    const allowed = new Set<UserRole>(roles);
    if (!allowed.has(req.auth.role))
      return next(makeErr(403, "Accès non authorisé"));

    return next();
  };
};
