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
    const userCount = await prisma.user.count({
      where: {
        email: email,
      },
    });
    return userCount > 0;
  }

  async getUserPasswordHash(email: string) {
    return (
      (
        await prisma.user.findFirst({
          where: {
            email: email,
          },
          select: { passwordHash: true },
        })
      )?.passwordHash ?? ""
    );
  }
}

export const authRepo = new AuthRepository();
