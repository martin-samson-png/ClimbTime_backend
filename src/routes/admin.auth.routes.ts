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
import { prisma } from "../config/prisma.js";
import { invitationAdminEmail, sendEMail } from "../utils/mail.js";
import { env } from "../config/env.js";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/register",
  validate(adminRegisterSchema),
  async (req, res, next) => {
    try {
      const { token, firstname, lastname, password } = req.body;

      const inviteToken = await TokenModel.valid(token, "INVITE_ADMIN");
      if (!inviteToken.email) throw makeErr(403, "Invitation invalide");

      const existingUser = await UserModel.findByEmail(inviteToken.email);
      if (existingUser) throw makeErr(409, "Utilisateur existant");

      const passwordHash = await hashPassword(password);

      const admin = await prisma.$transaction(async (tx) => {
        await TokenModel.consume(inviteToken.id, tx);

        const created = await UserModel.create(
          {
            firstname,
            lastname,
            email: inviteToken.email!,
            passwordHash,
            role: "ADMIN",
          },
          tx
        );

        return created;
      });

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
      const isInvitExist = await TokenModel.findActiveInviteAdminByEmail(email);
      if (isInvitExist)
        throw makeErr(409, "Invitation déjà envoyée (encore valide)");
      const isUserExist = await UserModel.findByEmail(email);
      if (isUserExist) throw makeErr(409, "Utilisateur existant");
      const expiresAt = new Date(
        Date.now() + expiresInDays * 24 * 60 * 60 * 1000
      );
      const rawToken = generateRawToken();
      const tokenHash = hashRawToken(rawToken);
      const token = await TokenModel.create({
        type: "INVITE_ADMIN",
        tokenHash,
        expiresAt,
        role: "ADMIN",
        email,
      });
      if (!token.email) throw makeErr(400, "l'email est obligatoire");

      const inviteUrl = `${env.FRONT_URL}/admin/register?token=${rawToken}`;

      try {
        const mail = invitationAdminEmail(inviteUrl, expiresAt, rawToken);
        await sendEMail(
          {
            to: token.email,
            subject: mail.subject,
            html: mail.html,
            text: mail.text,
            tags: mail.tags,
          },
          token.id
        );
        return res.status(200).json({ message: "Email envoyé" });
      } catch (err) {
        console.error(err);
        await TokenModel.deleteById(token.id);
        return next(makeErr(502, "Envoi de l'email impossible"));
      }
    } catch (err) {
      next(err);
    }
  }
);
