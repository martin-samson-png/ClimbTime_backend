import crypto from "node:crypto";
import { env } from "../config/env.js";

export const generateRawToken = (byte = 32): string => {
  return crypto.randomBytes(byte).toString("base64url");
};

export const hashRawToken = (rawToken: string): string => {
  return crypto
    .createHmac("sha256", env.TOKEN_HMAC_SECRET)
    .update(rawToken)
    .digest("hex");
};
