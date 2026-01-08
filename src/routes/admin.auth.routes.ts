import { Router } from "express";
import { TokenModel } from "../models/Token.model.js";
import { UserModel } from "../models/User.model.js";
import { hashPassword } from "../utils/hash.js";
import { validate } from "../middleware/validate.js";
import { adminRegisterSchema } from "../validators/adminAuth.validator.js";
import { sanitizeUser } from "../utils/sanitize.js";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/register",
  validate(adminRegisterSchema),
  async (req, res, next) => {
    try {
      const { token, firstname, lastname, email, password } = req.body;

      const inviteToken = await TokenModel.valid(token, "INVITE_ADMIN");
      if (inviteToken.email !== email) {
        const err = new Error("Invalid invitation");
        (err as any).status = 403;
        throw err;
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        const err = new Error("User already exists");
        (err as any).status = 409;
        throw err;
      }

      const passwordHash = await hashPassword(password);

      const admin = await UserModel.create({
        firstname,
        lastname,
        email,
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

adminAuthRouter.post("/login", async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

adminAuthRouter.post("/invite", async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});
