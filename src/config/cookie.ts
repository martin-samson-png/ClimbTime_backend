import { env } from "./env.js";

export const baseCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export const authCookieOptions = (hours: number) => {
  return { ...baseCookieOptions, maxAge: hours * 60 * 60 * 1000 };
};
