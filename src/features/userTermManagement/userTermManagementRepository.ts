import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

export class UserTermManagementRepository {
  async getUserTermDetails(
    termId: number,
    userId: number,
    select: Prisma.UserTermSelect
  ) {
    return await prisma.userTerm.findUnique({
      where: {
        userId_termId: {
          termId,
          userId,
        },
      },
      select: select,
    });
  }

  async userTermExists(userId: number, termId: number) {
    const userTermCount = await prisma.userTerm.count({
      where: {
        userId,
        termId,
      },
    });
    return userTermCount > 0;
  }

  async insertUserTerm(
    userId: number,
    termId: number,
    select: Prisma.UserTermSelect
  ) {
    return await prisma.userTerm.create({
      data: {
        userId,
        termId,
      },
      select,
    });
  }
}

export const userTermManagementRepo = new UserTermManagementRepository();
