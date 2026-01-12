import { Router } from "express";
import { adminAuthRouter } from "./admin.auth.routes.js";
import { authRouter } from "./auth.routes.js";

export const router = Router();

router.use("/admin/auth", adminAuthRouter);

router.use("/auth", authRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
