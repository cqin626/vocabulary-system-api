import {
  TermManagementRepository,
  termManagementRepo,
} from "./termManagementRepository.js";
import {
  ResourceNotFoundError,
  ConflictError,
} from "../../shared/errors/HTTPErrors.js";
import { TermType } from "../../shared/types/termTypes.js";
import { getNormalizedText } from "../../shared/utils/termUtils.js";

const termSelect = {
  id: true,
  text: true,
  senses: {
    select: {
      type: true,
      definition: true,
      examples: { select: { exampleSentence: true } },
    },
  },
} as const;

export class TermManagementService {
  constructor(private readonly repo: TermManagementRepository) {}

  async getTermByText(text: string) {
    const normalizedText = getNormalizedText(text);
    const term = await this.repo.getTermByText(normalizedText, termSelect);

    if (!term) throw new ResourceNotFoundError("Term not found");

    return term;
  }

  async getTermsWithMetadata(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.repo.getTerms(skip, limit);
  }

  async insertTerm(newTerm: TermType) {
    newTerm.text = getNormalizedText(newTerm.text);
    const termExists = await this.repo.termExists(newTerm.text);

    if (termExists) throw new ConflictError("Term already exists");

    const term = await this.repo.insertTerm(newTerm, termSelect);

    return term;
  }

  async termExists(identifier: string | number) {
    return await this.repo.termExists(identifier);
  }
}

export const termManagementService = new TermManagementService(
  termManagementRepo
);
