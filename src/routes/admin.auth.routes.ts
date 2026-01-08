import { Router } from "express";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

adminAuthRouter.post("/invite", async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

adminAuthRouter.post("/register", async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});
