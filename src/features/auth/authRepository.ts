import { prisma } from "../../config/prisma.js";
import { UserType } from "../../shared/types/userTypes.js";

export class AuthRepository {
  async createUser(newUser: UserType) {
    // newUser.password is expected to be hashed
    return await prisma.user.create({
      data: {
        email: newUser.email,
        passwordHash: newUser.password,
      },
      select: {
        email: true,
        createdAt: true,
      },
    });
  }

  async userExists(email: string) {
    const id = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: { id: true },
    });
    return !!id;
  }
}

export const authRepo = new AuthRepository();
