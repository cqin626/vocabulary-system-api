import { prisma } from "../../config/prisma.js";
import { NewTerm } from "../../shared/types/termTypes.js";

export class TermManagementRepository {
  async getTermByText(text: string) {
    return await prisma.term.findUnique({
      where: { text },
      include: { senses: { include: { examples: true } } },
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

  async termExists(text: string) {
    const termCount = await prisma.term.count({
      where: { text },
    });
    return termCount > 0;
  }

  async insertTerm(newTerm: NewTerm) {
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
      include: {
        senses: {
          include: { examples: true },
        },
      },
    });
  }
}

export const termManagementRepo = new TermManagementRepository();
