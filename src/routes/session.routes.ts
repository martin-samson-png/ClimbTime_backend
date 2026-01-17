import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import {
  sessionCreateSchema,
  sessionUpdateSchema,
} from "../validators/session.validator.js";
import { SessionModel } from "../models/Session.model.js";
import { makeErr } from "../utils/error.js";

export const sessionRouter = Router();

sessionRouter.post(
  "/create",
  checkAuth,
  checkRole("ADMIN"),
  validate(sessionCreateSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const createdBy = req.auth?.userId;
      const session = await SessionModel.create({ createdBy, ...data });
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },
);

sessionRouter.patch(
  "/:id",
  checkAuth,
  validate(sessionUpdateSchema),
  async (req, res, next) => {
    try {
      const patch = req.body;
      const sessionId = req.params.id;
      const userId = req.auth?.userId;

      if (!sessionId) throw makeErr(400, "Id manquant.");

      const session = await SessionModel.findById(sessionId);
      if (!session) throw makeErr(404, "Session introuvable");
      if (userId !== session.createdBy)
        throw makeErr(403, "Vous n'avez pas les droits.");

      const newStartedAt = patch.startedAt ?? session.startedAt;
      const newEndedAt = patch.endedAt ?? session.endedAt;
      if (patch.startedAt && newStartedAt <= new Date())
        throw makeErr(400, "La date de début doit être dans le futur");
      if (newEndedAt <= newStartedAt)
        throw makeErr(400, "La date de fin doit être après la date de début");

      const updateData = Object.fromEntries(
        Object.entries(patch)
          .filter(([_, v]) => v !== undefined)
          .filter(([k]) =>
            ["name", "city", "startedAt", "endedAt"].includes(k),
          ),
      );
      const sessionUpdated = await SessionModel.update({
        id: sessionId,
        ...updateData,
      });
      res.status(200).json(sessionUpdated);
    } catch (err) {
      next(err);
    }
  },
);
