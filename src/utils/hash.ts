import crypto from "node:crypto";
import argon2 from "argon2";
import { env } from "../config/env.js";

export const hashToken = (rawToken: string): string => {
  return crypto
    .createHmac("sha256", env.TOKEN_HMAC_SECRET)
    .update(rawToken)
    .digest("hex");
};

export const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, { type: argon2.argon2id });
};
