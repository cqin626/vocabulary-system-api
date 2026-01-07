import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { UserTermFamiliarityEnum } from "../../shared/types/userTermTypes.js";
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
      orderBy: Record<string, "asc" | "desc">[];
      skip: number;
      take: number;
    }
  ) {
    const formattedOrderBy: Prisma.UserTermOrderByWithRelationInput[] =
      options.orderBy.map((orderByItem) => {
        if ("text" in orderByItem)
          return {
            term: { text: orderByItem.text },
          };
        return orderByItem;
      });
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
      orderBy: formattedOrderBy,
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

  async deleteUserTerm(userId: number, termId: number) {
    return await prisma.userTerm.delete({
      where: {
        userId_termId: {
          termId,
          userId,
        },
      },
    });
  }

  async updateUserTermFamiliarity(
    userId: number,
    termId: number,
    familiarity: UserTermFamiliarityEnum
  ) {
    return await prisma.userTerm.update({
      where: {
        userId_termId: {
          termId,
          userId,
        },
      },
      data: {
        familiarity: familiarity,
      },
    });
  }
}

export const userTermManagementRepo = new UserTermManagementRepository();
