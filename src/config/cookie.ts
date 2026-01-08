import { env } from "./env.js";

export const baseCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export function authCookieOptions(maxAgeMs: number) {
  return { ...baseCookieOptions, maxAge: maxAgeMs };
}
