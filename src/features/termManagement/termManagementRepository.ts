import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { TermType } from "../../shared/types/termTypes.js";

export class TermManagementRepository {
  async getTermByText(text: string, select: Prisma.TermSelect) {
    return await prisma.term.findUnique({
      where: { text },
      select,
    });
  }

  async getTerms(skip: number, take: number) {
    return await prisma.term.findMany({
      include: { senses: { include: { examples: true } } },
      orderBy: { id: "asc" },
      skip: skip,
      take: take,
    });
  }

  async termExists(identifier: string | number) {
    const termCount = await prisma.term.count({
      where:
        typeof identifier === "string"
          ? { text: identifier }
          : { id: identifier },
    });
    return termCount > 0;
  }

  async insertTerm(newTerm: TermType, select: Prisma.TermSelect) {
    return await prisma.term.create({
      data: {
        text: newTerm.text,
        senses: {
          create: newTerm.senses.map((sense) => ({
            type: sense.type,
            definition: sense.definition,
            examples: {
              create: sense.examples.map((example) => ({
                exampleSentence: example,
              })),
            },
          })),
        },
      },
      select,
    });
  }
}

export const termManagementRepo = new TermManagementRepository();
