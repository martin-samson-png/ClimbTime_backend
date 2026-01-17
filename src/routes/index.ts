import { Router } from "express";
import { adminAuthRouter } from "./admin.auth.routes.js";
import { authRouter } from "./auth.routes.js";
import { sessionRouter } from "./session.routes.js";

export const router = Router();

router.use("/admin/auth", adminAuthRouter);

router.use("/auth", authRouter);

router.use("/session", sessionRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
