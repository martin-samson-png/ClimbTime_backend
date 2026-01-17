import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import { sessionCreateSchema } from "../validators/session.validator.js";
import { SessionModel } from "../models/Session.model.js";

export const sessionRouter = Router();

sessionRouter.post(
  "/create",
  checkAuth,
  checkRole("ADMIN"),
  validate(sessionCreateSchema),
  async (req, res, next) => {
    const data = req.body;
    const createdBy = req.auth?.userId;
    const session = await SessionModel.create({ createdBy, ...data });
    res.status(201).json(session);
  },
);
