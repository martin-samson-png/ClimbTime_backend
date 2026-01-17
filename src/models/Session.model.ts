import { Prisma, SessionStatus, type Session } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { makeErr } from "../utils/error.js";

export interface CreateSession {
  createdBy: string;
  city: string;
  name: string;
  startedAt: Date;
  endedAt: Date;
}

export interface UpdateSession {
  id: string;
  city?: string;
  name?: string;
  startedAt?: Date;
  endedAt?: Date;
}

export class SessionModel {
  static async create(data: CreateSession) {
    if (data.startedAt <= new Date())
      throw makeErr(400, "La date de début doit être dans le futur");
    if (data.endedAt <= data.startedAt)
      throw makeErr(400, "La date de fin doit être avant la date de début");
    try {
      return await prisma.session.create({ data });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      )
        throw makeErr(
          409,
          "Une session identique existe déjà (ville, nom, date de début).",
        );
      throw err;
    }
  }

  static async update(updateData: UpdateSession) {
    try {
      const { id, ...data } = updateData;
      const sessionUpdate = await prisma.session.update({
        where: { id },
        data,
      });
      return sessionUpdate;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      )
        throw makeErr(
          409,
          "Une session identique existe déjà (ville, nom, date de début).",
        );
      throw err;
    }
  }

  static async findById(id: string): Promise<Session | null> {
    if (!id) throw makeErr(400, "Id obligatoire");

    const session = await prisma.session.findUnique({ where: { id } });
    return session;
  }

  static async list(filters: UpdateSession) {
    throw new Error("Not implemented");
  }

  static async setStatus(id: string, status: SessionStatus) {
    throw new Error("Not implemented");
  }
}
