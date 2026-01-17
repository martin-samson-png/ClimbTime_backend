import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { makeErr } from "../utils/error.js";

export interface CreateSession {
  createdBy: string;
  city: string;
  name: string;
  startedAt: Date;
  endedAt: Date;
}

export class SessionModel {
  static async create(data: CreateSession) {
    if (data.startedAt <= new Date())
      throw makeErr(
        400,
        "La date de début doit être ultérieur a la date du jour",
      );
    if (data.endedAt <= data.startedAt)
      throw makeErr(
        400,
        "La dat de fin doit être ulterieur a la date de début",
      );
    try {
      return await prisma.session.create({ data });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw makeErr(
          409,
          "Une session identique existe déjà (ville, nom, date de début).",
        );
      }
      throw err;
    }
  }
}
