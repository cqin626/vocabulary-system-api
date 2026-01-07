import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
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

  async getUserDetails(email: string, select: Prisma.UserSelect) {
    return await prisma.user.findUnique({
      where: { email },
      select: select,
    });
  }

  async getRefreshToken(tokenHash: string) {
    return await prisma.refreshToken.findFirst({
      where: { token: tokenHash },
      select: {
        token: true,
        expiresAt: true,
        revoked: true,
      },
    });
  }

  async createRefreshToken(tokenHash: string, userId: number, expiresAt: Date) {
    return await prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId,
        expiresAt,
      },
    });
  }

  async invalidateRefreshToken(tokenHash: string) {
    return await prisma.refreshToken.updateMany({
      where: { token: tokenHash },
      data: { revoked: true },
    });
  }

  async invalidateAllRefreshTokensByUserId(userId: number) {
    return await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}

export const authRepo = new AuthRepository();
