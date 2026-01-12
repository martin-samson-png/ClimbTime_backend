import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import argon2 from "argon2";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.validator.js";
import { UserModel } from "../models/User.model.js";
import { makeErr } from "../utils/error.js";
import { signJwt } from "../config/jwt.js";
import { authCookieOptions, baseCookieOptions } from "../config/cookie.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { checkAuth } from "../middleware/checkAuth.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const isUserExist = await UserModel.findByEmail(email);
      if (!isUserExist) throw makeErr(401, "Utilisateur introuvable");

      const verifyPassword = await argon2.verify(
        isUserExist.password,
        password
      );
      if (!verifyPassword) throw makeErr(401, "Utilisateur introuvable");

      const expiresInHours = 8;

      const token = signJwt(
        { sub: isUserExist.id, role: isUserExist.role },
        `${expiresInHours}h`
      );

      res.cookie("auth", token, authCookieOptions(expiresInHours));
      return res.status(200).json({ message: "OK" });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.get(
  "/me",
  checkAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.userId;
      if (!userId) throw makeErr(401, "Non authentifié");

      const user = await UserModel.findById(userId);
      if (!user) throw makeErr(401, "Session invalide");
      return res.status(200).json(sanitizeUser(user));
    } catch (err) {
      console.error(err);
      res.clearCookie("auth", baseCookieOptions);
      next(err);
    }
  }
);

authRouter.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("auth", baseCookieOptions);
  return res.status(204).end();
});
