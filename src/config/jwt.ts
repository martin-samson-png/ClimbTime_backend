import { env } from "./env.js";
import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: "ADMIN" | "USER" | "PARTICIPANT";
}

type JwtExpriresIn = SignOptions["expiresIn"];

export const signJwt = (payload: JwtPayload, expiresIn: JwtExpriresIn) => {
  const options: SignOptions = {};
  if (expiresIn !== undefined) {
    options.expiresIn = expiresIn;
  }
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
