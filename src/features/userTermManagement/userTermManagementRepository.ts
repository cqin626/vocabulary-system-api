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

  async getUserTermsWithTermDetails(
    userId: number,
    options: {
      orderBy?:
        | Prisma.UserTermOrderByWithRelationInput
        | Prisma.UserTermOrderByWithRelationInput[];
      skip: number;
      take: number;
    }
  ) {
    return await prisma.userTerm.findMany({
      where: { userId },
      select: {
        term: {
          select: {
            id: true,
            text: true,
            senses: {
              select: {
                type: true,
                definition: true,
                examples: {
                  select: {
                    exampleSentence: true,
                  },
                },
              },
            },
          },
        },
        familiarity: true,
        createdAt: true,
      },
      ...(options.orderBy && { orderBy: options.orderBy }),
      skip: options.skip,
      take: options.take,
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
