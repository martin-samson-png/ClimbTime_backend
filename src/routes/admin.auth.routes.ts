import { Router } from "express";
import { TokenModel } from "../models/Token.model.js";
import { UserModel } from "../models/User.model.js";
import { hashPassword } from "../utils/hash.js";
import { validate } from "../middleware/validate.js";
import {
  adminRegisterSchema,
  inviteAdminSchema,
} from "../validators/adminAuth.validator.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { generateRawToken, hashRawToken } from "../utils/token.js";
import { makeErr } from "../utils/error.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/register",
  validate(adminRegisterSchema),
  async (req, res, next) => {
    try {
      const { token, firstname, lastname, email, password } = req.body;

      const inviteToken = await TokenModel.valid(token, "INVITE_ADMIN");
      if (inviteToken.email !== email)
        throw makeErr(403, "Invitation invalide");

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) throw makeErr(409, "Utilisateur existant");

      const passwordHash = await hashPassword(password);

      const admin = await UserModel.create({
        firstname,
        lastname,
        email: email.trim().toLowerCase(),
        passwordHash,
        role: "ADMIN",
      });

      await TokenModel.consume(inviteToken.id);

      res.status(201).json(sanitizeUser(admin));
    } catch (err) {
      next(err);
    }
  }
);

adminAuthRouter.post(
  "/invite",
  checkAuth,
  checkRole("ADMIN"),
  validate(inviteAdminSchema),
  async (req, res, next) => {
    try {
      const { email, expiresInDays } = req.body;
      const isUserExist = await UserModel.findByEmail(email);
      if (isUserExist) throw makeErr(409, "Utilisatuer existant");
      const expiresAt = new Date(
        Date.now() + expiresInDays * 24 * 60 * 60 * 1000
      );
      const rawToken = generateRawToken();
      const tokenHash = hashRawToken(rawToken);
      await TokenModel.create({
        type: "INVITE_ADMIN",
        tokenHash,
        expiresAt,
        role: "ADMIN",
        email,
      });
      res.status(201).json({ token: rawToken });
    } catch (err) {
      next(err);
    }
  }
);
