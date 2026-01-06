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
}

export const userTermManagementRepo = new UserTermManagementRepository();
