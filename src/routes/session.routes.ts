import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";
import { validate } from "../middleware/validate.js";
import {
  sessionCreateSchema,
  sessionFindSchema,
  sessionIdParamsSchema,
  sessionSetStatusBodySchema,
  sessionUpdateSchema,
} from "../validators/session.validator.js";
import { SessionModel } from "../models/Session.model.js";
import { makeErr } from "../utils/error.js";
import type { SessionStatus } from "@prisma/client";
import { isStatusTransitionAllowed } from "../domain/sessions/session.transitions.js";

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
  "/:id/update",
  checkAuth,
  checkRole("ADMIN"),
  validate(sessionIdParamsSchema, "params"),
  validate(sessionUpdateSchema),
  async (req, res, next) => {
    try {
      const patch = req.body;
      const sessionId = req.params.id;

      if (!sessionId) throw makeErr(400, "Id manquant.");

      const session = await SessionModel.findById(sessionId);
      if (!session) throw makeErr(404, "Session introuvable");

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

sessionRouter.patch(
  "/:id/status",
  checkAuth,
  checkRole("ADMIN"),
  validate(sessionIdParamsSchema, "params"),
  validate(sessionSetStatusBodySchema),
  async (req, res, next) => {
    try {
      const { status }: { status: SessionStatus } = req.body;
      const sessionId = req.params.id;

      if (!sessionId) throw makeErr(400, "Id manquant.");

      const session = await SessionModel.findById(sessionId);
      if (!session) throw makeErr(404, "Session introuvable");

      if (session.status === status) return res.status(200).json(session);

      const allowedTransition = isStatusTransitionAllowed(
        session.status,
        status,
      );
      if (!allowedTransition)
        throw makeErr(
          409,
          `Transition interdite : ${session.status} -> ${status}`,
        );
      const sessionUpdated = await SessionModel.setStatus({
        id: sessionId,
        fromStatus: session.status,
        toStatus: status,
      });
      return res.status(200).json(sessionUpdated);
    } catch (err) {
      next(err);
    }
  },
);

sessionRouter.get(
  "/",
  validate(sessionFindSchema, "query"),
  async (_req, res, next) => {
    try {
      const query = res.locals.query;
      const sessions = await SessionModel.list(query);
      return res.status(200).json(sessions);
    } catch (err) {
      next(err);
    }
  },
);
