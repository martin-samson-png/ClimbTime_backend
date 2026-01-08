import type { User, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export interface CreateUser {
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

export class UserModel {
  static async create(data: CreateUser): Promise<User> {
    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.passwordHash,
        role: data.role ?? "USER",
      },
    });
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ?? null;
  }
}
